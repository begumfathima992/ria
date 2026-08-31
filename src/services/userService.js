import { api, apiData } from './apiClient'

export const userService = {
  async me() { return apiData(await api.get('/users/me')) },
  async updateProfile(payload) { return apiData(await api.patch('/users/me', payload)) },
  async changePassword(payload) { return apiData(await api.post('/users/change-password', payload)) },
  async getAddresses() { return apiData(await api.get('/users/addresses')) || [] },
  async createAddress(payload) { return apiData(await api.post('/users/addresses', payload)) },
  async updateAddress(id, payload) { return apiData(await api.patch(`/users/addresses/${id}`, payload)) },
  async deleteAddress(id) { return apiData(await api.delete(`/users/addresses/${id}`)) },
  async setDefaultAddress(id) { return apiData(await api.patch(`/users/addresses/${id}/default`)) },
  async getWishlist() { return apiData(await api.get('/users/wishlist')) || [] },
  async addWishlist(productId) { return apiData(await api.post(`/users/wishlist/${productId}`)) },
  async removeWishlist(productId) { return apiData(await api.delete(`/users/wishlist/${productId}`)) }
}
