import { api, apiData, apiMeta } from './apiClient'

export const orderService = {
  async create(payload) { return apiData(await api.post('/orders', payload)) },
  async list(params = {}) {
    const response = await api.get('/orders', { params })
    return { items: apiData(response) || [], meta: apiMeta(response) }
  },
  async get(id) { return apiData(await api.get(`/orders/${id}`)) },
  async cancel(id, reason = '') { return apiData(await api.post(`/orders/${id}/cancel`, { reason })) },
  async requestReturn(id, reason) { return apiData(await api.post(`/orders/${id}/return-request`, { reason })) },
  async track(payload) { return apiData(await api.post('/orders/track', payload)) }
}
