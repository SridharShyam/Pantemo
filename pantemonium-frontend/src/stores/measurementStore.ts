import { create } from 'zustand'
import { api } from '@/lib/api'

export type FitStyle = 'Slim' | 'Regular' | 'Relaxed' | 'Oversized'

export interface UserMeasurements {
    chest: number
    waist: number
    hip?: number
    shoulder?: number
    height?: number
    weight?: number
}

interface MeasurementState {
    measurements: UserMeasurements | null
    fitPreference: FitStyle
    updateMeasurements: (data: Partial<UserMeasurements>) => void
    setFitPreference: (style: FitStyle) => void
    saveMeasurements: () => Promise<void>
    loadMeasurements: () => Promise<void>
}

export const useMeasurementStore = create<MeasurementState>((set, get) => ({
    measurements: null,
    fitPreference: 'Regular',
    updateMeasurements: (data) =>
        set((state) => ({
            measurements: { ...state.measurements, ...data } as UserMeasurements,
        })),
    setFitPreference: (style) => set({ fitPreference: style }),

    saveMeasurements: async () => {
        const { measurements, fitPreference } = get()
        if (!measurements) return

        try {
            await api.post('/users/me/measurements', {
                chest_cm: measurements.chest,
                waist_cm: measurements.waist,
                hip_cm: measurements.hip || 0,
                shoulder_width_cm: measurements.shoulder,
                height_cm: measurements.height,
                weight_kg: measurements.weight,
                preferred_fit: fitPreference.toLowerCase()
            })
        } catch (error) {
            console.error('Failed to save measurements:', error)
            throw error
        }
    },

    loadMeasurements: async () => {
        try {
            const res = await api.get('/users/me/measurements')
            const data = res.data
            if (data && data.length > 0) {
                // Find current measurement
                const current = data.find((m: unknown) => (m as { is_current: boolean }).is_current) || data[0]
                set({
                    measurements: {
                        chest: current.chest_cm,
                        waist: current.waist_cm,
                        hip: current.hip_cm,
                        shoulder: current.shoulder_width_cm,
                        height: current.height_cm,
                        weight: current.weight_kg,
                    },
                    fitPreference: (current.preferred_fit?.charAt(0).toUpperCase() + current.preferred_fit?.slice(1)) as FitStyle || 'Regular'
                })
            }
        } catch (error) {
            console.error('Failed to load measurements:', error)
        }
    }
}))
