import {useState} from 'react'
import Input from '@/components/buttons and fields/input'
import {Sign_in, Sign_up} from '@/components/pages/authentication'
import {Bar}  from '@/components/navigation/nav_bar'

import Acccount from '@/components/pages/account'

import home from '@/assets/home.png'
import account from '@/assets/user.png'
import notification from '@/assets/bell.png'
import logout from '@/assets/logout.png'
import add from '@/assets/add-B.png'
import history from '@/assets/history-B.png' 

export function DLayout({ user, onLogin, onLogout }) {
	const divClass = user ? "background" : "LogBackground"

	return (
		<div className={divClass}>
			{user
				? <MainPage user={user}
							onLogout={onLogout}/>
				: <Log onLogin={onLogin} />}
		</div>
	)
}

function MainPage({user, onLogout, onSwitch}) {
	const [showBar, setShowbar] = useState(false)

	return (
		<div>
			<Bar direction="left" 
				objects={[
				{id : 'home', options : 'home', image : home, callback : undefined, img : true},
				{id : 'history', options : 'history', image : history, callback : undefined, img : true},
				{id : 'add', options : 'add', image : add, callback : undefined, img : true},
			]}/>
			<Bar direction="top"
				objects={[
					{ id: 'search', options: 'search', content: <Input type="text" label="search" /> },
					{ id: 'notification', options: 'notification', image: notification },
					{ id: 'user', options: 'user', image: account, callback: () => setShowbar(s => !s) },
				]}
			/>

			<div className="notification">
				
			</div>
			<div className={showBar ? "user showBar" : "user"}>
				<div>
					<p> im : {user.id}</p>
					<p> name : {user.name}</p>
				</div>
				<div>
					<img src={account}/>
					<div className="logout"
						 onClick={onLogout}>
						<p> log out </p>
						<img src={logout}/>
					</div>
				</div>
			</div>

			<Acccount/>
		</div>
	)
}

function Log({onLogin}) {
	const [login, setLogin] = useState(false)

	return (
		<div className={login ? "is_signup log_screen" : "is_signin log_screen"}>
				<Sign_in on_switch={() => setLogin(true)}
						 onSuccess={onLogin}/>
				<Sign_up className="scrollable" on_switch={() => setLogin(false)}/>
					
			<div className="present">
				<h1> welcome </h1>
				<h2> log in to continue </h2>
				<h2> {login ? "sign up" : "sign in"} </h2>
			</div>
		</div>
	)
}