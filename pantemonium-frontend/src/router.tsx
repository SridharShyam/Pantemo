/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter, Outlet } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

import Landing from '@/pages/Landing'
import Login from '@/pages/Auth/Login'
import Register from '@/pages/Auth/Register'
import Dashboard from '@/pages/Dashboard'
import Measurements from '@/pages/Measurements'
import BrandExplorer from '@/pages/BrandExplorer'
import GetRecommendation from '@/pages/GetRecommendation'
import RecommendationResult from '@/pages/RecommendationResult'
import History from '@/pages/History'
import Profile from '@/pages/Profile'
import GarmentScanner from '@/pages/GarmentScanner'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useMeasurementStore } from '@/stores/measurementStore'
import { api } from '@/lib/api'

function Layout() {
    const { isAuthenticated, token, user } = useAuthStore()
    const { loadMeasurements } = useMeasurementStore()

    useEffect(() => {
        const initUser = async () => {
            if (token) {
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`
                if (!user) {
                    try {
                        const res = await api.get('/users/me')
                        const userData = res.data
                        useAuthStore.setState({
                            user: { id: userData.id, name: userData.name || userData.email.split('@')[0], email: userData.email },
                            isAuthenticated: true
                        })
                    } catch {
                        useAuthStore.getState().logout()
                    }
                }
            }
        }
        initUser()
    }, [token, user])

    useEffect(() => {
        if (isAuthenticated) {
            loadMeasurements()
        }
    }, [isAuthenticated, loadMeasurements])

    return (
        <div className="min-h-screen flex flex-col font-sans text-foreground bg-background">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { path: '/', element: <Landing /> },
            { path: 'login', element: <Login /> },
            { path: 'signup', element: <Register /> },
            { path: 'dashboard', element: <Dashboard /> },
            { path: 'onboarding/measurements', element: <Measurements /> },
            { path: 'brands', element: <BrandExplorer /> },
            { path: 'recommend', element: <GetRecommendation /> },
            { path: 'recommendation/:id', element: <RecommendationResult /> },
            { path: 'history', element: <History /> },
            { path: 'profile', element: <Profile /> },
            { path: 'garment-scanner', element: <GarmentScanner /> },
        ],
    },
])
