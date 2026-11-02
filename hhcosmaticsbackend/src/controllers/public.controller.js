import { ContactMessage, NewsletterSubscriber } from '../models/index.js'
import { normalizeEmail, success } from '../utils/helpers.js'

export async function submitContact(req, res, next) {
  try {
    const row = await ContactMessage.create({ ...req.body, email: normalizeEmail(req.body.email) })
    return success(res, { id: row.id }, 'Thanks. Your message has been received.', 201)
  } catch (error) { next(error) }
}

export async function subscribeNewsletter(req, res, next) {
  try {
    const email = normalizeEmail(req.body.email)
    const [row, created] = await NewsletterSubscriber.findOrCreate({ where: { email }, defaults: { email, isActive: true, subscribedAt: new Date() } })
    if (!created && !row.isActive) await row.update({ isActive: true, subscribedAt: new Date(), unsubscribedAt: null })
    return success(res, { email, subscribed: true }, 'You are subscribed to H&H updates', created ? 201 : 200)
  } catch (error) { next(error) }
}

export async function unsubscribeNewsletter(req, res, next) {
  try {
    const email = normalizeEmail(req.body.email)
    await NewsletterSubscriber.update({ isActive: false, unsubscribedAt: new Date() }, { where: { email } })
    return success(res, { email, subscribed: false }, 'You have been unsubscribed')
  } catch (error) { next(error) }
}
