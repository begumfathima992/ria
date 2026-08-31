import { api, apiData } from './apiClient'

export const cartService = {
  async getCart(params = {}) { return apiData(await api.get('/cart', { params })) },
  async addItem(payload) { return apiData(await api.post('/cart/items', payload)) },
  async updateItem(itemId, quantity) { return apiData(await api.patch(`/cart/items/${itemId}`, { quantity })) },
  async removeItem(itemId) { return apiData(await api.delete(`/cart/items/${itemId}`)) },
  async clear() { return apiData(await api.delete('/cart')) },
  async quote(payload) { return apiData(await api.post('/cart/quote', payload)) }
}
