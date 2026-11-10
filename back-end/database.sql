
DROP TRIGGER IF EXISTS ask_permission ON permit;
DROP TRIGGER IF EXISTS refresh_balance ON permit;
DROP TRIGGER IF EXISTS check_duration ON permit;
DROP TRIGGER IF EXISTS block_changes ON permit;
DROP TRIGGER IF EXISTS report_permit ON review;
DROP TRIGGER IF EXISTS default_balance ON users;

DROP TABLE IF EXISTS review;
DROP TABLE IF EXISTS permit_documents;
DROP TABLE IF EXISTS permit;
DROP TABLE IF EXISTS permit_type;
DROP TABLE IF EXISTS users;

CREATE OR REPLACE FUNCTION deduct_balance()
RETURNS trigger AS $$
DECLARE
  v_balance   jsonb;
  v_year      text;
  v_val       int;
  v_take      int;
  v_remaining int := NEW.leave_duration;
BEGIN
  SELECT balance INTO v_balance FROM users WHERE id_ = NEW.account_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User % not found', NEW.account_id;
  END IF;

  IF NOT (OLD.permit_status = 'waiting' AND NEW.permit_status = 'accordee') THEN
    RETURN NEW;
  END IF;

  FOR v_year, v_val IN
    SELECT key, value::int FROM jsonb_each_text(v_balance) ORDER BY key::int
  LOOP
    EXIT WHEN v_remaining <= 0;

    v_take      := LEAST(v_val, v_remaining);
    v_remaining := v_remaining - v_take;

    IF v_val - v_take = 0 THEN
      v_balance := v_balance - v_year;
    ELSE
      v_balance := jsonb_set(v_balance, ARRAY[v_year], to_jsonb(v_val - v_take));
    END IF;
  END LOOP;

  IF v_remaining > 0 THEN
    RAISE EXCEPTION 'Insufficient balance: % days missing', v_remaining;
  END IF;

  UPDATE users SET balance = v_balance WHERE id_ = NEW.account_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_default_balance()
