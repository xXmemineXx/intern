import api from './api'

export async function search(data) {
	const res = await api.post('/users/find', data)
	return res.data
}

export async function authMe() {
	if (!localStorage.getItem('token')) return 
	const res = await api.get('/users/me')
	return res.data
}

export async function signUp(data) {
	const res = await api.post('/users/', data)
	return res.data
}