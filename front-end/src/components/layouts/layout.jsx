import useMediaQuery from '@/hooks/media_query'
import {DLayout} from '@/components/layouts/desktop/desktop_layout.jsx'
import {MLayout} from '@/components/layouts/mobile/mobile_layout.jsx'
import api from '@/services/api' 

import {useState, useEffect} from 'react'

import '@/styles/variables/component_size.css'
import '@/styles/variables/color_sheme.css'
import '@/styles/layout.css'

export default function Layout() {
	function handleLogout() {
		localStorage.removeItem('token')
		setUser(null)
	}

	useEffect(() => {
	if (!localStorage.getItem('token')) return

	api.get('/users/me')
		.then(res => setUser(res.data))
		.catch(() => localStorage.removeItem('token'))
	}, [])

	const [user, setUser] = useState(null)

	const is_mobile = useMediaQuery('(max-width: 767px)')

	let Child = is_mobile ? MLayout : DLayout

	return  <Child user={user} onLogin={setUser} onLogout={handleLogout} />
}