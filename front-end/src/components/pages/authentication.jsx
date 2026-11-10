import {useState, useEffect} from 'react'
import { login } from '@/services/auth'
import { signUp, authMe } from '@/services/leave'

import Field from '@/components/buttons and fields/input'
import Button from '@/components/buttons and fields/button'

import '@/styles/auth.css'

export function Sign_in({on_switch, onSuccess}) {
	const [im, setIm] = useState('')
	const [pswd, setPswd] = useState('')
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)

	async function handleSubmit() {
		setError(null)
		setLoading(true)

		try {
			await login(im, pswd)
			const user = await authMe({id_ : im})
			console.log(user)
			onSuccess?.(user)
		} catch (err) {
			setError(err.response?.data?.message || 'Login failed')
		} finally {
			setLoading(false)
		}
	}

	return (
		<form className="sign_field">
			<Field name="IM"
					label="your IM"
					type="text"
					onChange={ e => setIm(e.target.value)}
			/>
			<Field name="pswd"
					label="password"
					type="password"
					onChange={ e => setPswd(e.target.value)}
			/>

			{ error && <p> {error} </p>}

			<Button className="action"
					shown={loading ? "loading..." : "confirm"}
					type="submit"
					disabled={loading}
					callback={handleSubmit}
			/>
			<div className="alternatives">
				<a id="forgot"
					href=""
					onClick={(e) => {
						e.preventDefault()
					}}
				> 
					forgot password?
				</a>

				<a id="new"
					href=""
					onClick={(e) => {
						e.preventDefault()
						on_switch()
					}}
				>
					sign_up? 
				</a>
			</div>
		</form>
	)
}

export function Sign_up(called, onSuccess) {
	let classes = "sign_field " + called.className

	const [step, setStep] = useState(false)

	const [name, setName] = useState('')
	const [firstname, setFirstname] = useState('')
	const [phone, setPhone] = useState('')
	const [email, setEmail] = useState('')

	const [im, setIm] = useState('')
	const [regime, setRegime] = useState('civil')
	const [service, setService] = useState('')
	const [post, setPost] = useState('')
	const [decision, setDecision]  = useState(Boolean)
	const [superior, setSuperior] = useState('')
	const [confirmPswd, setConfirmPswd] = useState('')
	const [pswd, setPswd] = useState('')

	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)

	async function handleSubmit(e) {
		e.preventDefault()
		if (pswd !== confirmPswd) {
			console.log("check your password")
			return	
		}

		const newUser = {
			'id_' : im,
			'name_' : name,
			'firstname_' : firstname,
			'phone_' : phone,
			'mail_' : email,
			'regime_' : regime,
			'service' : service,
			'poste' : post,
			'decisional_power' : decision,
			'superior_id' : superior,
			'password' : pswd
		}

		try {
			user = await signUp(newUser)
			onSuccess?.(user)
		} catch (err) {
			console.log(err)
		}
	}

	const step1 = <div>
		<h3> enter your personal information </h3>
			
			<Field name="name"
					label="name"
					type="text"
					onChange={ e => setName(e.target.value)}
			/>
			<Field name="firstname"
					label="first name"
					type="text"
					onChange={ e => setFirstname(e.target.value)}
			/>
			<Field name="phone"
					label="phone"
					type="tel"
					onChange={ e => setPhone(e.target.value)}
			/>
			<Field name="email"
					label="email"
					type="email"
					onChange={ e =>  setEmail(e.target.value)}
			/>
			<Button className="action"
					shown="next step"
					callback={() => setStep(true)}
			/>
	</div>

	const step2 = <div>
		<h3> enter your professional informations </h3>

			<Field name="IM"
					label="IM"
					type="text"
					onChange={ e => setIm(e.target.value)}
			/>

			<Field	name="service"
					label="service"
					type="text"
					onChange={ e => setService(e.target.value)}
			/>
			<Field name="regime"
					label="regime"
					type="select"
					options={[
						{value : 'civil', label : 'civilian'},
						{value : 'military', label : 'military'},
					]}
					onChange={ e => setRegime(e.target.value)}
			/>
			<Field name="post"
					label="post"
					type="text"
					onChange={ e => setPost(e.target.value)}
			/>

			<p> do you have the rigths to validate your underlings leave permit?</p>

			<Field name="decision"
					label="decision on permits"
					type="select"
					options={[
						{value : true, label : 'yes'},
						{value : false, label : 'no'},
					]}
					onChange={ e => setDecision(e.target.value)}
			/>

			<Field	name="superior"
					label="superior"
					type="text"
					onChange={ e => setSuperior(e.target.value)}
			/>

			<Field name="pswd"
					label="password"
					type="password"
					onChange={ e => setPswd(e.target.value)}
			/>

			<Field name="confirm"
					label="confirm password"
					type="password"
					onChange={ e => setConfirmPswd(e.target.value)}
			/>

			<Button className="action"
					shown="confirm"
					callback={handleSubmit}
			/>
	</div>

	return (
		<div className={classes}>
			<div className="steps">
				<Button className={step ? "" : "actif"}
						callback={() => setStep(false)}
						shown="step 1"/>
				<Button className={step ? "actif" : ""}
						callback={() => setStep(true)}
						shown="step 2"/>
			</div>

			{step ? step2 : step1}

			<br/>
			<div className="alternatives">
				<a id="forgot"
					href=""
				> 
					forgot password?
				</a>

				<a id="new"
					href=""
					onClick={(e) => {
						e.preventDefault()
						called.on_switch()
					}}
				>
					sign_in? 
				</a>
			</div>
		</div>
	)
}