RETURNS trigger AS $$
BEGIN
  IF NEW.balance IS NULL THEN
    NEW.balance := jsonb_build_object(
      extract(year FROM now())::int::text,
      CASE WHEN NEW.regime_ = 'civil' THEN 30 ELSE 45 END
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION can_leave()
RETURNS trigger AS $$
DECLARE
  days_taken INTEGER;
BEGIN
  SELECT COALESCE(SUM(leave_duration), 0) INTO days_taken
    FROM permit
    WHERE account_id = NEW.account_id
      AND EXTRACT(YEAR FROM leave_start) = EXTRACT(YEAR FROM now());

  IF (SELECT regime_ FROM users WHERE id_ = NEW.account_id) = 'military' THEN
    IF (days_taken = 45) OR (days_taken + NEW.leave_duration > 45) THEN
      RAISE EXCEPTION 'more leave than what can be provided for a military member for this year';
    END IF;
  ELSE
    IF (days_taken = 30) OR (days_taken + NEW.leave_duration > 30) THEN
      RAISE EXCEPTION 'more leave than what can be provided for a civilian for this year';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION wait_review()
RETURNS trigger AS $$
BEGIN
  IF (SELECT superior_id FROM users WHERE id_ = NEW.account_id) IS NULL THEN
    RETURN NEW;
  ELSE
    INSERT INTO review(permit, reviewer)
    VALUES (NEW.permit_id, (SELECT superior_id FROM users WHERE id_ = NEW.account_id));
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION report()
RETURNS trigger AS $$
BEGIN
  IF (NEW.review_id <> OLD.review_id) OR (NEW.permit <> OLD.permit) OR (NEW.reviewer <> OLD.reviewer) THEN
    RAISE EXCEPTION 'attempt to change read-only fields';
  ELSEIF (NEW.status NOT IN ('positif', 'negatif') OR NEW.status IS NULL) THEN
    RAISE EXCEPTION 'invalid status was set';
  ELSEIF (OLD.status IN ('positif', 'negatif') AND NEW.status <> OLD.status) THEN
    RAISE EXCEPTION 'cannot change decision';
  END IF;

  IF EXISTS (
    SELECT 1 FROM review
    WHERE permit = OLD.permit
      AND reviewer = (SELECT superior_id FROM users WHERE id_ = OLD.reviewer)
  ) THEN
    RAISE EXCEPTION 'decision already taken and forwarded to superior';
  END IF;

  IF (SELECT decisional_power FROM users WHERE id_ = OLD.reviewer) THEN
    IF NEW.status = 'positif' THEN
      UPDATE permit SET permit_status = 'accordee' WHERE permit_id = OLD.permit;
      RETURN NEW;
    ELSEIF NEW.status = 'negatif' THEN
      UPDATE permit SET permit_status = 'refusee' WHERE permit_id = OLD.permit;
      RETURN NEW;
    ELSE
      RAISE EXCEPTION 'invalid status set for the review';
    END IF;
  ELSE
    INSERT INTO review(permit, reviewer)
    VALUES (OLD.permit, (SELECT superior_id FROM users WHERE id_ = OLD.reviewer));
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION lock_data()
RETURNS trigger AS $$
BEGIN
  IF (OLD.permit_status IN ('accordee', 'refusee') AND OLD.permit_status <> NEW.permit_status) THEN
    RAISE EXCEPTION 'cannot overturn a decision on a permit';
  ELSEIF (OLD.permit_id <> NEW.permit_id)
      OR (OLD.submit_date <> NEW.submit_date)
      OR (OLD.permit_type <> NEW.permit_type)
      OR (OLD.leave_start <> NEW.leave_start)
      OR (OLD.leave_duration <> NEW.leave_duration)
      OR (OLD.account_id <> NEW.account_id) THEN
    RAISE EXCEPTION 'attempt to change a read-only field';
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE users (
  id_ varchar(20) PRIMARY KEY,
  password_hash varchar(255) NOT NULL,
  name_ varchar(20) NOT NULL,
  firstname_ varchar(30) DEFAULT NULL,
  phone_ varchar(13) NOT NULL,
  mail_ varchar(40) DEFAULT '',
  regime_ varchar(10) DEFAULT 'civil',
  service varchar(40) NOT NULL,
  poste varchar(20) NOT NULL,
  decisional_power boolean DEFAULT false,
  superior_id varchar(20) REFERENCES users(id_) DEFAULT NULL,
  account_role varchar(20) DEFAULT 'worker',
  account_status varchar(15) DEFAULT 'pending',
  balance jsonb,

  CONSTRAINT check_status CHECK (account_status IN ('pending', 'blocked', 'validated')),
  CONSTRAINT check_role CHECK (account_role IN ('worker', 'admin', 'rh')),
  CONSTRAINT check_regime CHECK (regime_ IN ('civil', 'military')),
  CONSTRAINT is_superior CHECK (NOT (decisional_power = false AND superior_id IS NULL))
);

CREATE TABLE permit_type (
  type_id serial PRIMARY KEY NOT NULL,
  type_name varchar(20) UNIQUE NOT NULL,
  min_day integer NOT NULL,
  max_day integer
);

CREATE TABLE permit (
  permit_id serial PRIMARY KEY NOT NULL,
  submit_date date DEFAULT current_date NOT NULL,
  permit_type integer REFERENCES permit_type(type_id) NOT NULL,
  leave_start date NOT NULL,
  leave_duration integer NOT NULL,
  account_id varchar(20) REFERENCES users(id_) NOT NULL,
  permit_status varchar(10) DEFAULT 'waiting' NOT NULL,

  CONSTRAINT valid_status CHECK (permit_status IN ('accordee', 'refusee', 'waiting'))
);

CREATE TABLE permit_documents (
  document_id serial PRIMARY KEY NOT NULL,
  permit integer REFERENCES permit(permit_id) NOT NULL,
  document_name varchar(50) DEFAULT '',
  storage_path varchar(200) NOT NULL
);

CREATE TABLE review (
  review_id serial PRIMARY KEY NOT NULL,
  permit integer REFERENCES permit(permit_id) NOT NULL,
  reviewer varchar(20) REFERENCES users(id_) NOT NULL,
  motif text DEFAULT '',
  status varchar(15) DEFAULT 'waiting' NOT NULL,

  CONSTRAINT valid_status CHECK (status IN ('positif', 'negatif', 'waiting'))
);

CREATE TRIGGER ask_permission
AFTER INSERT ON permit
FOR EACH ROW
EXECUTE FUNCTION wait_review();

CREATE TRIGGER refresh_balance
AFTER UPDATE ON permit
FOR EACH ROW
WHEN (OLD.permit_status = 'waiting' AND NEW.permit_status = 'accordee')
EXECUTE FUNCTION deduct_balance();

CREATE TRIGGER default_balance
BEFORE INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION set_default_balance();

CREATE TRIGGER report_permit
AFTER UPDATE ON review
FOR EACH ROW
EXECUTE FUNCTION report();

CREATE TRIGGER check_duration
BEFORE INSERT ON permit
FOR EACH ROW
EXECUTE FUNCTION can_leave();

CREATE TRIGGER block_changes
BEFORE UPDATE ON permit
FOR EACH ROW
EXECUTE FUNCTION lock_data();