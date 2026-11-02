import { DataTypes } from 'sequelize'
import { sequelize } from '../config/database.js'

const pk = () => ({ type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true })
const money = () => ({ type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 })

export const User = sequelize.define('User', {
  id: pk(),
  firstName: { type: DataTypes.STRING(80), allowNull: false },
  lastName: { type: DataTypes.STRING(80), allowNull: false },
  email: { type: DataTypes.STRING(191), allowNull: false, unique: true },
  phone: { type: DataTypes.STRING(30) },
  passwordHash: { type: DataTypes.STRING(255), allowNull: false },
  role: { type: DataTypes.ENUM('USER', 'SUPERADMIN'), allowNull: false, defaultValue: 'USER' },
  status: { type: DataTypes.ENUM('ACTIVE', 'BLOCKED'), allowNull: false, defaultValue: 'ACTIVE' },
  emailVerifiedAt: { type: DataTypes.DATE },
  lastLoginAt: { type: DataTypes.DATE }
}, { tableName: 'users', paranoid: true })

export const RefreshToken = sequelize.define('RefreshToken', {
  id: pk(),
  userId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  tokenHash: { type: DataTypes.STRING(64), allowNull: false, unique: true },
  expiresAt: { type: DataTypes.DATE, allowNull: false },
  revokedAt: { type: DataTypes.DATE },
  userAgent: { type: DataTypes.STRING(500) },
  ipAddress: { type: DataTypes.STRING(64) }
}, { tableName: 'refresh_tokens', updatedAt: false })

export const PasswordReset = sequelize.define('PasswordReset', {
  id: pk(),
  userId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  tokenHash: { type: DataTypes.STRING(64), allowNull: false, unique: true },
  expiresAt: { type: DataTypes.DATE, allowNull: false },
  usedAt: { type: DataTypes.DATE }
}, { tableName: 'password_resets', updatedAt: false })

export const Address = sequelize.define('Address', {
  id: pk(),
  userId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  label: { type: DataTypes.STRING(50), defaultValue: 'Home' },
  firstName: { type: DataTypes.STRING(80), allowNull: false },
  lastName: { type: DataTypes.STRING(80), allowNull: false },
  phone: { type: DataTypes.STRING(30), allowNull: false },
  addressLine1: { type: DataTypes.STRING(191), allowNull: false },
  addressLine2: { type: DataTypes.STRING(191) },
  city: { type: DataTypes.STRING(100), allowNull: false },
  county: { type: DataTypes.STRING(100) },
  postcode: { type: DataTypes.STRING(20), allowNull: false },
  country: { type: DataTypes.STRING(80), allowNull: false, defaultValue: 'United Kingdom' },
  isDefault: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
}, { tableName: 'addresses' })

export const Category = sequelize.define('Category', {
  id: pk(),
  name: { type: DataTypes.STRING(120), allowNull: false, unique: true },
  slug: { type: DataTypes.STRING(140), allowNull: false, unique: true },
  description: { type: DataTypes.TEXT },
  imageUrl: { type: DataTypes.STRING(500) },
  sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, { tableName: 'categories', paranoid: true })

export const Subcategory = sequelize.define('Subcategory', {
  id: pk(),
  categoryId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  name: { type: DataTypes.STRING(120), allowNull: false },
  slug: { type: DataTypes.STRING(140), allowNull: false, unique: true },
  description: { type: DataTypes.TEXT },
  imageUrl: { type: DataTypes.STRING(500) },
  sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, { tableName: 'subcategories', paranoid: true })

export const Product = sequelize.define('Product', {
  id: pk(),
  categoryId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  subcategoryId: { type: DataTypes.BIGINT.UNSIGNED },
  name: { type: DataTypes.STRING(191), allowNull: false },
  slug: { type: DataTypes.STRING(220), allowNull: false, unique: true },
  sku: { type: DataTypes.STRING(80), unique: true },
  brand: { type: DataTypes.STRING(120), defaultValue: 'H&H Hair & Cosmetics' },
  shortDescription: { type: DataTypes.STRING(500) },
  description: { type: DataTypes.TEXT('long') },
  ingredients: { type: DataTypes.TEXT('long') },
  usageNotes: { type: DataTypes.TEXT('long') },
  basePrice: money(),
  compareAtPrice: { type: DataTypes.DECIMAL(10, 2) },
  costPrice: { type: DataTypes.DECIMAL(10, 2) },
  stock: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
  lowStockThreshold: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 5 },
  trackInventory: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  badge: { type: DataTypes.STRING(80) },
  ratingAverage: { type: DataTypes.DECIMAL(3, 2), allowNull: false, defaultValue: 0 },
  reviewCount: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
  isFeatured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  isNew: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  metadata: { type: DataTypes.JSON }
}, { tableName: 'products', paranoid: true })

export const ProductVariant = sequelize.define('ProductVariant', {
  id: pk(),
  productId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  name: { type: DataTypes.STRING(150), allowNull: false },
  sku: { type: DataTypes.STRING(80), allowNull: false, unique: true },
  attributes: { type: DataTypes.JSON },
  price: money(),
  compareAtPrice: { type: DataTypes.DECIMAL(10, 2) },
  costPrice: { type: DataTypes.DECIMAL(10, 2) },
  stock: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
  lowStockThreshold: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 5 },
  isDefault: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, { tableName: 'product_variants', paranoid: true })

export const ProductImage = sequelize.define('ProductImage', {
  id: pk(),
  productId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  variantId: { type: DataTypes.BIGINT.UNSIGNED },
  imageUrl: { type: DataTypes.STRING(500), allowNull: false },
  altText: { type: DataTypes.STRING(255) },
  sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  isPrimary: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
}, { tableName: 'product_images' })

export const Wishlist = sequelize.define('Wishlist', {
  id: pk(),
  userId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  productId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false }
}, { tableName: 'wishlists', indexes: [{ unique: true, fields: ['user_id', 'product_id'] }] })

