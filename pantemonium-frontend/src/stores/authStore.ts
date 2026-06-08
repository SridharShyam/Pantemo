import { create } from 'zustand'
import { api } from '@/lib/api'

export interface User {
    id: string
    name: string
    email: string
}

interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    login: (email?: string, password?: string) => Promise<void>
    logout: () => void
    register: (data: { name?: string; email: string; password?: string }) => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),

    login: async (email, password) => {
        if (!email || !password) return

        const formData = new FormData()
        formData.append('username', email)
        formData.append('password', password)

        try {
            const tokenRes = await api.post('/auth/login', formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })

            const token = tokenRes.data.access_token
            localStorage.setItem('token', token)

            // Set token temporarily in headers to fetch user data
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`

            const userRes = await api.get('/users/me')
            const userData = userRes.data

            set({
                user: { id: userData.id, name: userData.name || userData.email.split('@')[0], email: userData.email },
                token,
                isAuthenticated: true
            })
        } catch (error) {
            console.error('Login error:', error)
            throw error
        }
    },

    logout: () => {
        localStorage.removeItem('token')
        delete api.defaults.headers.common['Authorization']
        set({ user: null, token: null, isAuthenticated: false })
    },

    register: async (data) => {
        try {
            // 1. Register
            await api.post('/auth/register', {
                email: data.email,
                password: data.password
            })

            // 2. Auto-login
            const formData = new FormData()
            formData.append('username', data.email)
            formData.append('password', data.password || '')

            const tokenRes = await api.post('/auth/login', formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })

            const token = tokenRes.data.access_token
            localStorage.setItem('token', token)

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`

            const userRes = await api.get('/users/me')
            const userData = userRes.data

            set({
                user: { id: userData.id, name: userData.name || userData.email.split('@')[0], email: userData.email },
                token: token,
                isAuthenticated: true
            })
        } catch (error) {
            console.error('Register error:', error)
            throw error
        }
    }
}))
