import { Sign_in, Sign_up } from '@/components/pages/authentication.jsx'
import {useState, useEffect} from 'react'

import {useClickOutside} from '@/hooks/clickEvent'

import {Floating, Bar} from '@/components/navigation/nav_bar'
import Input from '@/components/buttons and fields/input'

import notification from '@/assets/bell.png'
import account from '@/assets/user.png'
import home from '@/assets/home.png'
import historyImg from '@/assets/history.png'
import add from '@/assets/add.png'
import logout from '@/assets/logout.png'

import Dashboard from '@/components/pages/dashboard'
import history from '@/components/pages/history'
import permit from '@/components/pages/permit'
import review from '@/components/pages/review'

export function MLayout( { user, onLogin, onLogout } ) {
	let divClass = user ? "background" : "logBackground"
	return (
		<div className={divClass}>
			{user 
				? <MainPage_M onLogout={onLogout}
							  user={user}/> 
				: <Log_M onLogin={onLogin}/>}
		</div>
	)
}

function MainPage_M({onLogout, user}) {
	const [showUser, setShowUser] = useState(false)
	const [showNotif, setShowNotif] = useState(false)

	const [showLogout, setShowLogout] = useState(false)

	const ref = useClickOutside(() => {
		setShowNotif(false)
		setShowUser(false)
	})

	useEffect(() => {
		showUser ? setShowNotif(false) : setShowNotif(showNotif)
		showNotif ? setShowUser(false) : setShowUser(showUser)
	}, [showUser, showNotif])

	return (
		<div>
			<Bar direction="top"
				objects={[
					{ id: 'notification', options: 'notification', image: notification , callback: () => setShowNotif(s => !s) , img : true, ref : ref},
					{ id: 'user', options: 'user', image: account, callback: () => setShowUser(s => !s) , img : true, ref : ref},
				]}
			/>

			<Floating objects={[
				{id : 'home', options : 'home', image : home, callback : undefined, img : true},
				{id : 'history', options : 'history', image : historyImg, callback : undefined, img : true},
				{id : 'add', options : 'add', image : add, callback : undefined, img : true},
			]}/>

			<div className={showUser ? "userPane" : "hiddenPan"}>
				<div>
					<p>IM : {user.id}</p>
					<p>name : {user.name}</p>
				</div>
				<div className="usrParam">
					<img src={account} onClick={() => setShowLogout(s => !s)}/>
					<div className={showLogout ? "logoutM toogled" : "logoutM"}
 						 onClick={onLogout}>
						<p> log out </p>
						<img src={logout}/>
					</div>
				</div>
			</div>

			<div className={showNotif ? "notifPan" : "hiddenPan"}>
				 
			</div>

		</div>
	)
}

function Log_M({onLogin}) {
	const [login, setLogin] = useState(false)
	return (
		<div>
			{login ? <Sign_up on_switch={() => setLogin(false)}/> 
				   : <Sign_in on_switch={() => setLogin(true)}
				   			  onSuccess={onLogin}/>}
		</div>
	)
}