export const Cart = sequelize.define('Cart', {
  id: pk(),
  userId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, unique: true }
}, { tableName: 'carts' })

export const CartItem = sequelize.define('CartItem', {
  id: pk(),
  cartId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  productId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  variantId: { type: DataTypes.BIGINT.UNSIGNED },
  quantity: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 1 }
}, { tableName: 'cart_items' })

export const Coupon = sequelize.define('Coupon', {
  id: pk(),
  code: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  name: { type: DataTypes.STRING(120), allowNull: false },
  type: { type: DataTypes.ENUM('PERCENT', 'FIXED'), allowNull: false },
  value: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  minOrder: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  maxDiscount: { type: DataTypes.DECIMAL(10, 2) },
  usageLimit: { type: DataTypes.INTEGER.UNSIGNED },
  usedCount: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
  perUserLimit: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 1 },
  startsAt: { type: DataTypes.DATE },
  endsAt: { type: DataTypes.DATE },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, { tableName: 'coupons', paranoid: true })

export const CouponUsage = sequelize.define('CouponUsage', {
  id: pk(),
  couponId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  userId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  orderId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  discountAmount: money()
}, { tableName: 'coupon_usages' })

export const Order = sequelize.define('Order', {
  id: pk(),
  userId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  couponId: { type: DataTypes.BIGINT.UNSIGNED },
  orderNumber: { type: DataTypes.STRING(40), allowNull: false, unique: true },
  status: { type: DataTypes.ENUM('PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED','RETURN_REQUESTED','RETURNED'), allowNull: false, defaultValue: 'PENDING' },
  paymentMethod: { type: DataTypes.ENUM('COD'), allowNull: false, defaultValue: 'COD' },
  paymentStatus: { type: DataTypes.ENUM('COD_PENDING','PAID','REFUNDED','VOID'), allowNull: false, defaultValue: 'COD_PENDING' },
  shippingMethod: { type: DataTypes.ENUM('STANDARD','EXPRESS'), allowNull: false, defaultValue: 'STANDARD' },
  currency: { type: DataTypes.STRING(3), allowNull: false, defaultValue: 'GBP' },
  subtotal: money(),
  discountAmount: money(),
  shippingAmount: money(),
  codFee: money(),
  totalAmount: money(),
  couponCode: { type: DataTypes.STRING(50) },
  customerNote: { type: DataTypes.STRING(1000) },
  adminNote: { type: DataTypes.STRING(2000) },
  shippingAddress: { type: DataTypes.JSON, allowNull: false },
  billingAddress: { type: DataTypes.JSON },
  trackingNumber: { type: DataTypes.STRING(120) },
  carrier: { type: DataTypes.STRING(120) },
  confirmedAt: { type: DataTypes.DATE },
  shippedAt: { type: DataTypes.DATE },
  deliveredAt: { type: DataTypes.DATE },
  cancelledAt: { type: DataTypes.DATE }
}, { tableName: 'orders' })

