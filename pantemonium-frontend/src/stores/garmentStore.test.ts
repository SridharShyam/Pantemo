import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useGarmentStore } from './garmentStore'
import { api } from '@/lib/api'

vi.mock('@/lib/api', () => ({
  api: {
    post: vi.fn(),
  },
}))

describe('garmentStore', () => {
  beforeEach(() => {
    useGarmentStore.setState({
      lastScan: null,
      savedGarments: [],
      isScanning: false,
      error: null,
    })
    vi.clearAllMocks()
  })

  it('initial state is correct', () => {
    const state = useGarmentStore.getState()
    expect(state.lastScan).toBeNull()
    expect(state.savedGarments).toEqual([])
    expect(state.isScanning).toBe(false)
  })

  it('scanGarment updates state on success', async () => {
    const mockData = {
      category: 'tops',
      brand: 'Zara',
      detected_size: 'M',
      confidence: 0.95,
      measurements: {},
      detected_points: [],
      comparative_recommendations: [],
    }
    
    ;(api.post as any).mockResolvedValueOnce({ data: mockData })
    
    await useGarmentStore.getState().scanGarment('test-image', 'tops')
    
    const state = useGarmentStore.getState()
    expect(state.isScanning).toBe(false)
    expect(state.lastScan).toEqual(mockData)
    expect(state.error).toBeNull()
  })

  it('saveGarment adds to savedGarments and clears lastScan', () => {
    const mockScan = {
      category: 'tops',
      brand: 'Zara',
      detected_size: 'M',
      confidence: 0.95,
      measurements: {},
      detected_points: [],
      comparative_recommendations: [],
    }
    
    useGarmentStore.setState({ lastScan: mockScan as any })
    
    useGarmentStore.getState().saveGarment('test-image')
    
    const state = useGarmentStore.getState()
    expect(state.savedGarments.length).toBe(1)
    expect(state.savedGarments[0].brand).toBe('Zara')
    expect(state.lastScan).toBeNull()
  })
})
