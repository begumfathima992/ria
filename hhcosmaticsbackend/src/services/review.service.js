import { col, fn } from 'sequelize'
import { Product, Review } from '../models/index.js'

export async function refreshProductRating(productId, transaction) {
  const aggregate = await Review.findOne({
    where: { productId, status: 'APPROVED' },
    attributes: [[fn('AVG', col('rating')), 'avg'], [fn('COUNT', col('id')), 'count']],
    raw: true,
    transaction
  })
  await Product.update({
    ratingAverage: Number(aggregate?.avg || 0).toFixed(2),
    reviewCount: Number(aggregate?.count || 0)
  }, { where: { id: productId }, transaction })
}
