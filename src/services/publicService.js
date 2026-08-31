import { api, apiData } from './apiClient'

export const publicService = {
  async contact(payload) { return apiData(await api.post('/contact', payload)) },
  async subscribeNewsletter(email) { return apiData(await api.post('/newsletter/subscribe', { email })) },
  async unsubscribeNewsletter(email) { return apiData(await api.post('/newsletter/unsubscribe', { email })) }
}