export const OrderItem = sequelize.define('OrderItem', {
  id: pk(),
  orderId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  productId: { type: DataTypes.BIGINT.UNSIGNED },
  variantId: { type: DataTypes.BIGINT.UNSIGNED },
  productName: { type: DataTypes.STRING(191), allowNull: false },
  variantName: { type: DataTypes.STRING(150) },
  sku: { type: DataTypes.STRING(80) },
  imageUrl: { type: DataTypes.STRING(500) },
  unitPrice: money(),
  quantity: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  lineTotal: money()
}, { tableName: 'order_items', updatedAt: false })

export const OrderStatusHistory = sequelize.define('OrderStatusHistory', {
  id: pk(),
  orderId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  status: { type: DataTypes.STRING(40), allowNull: false },
  note: { type: DataTypes.STRING(1000) },
  changedByUserId: { type: DataTypes.BIGINT.UNSIGNED }
}, { tableName: 'order_status_history', updatedAt: false })

export const Review = sequelize.define('Review', {
  id: pk(),
  userId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  productId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  orderId: { type: DataTypes.BIGINT.UNSIGNED },
  rating: { type: DataTypes.TINYINT.UNSIGNED, allowNull: false },
  title: { type: DataTypes.STRING(120) },
  comment: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.ENUM('PENDING','APPROVED','REJECTED'), allowNull: false, defaultValue: 'PENDING' },
  isVerifiedPurchase: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
}, { tableName: 'reviews', indexes: [{ unique: true, fields: ['user_id', 'product_id'] }] })

