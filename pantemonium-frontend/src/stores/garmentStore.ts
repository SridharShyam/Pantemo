import { create } from 'zustand'
import { api } from '@/lib/api'

export interface ScanResult {
    category: string
    brand: string
    detected_size: string
    inferred_size: string
    confidence: number
    measurements: Record<string, number>
    detected_points: Array<{ x: number; y: number; label: string }>
    comparative_recommendations: Array<{ brand: string; size: string; note?: string }>
    note?: string
}

interface SavedGarment extends ScanResult {
    id: string
    image: string
    fit_feedback?: 'too_tight' | 'perfect' | 'too_loose'
}

interface GarmentState {
    lastScan: ScanResult | null
    savedGarments: SavedGarment[]
    isScanning: boolean
    error: string | null
    scanGarment: (imageData: string, category: string) => Promise<ScanResult>
    saveGarment: (imageData: string, feedback?: string) => void
    clearScan: () => void
}

export const useGarmentStore = create<GarmentState>((set, get) => ({
    lastScan: null,
    savedGarments: [],
    isScanning: false,
    error: null,

    scanGarment: async (imageData: string, category: string) => {
        set({ isScanning: true, error: null })
        try {
            const response = await api.post('/garments/scan', null, {
                params: { category, image_b64: imageData }
            })
            const result = response.data
            set({ lastScan: result, isScanning: false })
            return result
        } catch (error: any) {
            const message = error.response?.data?.detail || 'Failed to scan garment'
            set({ error: message, isScanning: false })
            throw new Error(message)
        }
    },

    saveGarment: (imageData: string, feedback?: any) => {
        const { lastScan, savedGarments } = get()
        if (lastScan) {
            const newGarment: SavedGarment = {
                ...lastScan,
                id: Math.random().toString(36).substr(2, 9),
                image: imageData,
                fit_feedback: feedback
            }
            set({ savedGarments: [newGarment, ...savedGarments], lastScan: null })
        }
    },

    clearScan: () => set({ lastScan: null, error: null })
}))
