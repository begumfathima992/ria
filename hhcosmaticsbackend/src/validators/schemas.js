import Joi from 'joi'

const email = Joi.string().trim().lowercase().email().max(191)
const password = Joi.string().min(8).max(128).pattern(/[A-Z]/).pattern(/[a-z]/).pattern(/[0-9]/)
const id = Joi.number().integer().positive()
const money = Joi.number().precision(2).min(0)

export const authSchemas = {
  register: Joi.object({
    firstName: Joi.string().trim().min(2).max(80).required(),
    lastName: Joi.string().trim().min(2).max(80).required(),
    email: email.required(),
    phone: Joi.string().trim().max(30).allow('', null),
    password: password.required()
  }),
  login: Joi.object({ email: email.required(), password: Joi.string().required() }),
  refresh: Joi.object({ refreshToken: Joi.string().required() }),
  forgot: Joi.object({ email: email.required() }),
  reset: Joi.object({ token: Joi.string().min(32).required(), password: password.required() }),
  changePassword: Joi.object({ currentPassword: Joi.string().required(), newPassword: password.required() })
}

export const userSchemas = {
  profile: Joi.object({
    firstName: Joi.string().trim().min(2).max(80),
    lastName: Joi.string().trim().min(2).max(80),
    phone: Joi.string().trim().max(30).allow('', null)
  }).min(1),
  address: Joi.object({
    label: Joi.string().trim().max(50).default('Home'),
    firstName: Joi.string().trim().min(2).max(80).required(),
    lastName: Joi.string().trim().min(2).max(80).required(),
    phone: Joi.string().trim().max(30).required(),
    addressLine1: Joi.string().trim().max(191).required(),
    addressLine2: Joi.string().trim().max(191).allow('', null),
    city: Joi.string().trim().max(100).required(),
    county: Joi.string().trim().max(100).allow('', null),
    postcode: Joi.string().trim().max(20).required(),
    country: Joi.string().trim().max(80).default('United Kingdom'),
    isDefault: Joi.boolean().default(false)
  })
}

export const cartSchemas = {
  add: Joi.object({ productId: id.required(), variantId: id.allow(null), quantity: Joi.number().integer().min(1).max(99).default(1) }),
  quantity: Joi.object({ quantity: Joi.number().integer().min(1).max(99).required() }),
  quote: Joi.object({ couponCode: Joi.string().trim().max(50).allow('', null), shippingMethod: Joi.string().valid('STANDARD','EXPRESS').default('STANDARD') })
}

export const orderSchemas = {
  create: Joi.object({
    addressId: id.allow(null),
    shippingAddress: Joi.object({
      firstName: Joi.string().trim().max(80).required(), lastName: Joi.string().trim().max(80).required(),
      phone: Joi.string().trim().max(30).required(), addressLine1: Joi.string().trim().max(191).required(),
      addressLine2: Joi.string().trim().max(191).allow('', null), city: Joi.string().trim().max(100).required(),
      county: Joi.string().trim().max(100).allow('', null), postcode: Joi.string().trim().max(20).required(),
      country: Joi.string().trim().max(80).default('United Kingdom')
    }).allow(null),
    shippingMethod: Joi.string().valid('STANDARD','EXPRESS').default('STANDARD'),
    paymentMethod: Joi.string().valid('COD').default('COD'),
    couponCode: Joi.string().trim().max(50).allow('', null),
    customerNote: Joi.string().trim().max(1000).allow('', null)
  }).or('addressId', 'shippingAddress'),
  track: Joi.object({ orderNumber: Joi.string().trim().max(40).required(), email: email.required() }),
  cancel: Joi.object({ reason: Joi.string().trim().max(500).allow('', null) })
}

export const reviewSchemas = {
  create: Joi.object({ rating: Joi.number().integer().min(1).max(5).required(), title: Joi.string().trim().max(120).allow('', null), comment: Joi.string().trim().min(3).max(3000).required(), orderId: id.allow(null) }),
  update: Joi.object({ rating: Joi.number().integer().min(1).max(5), title: Joi.string().trim().max(120).allow('', null), comment: Joi.string().trim().min(3).max(3000) }).min(1)
}

