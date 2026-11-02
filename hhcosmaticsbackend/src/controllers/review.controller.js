import { Order, OrderItem, Product, Review } from '../models/index.js'
import { success } from '../utils/helpers.js'
import { refreshProductRating } from '../services/review.service.js'
import { ApiError } from '../utils/ApiError.js'

export async function createReview(req, res, next) {
  try {
    const product = await Product.findOne({ where: { id: req.params.productId, isActive: true } })
    if (!product) throw new ApiError(404, 'Product not found', 'PRODUCT_NOT_FOUND')
    if (await Review.findOne({ where: { userId: req.user.id, productId: product.id } })) throw new ApiError(409, 'You have already reviewed this product', 'REVIEW_EXISTS')
    let orderId = req.body.orderId || null
    let verified = false
    if (orderId) {
      const order = await Order.findOne({ where: { id: orderId, userId: req.user.id, status: 'DELIVERED' }, include: [{ model: OrderItem, as: 'items', where: { productId: product.id }, required: true }] })
      if (!order) throw new ApiError(400, 'Verified review requires a delivered order containing this product', 'INVALID_REVIEW_ORDER')
      verified = true
    } else {
      const order = await Order.findOne({ where: { userId: req.user.id, status: 'DELIVERED' }, include: [{ model: OrderItem, as: 'items', where: { productId: product.id }, required: true }] })
      if (order) { orderId = order.id; verified = true }
    }
    const review = await Review.create({ userId: req.user.id, productId: product.id, orderId, rating: req.body.rating, title: req.body.title || null, comment: req.body.comment, status: 'PENDING', isVerifiedPurchase: verified })
    return success(res, review, 'Review submitted for moderation', 201)
  } catch (error) { next(error) }
}

export async function updateReview(req, res, next) {
  try {
    const review = await Review.findOne({ where: { id: req.params.id, userId: req.user.id } })
    if (!review) throw new ApiError(404, 'Review not found', 'REVIEW_NOT_FOUND')
    const wasApproved = review.status === 'APPROVED'
    await review.update({ ...req.body, status: 'PENDING' })
    if (wasApproved) await refreshProductRating(review.productId)
    return success(res, review, 'Review updated and submitted for moderation')
  } catch (error) { next(error) }
}

export async function deleteReview(req, res, next) {
  try {
    const review = await Review.findOne({ where: { id: req.params.id, userId: req.user.id } })
    if (!review) throw new ApiError(404, 'Review not found', 'REVIEW_NOT_FOUND')
    const productId = review.productId
    const wasApproved = review.status === 'APPROVED'
    await review.destroy()
    if (wasApproved) await refreshProductRating(productId)
    return success(res, null, 'Review deleted')
  } catch (error) { next(error) }
}
