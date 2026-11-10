import api from './api'

export async function login(id_, password) {
	const res = await api.post('/users/login', { id_, password })
	localStorage.setItem('token', res.data.token)
	return res.data
}
