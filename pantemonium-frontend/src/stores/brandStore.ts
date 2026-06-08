import { create } from 'zustand'
import { api } from '@/lib/api'

// Centralized visual metadata to enrich backend data
const BRAND_METADATA: Record<string, Partial<Brand>> = {
    "Nike": { logo_url: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg", tags: ["Athletic", "Popular"] },
    "Adidas": { logo_url: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg", tags: ["Athletic", "Popular"] },
    "H&M": { logo_url: "https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg", tags: ["Fashion", "Affordable"] },
    "Zara": { logo_url: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg", tags: ["Fashion", "Premium"] },
    "Uniqlo": { logo_url: "https://upload.wikimedia.org/wikipedia/commons/9/92/UNIQLO_logo.svg", tags: ["Essentials", "Popular"] },
    "Gap": { logo_url: "https://upload.wikimedia.org/wikipedia/commons/2/24/Gap_logo.svg", tags: ["Casual", "Classic"] },
    "Levi's": { logo_url: "https://upload.wikimedia.org/wikipedia/commons/1/13/Levi%27s_logo.svg", tags: ["Denim", "Classic", "Popular"] },
    "Tommy Hilfiger": { logo_url: "https://upload.wikimedia.org/wikipedia/commons/2/29/Tommy_Hilfiger_Logo.svg", tags: ["Premium", "Classic"] },
    "Ralph Lauren": { logo_url: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Ralph_Lauren_Corporation_logo.svg", tags: ["Premium", "Luxury"] },
    "American Eagle": { logo_url: "https://upload.wikimedia.org/wikipedia/commons/8/87/American_Eagle_Outfitters_20xx_logo.svg", tags: ["Casual", "Denim"] },
    "Gucci": { logo_url: "https://upload.wikimedia.org/wikipedia/commons/7/79/1960s_Gucci_Logo.svg", tags: ["Luxury", "Premium"] },
    "Puma": { logo_url: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Puma_Logo.svg", tags: ["Athletic"] },
    "ASOS": { logo_url: "https://upload.wikimedia.org/wikipedia/commons/1/11/ASOS_logo.svg", tags: ["Fashion", "Streetwear"] }
}

export interface Brand {
    id: string
    name: string
    logo_url?: string
    description?: string
    website_url?: string
    tags: string[]
}

export interface Category {
    id: string
    name: string
    description?: string
}

interface BrandState {
    brands: Brand[]
    categories: Category[]
    isLoading: boolean
    fetchBrands: () => Promise<void>
    fetchCategories: () => Promise<void>
}

export const useBrandStore = create<BrandState>((set) => ({
    brands: [],
    categories: [],
    isLoading: false,

    fetchBrands: async () => {
        set({ isLoading: true })
        try {
            const res = await api.get('/brands')
            const enrichedBrands = res.data.map((b: Brand) => {
                const meta = BRAND_METADATA[b.name] || {}
                return {
                    ...b,
                    logo_url: meta.logo_url || b.logo_url,
                    tags: meta.tags || b.tags || ['Popular'],
                    description: meta.description || b.description || `Discover sizes for ${b.name}`
                }
            })
            set({ brands: enrichedBrands, isLoading: false })
        } catch (error) {
            console.error('Failed to fetch brands:', error)
            set({ isLoading: false })
        }
    },

    fetchCategories: async () => {
        try {
            const res = await api.get('/brands/categories')
            set({ categories: res.data })
        } catch (error) {
            console.error('Failed to fetch categories:', error)
        }
    }
}))
