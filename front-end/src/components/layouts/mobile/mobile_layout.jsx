import { Sign_in, Sign_up } from '@/components/pages/authentication.jsx'
import {useState} from 'react'

export function MLayout( { user, onLogin, onLogout } ) {
	const [login, setLogin] = useState(false)
	return (
		<div className="logBackground">
			{login ? <Sign_up on_switch={() => setLogin(false)}/> 
				   : <Sign_in on_switch={() => setLogin(true)}/>}
		</div>
	)
}

function MainPage_M() {
	
}