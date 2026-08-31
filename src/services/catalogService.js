import { api, apiData, apiMeta } from './apiClient'

export const catalogService = {
  async getCategories() { return apiData(await api.get('/catalog/categories')) || [] },
  async getCategory(slug) { return apiData(await api.get(`/catalog/categories/${encodeURIComponent(slug)}`)) },
  async getProducts(params = {}) {
    const response = await api.get('/catalog/products', { params })
    return { items: apiData(response) || [], meta: apiMeta(response) }
  },
  async getProduct(slugOrId) { return apiData(await api.get(`/catalog/products/${encodeURIComponent(slugOrId)}`)) },
  async getProductReviews(slugOrId, params = {}) {
    const response = await api.get(`/catalog/products/${encodeURIComponent(slugOrId)}/reviews`, { params })
    return { items: apiData(response) || [], meta: apiMeta(response) }
  },
  async getBanners() { return apiData(await api.get('/catalog/banners')) || [] },
  async getSettings() { return apiData(await api.get('/catalog/settings')) || {} }
}