export const Banner = sequelize.define('Banner', {
  id: pk(),
  title: { type: DataTypes.STRING(191), allowNull: false },
  subtitle: { type: DataTypes.STRING(500) },
  imageUrl: { type: DataTypes.STRING(500), allowNull: false },
  mobileImageUrl: { type: DataTypes.STRING(500) },
  linkUrl: { type: DataTypes.STRING(500) },
  position: { type: DataTypes.STRING(80), allowNull: false, defaultValue: 'HOME_HERO' },
  sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  startsAt: { type: DataTypes.DATE },
  endsAt: { type: DataTypes.DATE },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, { tableName: 'banners', paranoid: true })

export const Setting = sequelize.define('Setting', {
  id: pk(),
  key: { type: DataTypes.STRING(120), allowNull: false, unique: true },
  value: { type: DataTypes.JSON },
  isPublic: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
}, { tableName: 'settings' })

export const InventoryLog = sequelize.define('InventoryLog', {
  id: pk(),
  productId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  variantId: { type: DataTypes.BIGINT.UNSIGNED },
  changeQuantity: { type: DataTypes.INTEGER, allowNull: false },
  beforeQuantity: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  afterQuantity: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  reason: { type: DataTypes.STRING(120), allowNull: false },
  reference: { type: DataTypes.STRING(120) },
  changedByUserId: { type: DataTypes.BIGINT.UNSIGNED }
}, { tableName: 'inventory_logs', updatedAt: false })

export const AdminActivityLog = sequelize.define('AdminActivityLog', {
  id: pk(),
  adminUserId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  action: { type: DataTypes.STRING(120), allowNull: false },
  entityType: { type: DataTypes.STRING(80) },
  entityId: { type: DataTypes.STRING(80) },
  details: { type: DataTypes.JSON },
  ipAddress: { type: DataTypes.STRING(64) }
}, { tableName: 'admin_activity_logs', updatedAt: false })

export const ContactMessage = sequelize.define('ContactMessage', {
  id: pk(),
  userId: { type: DataTypes.BIGINT.UNSIGNED },
  name: { type: DataTypes.STRING(160), allowNull: false },
  email: { type: DataTypes.STRING(191), allowNull: false },
  phone: { type: DataTypes.STRING(30) },
  subject: { type: DataTypes.STRING(191), allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.ENUM('NEW','IN_PROGRESS','RESOLVED','CLOSED'), allowNull: false, defaultValue: 'NEW' },
  adminNote: { type: DataTypes.TEXT }
}, { tableName: 'contact_messages' })

export const NewsletterSubscriber = sequelize.define('NewsletterSubscriber', {
  id: pk(),
  email: { type: DataTypes.STRING(191), allowNull: false, unique: true },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  subscribedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  unsubscribedAt: { type: DataTypes.DATE }
}, { tableName: 'newsletter_subscribers' })

// Associations
User.hasMany(Address, { foreignKey: 'userId', as: 'addresses' }); Address.belongsTo(User, { foreignKey: 'userId' })
User.hasMany(RefreshToken, { foreignKey: 'userId' }); RefreshToken.belongsTo(User, { foreignKey: 'userId' })
User.hasMany(PasswordReset, { foreignKey: 'userId' }); PasswordReset.belongsTo(User, { foreignKey: 'userId' })
Category.hasMany(Subcategory, { foreignKey: 'categoryId', as: 'subcategories' }); Subcategory.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' })
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' }); Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' })
Subcategory.hasMany(Product, { foreignKey: 'subcategoryId', as: 'products' }); Product.belongsTo(Subcategory, { foreignKey: 'subcategoryId', as: 'subcategory' })
Product.hasMany(ProductVariant, { foreignKey: 'productId', as: 'variants' }); ProductVariant.belongsTo(Product, { foreignKey: 'productId', as: 'product' })
Product.hasMany(ProductImage, { foreignKey: 'productId', as: 'images' }); ProductImage.belongsTo(Product, { foreignKey: 'productId', as: 'product' })
ProductVariant.hasMany(ProductImage, { foreignKey: 'variantId', as: 'images' }); ProductImage.belongsTo(ProductVariant, { foreignKey: 'variantId', as: 'variant' })
User.belongsToMany(Product, { through: Wishlist, foreignKey: 'userId', otherKey: 'productId', as: 'wishlistProducts' })
Product.belongsToMany(User, { through: Wishlist, foreignKey: 'productId', otherKey: 'userId', as: 'wishlistedBy' })
User.hasOne(Cart, { foreignKey: 'userId', as: 'cart' }); Cart.belongsTo(User, { foreignKey: 'userId' })
Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items', onDelete: 'CASCADE' }); CartItem.belongsTo(Cart, { foreignKey: 'cartId' })
CartItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' }); CartItem.belongsTo(ProductVariant, { foreignKey: 'variantId', as: 'variant' })
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' }); Order.belongsTo(User, { foreignKey: 'userId', as: 'user' })
Coupon.hasMany(Order, { foreignKey: 'couponId', as: 'orders' }); Order.belongsTo(Coupon, { foreignKey: 'couponId', as: 'coupon' })
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items', onDelete: 'CASCADE' }); OrderItem.belongsTo(Order, { foreignKey: 'orderId' })
Order.hasMany(OrderStatusHistory, { foreignKey: 'orderId', as: 'history', onDelete: 'CASCADE' }); OrderStatusHistory.belongsTo(Order, { foreignKey: 'orderId' })
Coupon.hasMany(CouponUsage, { foreignKey: 'couponId' }); CouponUsage.belongsTo(Coupon, { foreignKey: 'couponId' })
User.hasMany(CouponUsage, { foreignKey: 'userId' }); CouponUsage.belongsTo(User, { foreignKey: 'userId' })
Order.hasOne(CouponUsage, { foreignKey: 'orderId' }); CouponUsage.belongsTo(Order, { foreignKey: 'orderId' })
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' }); Review.belongsTo(User, { foreignKey: 'userId', as: 'user' })
Product.hasMany(Review, { foreignKey: 'productId', as: 'reviews' }); Review.belongsTo(Product, { foreignKey: 'productId', as: 'product' })
Order.hasMany(Review, { foreignKey: 'orderId' }); Review.belongsTo(Order, { foreignKey: 'orderId' })
Product.hasMany(InventoryLog, { foreignKey: 'productId', as: 'inventoryLogs' }); InventoryLog.belongsTo(Product, { foreignKey: 'productId' })
ProductVariant.hasMany(InventoryLog, { foreignKey: 'variantId', as: 'inventoryLogs' }); InventoryLog.belongsTo(ProductVariant, { foreignKey: 'variantId' })
User.hasMany(AdminActivityLog, { foreignKey: 'adminUserId', as: 'adminActivityLogs' }); AdminActivityLog.belongsTo(User, { foreignKey: 'adminUserId', as: 'admin' })
User.hasMany(ContactMessage, { foreignKey: 'userId', as: 'contactMessages' }); ContactMessage.belongsTo(User, { foreignKey: 'userId', as: 'user' })

export const models = {
  User, RefreshToken, PasswordReset, Address, Category, Subcategory, Product, ProductVariant,
  ProductImage, Wishlist, Cart, CartItem, Coupon, CouponUsage, Order, OrderItem,
  OrderStatusHistory, Review, Banner, Setting, InventoryLog, AdminActivityLog, ContactMessage, NewsletterSubscriber
}

export default models
