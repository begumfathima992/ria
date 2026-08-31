import { api, apiData } from './apiClient'

export const reviewService = {
  async create(productId, payload) { return apiData(await api.post(`/reviews/products/${productId}`, payload)) },
  async update(reviewId, payload) { return apiData(await api.patch(`/reviews/${reviewId}`, payload)) },
  async remove(reviewId) { return apiData(await api.delete(`/reviews/${reviewId}`)) }
}
