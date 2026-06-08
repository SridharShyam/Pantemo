import { create } from 'zustand'
import { FitStyle } from './measurementStore'
import { api } from '@/lib/api'

export interface RecommendationParams {
    brandId: string
    categoryId: string
    fitPreference: FitStyle
    region: string
}

export interface Recommendation {
    id: string
    brand: string
    category: string
    size: string
    confidence: number
    fitStyle: FitStyle
    timestamp: string
    details?: {
        chestMatch: number
        waistMatch: number
    }
}

interface RecommendationState {
    currentRecommendation: Recommendation | null
    history: Recommendation[]
    isCalculating: boolean
    calculateSize: (params: RecommendationParams) => Promise<Recommendation>
    saveRecommendation: (id: string) => Promise<void>
    fetchHistory: () => Promise<void>
    submitFeedback: (id: string, rating: string) => Promise<void>
}

export const useRecommendationStore = create<RecommendationState>((set, get) => ({
    currentRecommendation: null,
    history: [],
    isCalculating: false,
    calculateSize: async (params) => {
        set({ isCalculating: true })

        try {
            const res = await api.post('/recommendations/calculate', {
                brand_id: params.brandId,
                category_id: params.categoryId,
                fit_preference: params.fitPreference.toLowerCase(),
                region: params.region
            })

            const data = res.data

            const newRec: Recommendation = {
                id: data.recommendation_id,
                brand: data.brand_name || params.brandId,
                category: data.category || params.categoryId,
                size: data.recommended_size,
                confidence: Math.round(data.confidence_score * 100),
                fitStyle: params.fitPreference,
                timestamp: new Date().toISOString(),
                details: {
                    chestMatch: 95, // Mocked for now as backend doesn't return exact match % yet
                    waistMatch: 90
                }
            }

            set({ currentRecommendation: newRec, isCalculating: false })
            return newRec
        } catch (error) {
            set({ isCalculating: false })
            console.error('Failed to calculate size:', error)
            throw error
        }
    },
    saveRecommendation: async (id) => {
        const { currentRecommendation, history } = get()
        if (currentRecommendation && currentRecommendation.id === id) {
            set({ history: [currentRecommendation, ...history] })
        }
    },
    fetchHistory: async () => {
        try {
            const res = await api.get('/recommendations/history')
            set({ history: res.data })
        } catch (error) {
            console.error('Failed to fetch history:', error)
        }
    },
    submitFeedback: async (id: string, rating: string) => {
        try {
            await api.post(`/recommendations/${id}/feedback`, { rating })
        } catch (error) {
            console.error('Failed to submit feedback error:', error)
        }
    }
}))