export const adminSchemas = {
  category: Joi.object({ name: Joi.string().trim().max(120).required(), slug: Joi.string().trim().max(140), description: Joi.string().allow('', null), imageUrl: Joi.string().max(500).allow('', null), sortOrder: Joi.number().integer().min(0).default(0), isActive: Joi.boolean().default(true) }),
  subcategory: Joi.object({ categoryId: id.required(), name: Joi.string().trim().max(120).required(), slug: Joi.string().trim().max(140), description: Joi.string().allow('', null), imageUrl: Joi.string().max(500).allow('', null), sortOrder: Joi.number().integer().min(0).default(0), isActive: Joi.boolean().default(true) }),
  product: Joi.object({
    categoryId: id.required(), subcategoryId: id.allow(null), name: Joi.string().trim().max(191).required(), slug: Joi.string().trim().max(220), sku: Joi.string().trim().max(80).allow('', null), brand: Joi.string().trim().max(120).default('H&H Hair & Cosmetics'), shortDescription: Joi.string().max(500).allow('', null), description: Joi.string().allow('', null), ingredients: Joi.string().allow('', null), usageNotes: Joi.string().allow('', null), basePrice: money.required(), compareAtPrice: money.allow(null), costPrice: money.allow(null), stock: Joi.number().integer().min(0).default(0), lowStockThreshold: Joi.number().integer().min(0).default(5), trackInventory: Joi.boolean().default(true), badge: Joi.string().max(80).allow('', null), isFeatured: Joi.boolean().default(false), isNew: Joi.boolean().default(false), isActive: Joi.boolean().default(true), metadata: Joi.object().allow(null)
  }),
  variant: Joi.object({ name: Joi.string().trim().max(150).required(), sku: Joi.string().trim().max(80).required(), attributes: Joi.object().allow(null), price: money.required(), compareAtPrice: money.allow(null), costPrice: money.allow(null), stock: Joi.number().integer().min(0).default(0), lowStockThreshold: Joi.number().integer().min(0).default(5), isDefault: Joi.boolean().default(false), isActive: Joi.boolean().default(true) }),
  image: Joi.object({ variantId: id.allow(null), imageUrl: Joi.string().max(500).required(), altText: Joi.string().max(255).allow('', null), sortOrder: Joi.number().integer().min(0).default(0), isPrimary: Joi.boolean().default(false) }),
  coupon: Joi.object({ code: Joi.string().trim().uppercase().max(50).required(), name: Joi.string().trim().max(120).required(), type: Joi.string().valid('PERCENT','FIXED').required(), value: money.required(), minOrder: money.default(0), maxDiscount: money.allow(null), usageLimit: Joi.number().integer().positive().allow(null), perUserLimit: Joi.number().integer().positive().default(1), startsAt: Joi.date().iso().allow(null), endsAt: Joi.date().iso().allow(null), isActive: Joi.boolean().default(true) }),
  orderStatus: Joi.object({ status: Joi.string().valid('PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED','RETURN_REQUESTED','RETURNED').required(), note: Joi.string().trim().max(1000).allow('', null), trackingNumber: Joi.string().trim().max(120).allow('', null), carrier: Joi.string().trim().max(120).allow('', null), paymentStatus: Joi.string().valid('COD_PENDING','PAID','REFUNDED','VOID') }),
  inventory: Joi.object({ quantity: Joi.number().integer().min(0).required(), reason: Joi.string().trim().max(120).required(), reference: Joi.string().trim().max(120).allow('', null) }),
  banner: Joi.object({ title: Joi.string().trim().max(191).required(), subtitle: Joi.string().max(500).allow('', null), imageUrl: Joi.string().max(500).required(), mobileImageUrl: Joi.string().max(500).allow('', null), linkUrl: Joi.string().max(500).allow('', null), position: Joi.string().max(80).default('HOME_HERO'), sortOrder: Joi.number().integer().min(0).default(0), startsAt: Joi.date().iso().allow(null), endsAt: Joi.date().iso().allow(null), isActive: Joi.boolean().default(true) }),
  setting: Joi.object({ value: Joi.any().required(), isPublic: Joi.boolean() }),
  userStatus: Joi.object({ status: Joi.string().valid('ACTIVE','BLOCKED').required() }),
  reviewStatus: Joi.object({ status: Joi.string().valid('PENDING','APPROVED','REJECTED').required() })
}

export function partialSchema(schema) {
  const keys = Object.keys(schema.describe().keys || {})
  return schema.fork(keys, (field) => field.optional()).min(1)
}

export const publicSchemas = {
  contact: Joi.object({ name: Joi.string().trim().min(2).max(160).required(), email: email.required(), phone: Joi.string().trim().max(30).allow('', null), subject: Joi.string().trim().min(2).max(191).required(), message: Joi.string().trim().min(5).max(5000).required() }),
  newsletter: Joi.object({ email: email.required() })
}

export const returnSchema = Joi.object({ reason: Joi.string().trim().min(3).max(1000).required() })

export const adminSupportSchemas = {
  contactUpdate: Joi.object({ status: Joi.string().valid('NEW','IN_PROGRESS','RESOLVED','CLOSED'), adminNote: Joi.string().allow('', null).max(5000) }).min(1),
  orderNote: Joi.object({ adminNote: Joi.string().allow('', null).max(2000).required() })
}

export const adminUserEditSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(80),
  lastName: Joi.string().trim().min(2).max(80),
  email: email,
  phone: Joi.string().trim().max(30).allow('', null),
  status: Joi.string().valid('ACTIVE','BLOCKED')
}).min(1)
