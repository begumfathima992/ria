import { hashPassword } from '../utils/password.js'
import {
  User, Cart, Address, Category, Subcategory, Product, ProductVariant, ProductImage,
  Coupon, Banner, Setting, Order, OrderItem, OrderStatusHistory, Review,
  ContactMessage, NewsletterSubscriber
} from '../models/index.js'

const categories = [
  ['Hair Care','hair-care','Cleansers, masks, oils and scalp essentials.'],
  ['Wigs & Hairpieces','wigs-hairpieces','Wig care, lace styling and hairpiece essentials.'],
  ['Extensions','extensions','Braids, extensions and protective-style care.'],
  ['Styling & Finish','styling-finish','Edge control, curl definition and heat styling.'],
  ['Skin & Body','skin-body','Everyday cleansers and body care.'],
  ['Accessories','accessories','Brushes, bonnets and daily beauty essentials.']
]

const subcategories = {
  'hair-care': [['Shampoo','shampoo'],['Conditioner & Masks','conditioner-masks'],['Hair Oils & Serums','hair-oils-serums'],['Scalp Care','scalp-care']],
  'wigs-hairpieces': [['Lace Care','lace-care'],['Wig Care','wig-care']],
  'extensions': [['Braids & Locs','braids-locs'],['Extension Care','extension-care']],
  'styling-finish': [['Curl Styling','curl-styling'],['Edge Control','edge-control'],['Heat Protection','heat-protection']],
  'skin-body': [['Face Care','face-care'],['Body Care','body-care']],
  'accessories': [['Hair Tools','hair-tools'],['Sleep Care','sleep-care']]
}

const products = [
  { name:'Signature Radiance Hair Oil',slug:'signature-radiance-hair-oil',sku:'HH-HC-001',cat:'hair-care',sub:'hair-oils-serums',price:14.95,compare:18,stock:55,badge:'Best seller',featured:true, rating:4.9,reviews:124,short:'Weightless shine for dry lengths and textured hair.',description:'A lightweight finishing oil created to soften dry lengths, tame flyaways and add a polished, non-greasy shine.',ingredients:'Argan-inspired oil blend, vitamin E and lightweight emollients.' },
  { name:'Silk Moisture Shampoo',slug:'silk-moisture-shampoo',sku:'HH-HC-002',cat:'hair-care',sub:'shampoo',price:9.50,stock:75,badge:'New',isNew:true,rating:4.7,reviews:86,short:'A gentle cleanse with a soft, conditioned finish.',description:'A gentle everyday cleanser designed to refresh the scalp while helping hair feel soft, smooth and manageable.' },
  { name:'Intensive Repair Mask',slug:'intensive-repair-mask',sku:'HH-HC-003',cat:'hair-care',sub:'conditioner-masks',price:12.75,compare:15,stock:38,badge:'Save 15%',rating:4.8,reviews:72,short:'Rich weekly care for brittle-feeling, thirsty hair.',description:'A rich conditioning mask for brittle-feeling hair, bringing slip, moisture and softness to wash day.' },
  { name:'Defined Curl Cream',slug:'defined-curl-cream',sku:'HH-ST-004',cat:'styling-finish',sub:'curl-styling',price:8.95,stock:66,badge:'Curl favourite',featured:true,rating:4.6,reviews:98,short:'Flexible definition without a stiff or crunchy feel.',description:'A soft-hold curl cream that enhances shape and definition without leaving a stiff finish.' },
  { name:'Invisible Lace Melt Spray',slug:'invisible-lace-melt-spray',sku:'HH-WG-005',cat:'wigs-hairpieces',sub:'lace-care',price:10.50,stock:44,badge:'Trending',featured:true,rating:4.9,reviews:141,short:'A precise mist for seamless-looking lace styling.',description:'A precise styling mist created for a seamless-looking lace finish and confident all-day styling.' },
  { name:'Precision Edge Control',slug:'precision-edge-control',sku:'HH-ST-006',cat:'styling-finish',sub:'edge-control',price:6.95,stock:90,badge:'Salon edit',rating:4.5,reviews:64,short:'Clean satin hold for detailed, polished edges.',description:'A smooth edge styler with a clean satin finish, designed for detail work and polished everyday looks.' },
  { name:'Root Revival Scalp Serum',slug:'root-revival-scalp-serum',sku:'HH-HC-007',cat:'hair-care',sub:'scalp-care',price:16.50,stock:31,badge:'Editor’s pick',featured:true,rating:4.8,reviews:53,short:'A lightweight ritual for scalp massage and moisture.',description:'A concentrated scalp serum with a light, clean feel for regular massage and moisture-focused routines.' },
  { name:'Thermal Shield Protectant',slug:'thermal-shield-protectant',sku:'HH-ST-008',cat:'styling-finish',sub:'heat-protection',price:9.95,compare:11.50,stock:49,badge:'Save 13%',rating:4.7,reviews:77,short:'Fine pre-styling mist for heat-led routines.',description:'A lightweight pre-styling mist for blow-drying, straightening and curling routines.' },
  { name:'Velvet Body Butter',slug:'velvet-body-butter',sku:'HH-SB-009',cat:'skin-body',sub:'body-care',price:11.95,stock:41,badge:'Soft skin edit',rating:4.6,reviews:43,short:'A whipped body moisturiser with a satin finish.',description:'A rich body moisturiser with a soft whipped texture and refined warm floral fragrance.' },
  { name:'Rose Glow Cleanser',slug:'rose-glow-cleanser',sku:'HH-SB-010',cat:'skin-body',sub:'face-care',price:8.50,stock:58,badge:'New',isNew:true,rating:4.4,reviews:39,short:'A creamy everyday cleanser for a comfortable finish.',description:'A creamy daily face cleanser designed to remove surface impurities without a tight after-feel.' },
  { name:'Wig Care Conditioning Mist',slug:'wig-care-conditioning-mist',sku:'HH-WG-011',cat:'wigs-hairpieces',sub:'wig-care',price:7.95,stock:63,badge:'Daily care',rating:4.7,reviews:89,short:'Refresh, soften and detangle between wash days.',description:'A refreshing conditioning mist for synthetic and human-hair wig care between washes.' },
  { name:'Braid & Loc Finishing Mousse',slug:'braid-and-loc-finishing-mousse',sku:'HH-EX-012',cat:'extensions',sub:'braids-locs',price:8.95,stock:72,badge:'Protective style',featured:true,rating:4.8,reviews:118,short:'Light foam for smooth braids, twists and locs.',description:'A light finishing mousse to refine braids, twists and loc styles with a smooth salon-inspired finish.' },
  { name:'Flex Glide Detangling Brush',slug:'flex-glide-detangling-brush',sku:'HH-AC-013',cat:'accessories',sub:'hair-tools',price:7.95,stock:100,badge:'Routine essential',rating:4.8,reviews:67,short:'Flexible rows for gentle detangling on wet or dry hair.',description:'A flexible detangling brush designed to move with the hair and make everyday routines smoother.' },
  { name:'Signature Satin Sleep Bonnet',slug:'signature-satin-sleep-bonnet',sku:'HH-AC-014',cat:'accessories',sub:'sleep-care',price:9.95,stock:80,badge:'Night-time care',rating:4.9,reviews:102,short:'Soft satin protection for curls, braids and styled hair.',description:'A roomy satin bonnet with a comfortable band, created to help preserve styled hair and reduce overnight friction.' }
]

const img = (slug) => `https://placehold.co/900x1100/F7F1ED/5A1021?text=${encodeURIComponent(slug.replaceAll('-',' '))}`

export async function seedDatabase() {
  const [admin] = await User.findOrCreate({ where: { email: 'admin@hhcosmetics.co.uk' }, defaults: { firstName:'H&H',lastName:'Admin',email:'admin@hhcosmetics.co.uk',phone:'+44 20 7946 0123',passwordHash:hashPassword('Admin@12345'),role:'SUPERADMIN',status:'ACTIVE',emailVerifiedAt:new Date() } })
  const [customer] = await User.findOrCreate({ where: { email: 'customer@example.com' }, defaults: { firstName:'Amelia',lastName:'Brown',email:'customer@example.com',phone:'07123456789',passwordHash:hashPassword('User@12345'),role:'USER',status:'ACTIVE',emailVerifiedAt:new Date() } })
  await Cart.findOrCreate({ where: { userId: customer.id }, defaults: { userId: customer.id } })
  await Address.findOrCreate({ where: { userId: customer.id, label:'Home' }, defaults: { userId:customer.id,label:'Home',firstName:'Amelia',lastName:'Brown',phone:'07123456789',addressLine1:'24 Kensington Gardens',city:'London',county:'Greater London',postcode:'W8 4PX',country:'United Kingdom',isDefault:true } })

  const catMap = {}
  for (let i=0;i<categories.length;i++) {
    const [name,slug,description]=categories[i]
    const [row]=await Category.findOrCreate({where:{slug},defaults:{name,slug,description,imageUrl:img(slug),sortOrder:i+1,isActive:true}})
    catMap[slug]=row
  }
  const subMap = {}
  for (const [catSlug, list] of Object.entries(subcategories)) {
    for (let i=0;i<list.length;i++) {
      const [name,slug]=list[i]
      const [row]=await Subcategory.findOrCreate({where:{slug},defaults:{categoryId:catMap[catSlug].id,name,slug,description:`Shop ${name.toLowerCase()} at H&H Hair & Cosmetics.`,imageUrl:img(slug),sortOrder:i+1,isActive:true}})
      subMap[slug]=row
    }
  }
  const productMap={}
  for (const p of products) {
    const [row]=await Product.findOrCreate({where:{slug:p.slug},defaults:{categoryId:catMap[p.cat].id,subcategoryId:subMap[p.sub]?.id||null,name:p.name,slug:p.slug,sku:p.sku,brand:'H&H Hair & Cosmetics',shortDescription:p.short,description:p.description,ingredients:p.ingredients||'Demo cosmetic ingredient copy for development only.',usageNotes:'Use as directed on the product label. Demo content only.',basePrice:p.price,compareAtPrice:p.compare||null,costPrice:Number((p.price*.48).toFixed(2)),stock:p.stock,lowStockThreshold:8,trackInventory:true,badge:p.badge,ratingAverage:p.rating,reviewCount:p.reviews,isFeatured:Boolean(p.featured),isNew:Boolean(p.isNew),isActive:true,metadata:{source:'H&H frontend v7 dummy catalogue'}}})
    productMap[p.slug]=row
    await ProductImage.findOrCreate({where:{productId:row.id,isPrimary:true},defaults:{productId:row.id,imageUrl:img(p.slug),altText:p.name,sortOrder:0,isPrimary:true}})
  }

  const variants = [
    ['signature-radiance-hair-oil','50ml','HH-HC-001-50',14.95,55,{size:'50ml'},true],
    ['signature-radiance-hair-oil','100ml','HH-HC-001-100',22.95,30,{size:'100ml'},false],
    ['silk-moisture-shampoo','300ml','HH-HC-002-300',9.50,75,{size:'300ml'},true],
    ['signature-satin-sleep-bonnet','Burgundy','HH-AC-014-BUR',9.95,45,{colour:'Burgundy'},true],
    ['signature-satin-sleep-bonnet','Black','HH-AC-014-BLK',9.95,35,{colour:'Black'},false],
    ['flex-glide-detangling-brush','Burgundy','HH-AC-013-BUR',7.95,60,{colour:'Burgundy'},true]
  ]
  for (const [slug,name,sku,price,stock,attributes,isDefault] of variants) {
    const product=productMap[slug]
    await ProductVariant.findOrCreate({where:{sku},defaults:{productId:product.id,name,sku,attributes,price,stock,lowStockThreshold:6,isDefault,isActive:true}})
  }

  await Coupon.findOrCreate({where:{code:'HH10'},defaults:{code:'HH10',name:'10% Welcome Saving',type:'PERCENT',value:10,minOrder:20,maxDiscount:25,usageLimit:1000,perUserLimit:1,isActive:true}})
  await Coupon.findOrCreate({where:{code:'BEAUTY5'},defaults:{code:'BEAUTY5',name:'£5 Beauty Saving',type:'FIXED',value:5,minOrder:30,usageLimit:500,perUserLimit:2,isActive:true}})

  await Banner.findOrCreate({where:{title:'Premium hair & beauty, curated for every ritual'},defaults:{title:'Premium hair & beauty, curated for every ritual',subtitle:'Discover H&H essentials for wash day, protective styling and everyday beauty.',imageUrl:img('hh-hair-cosmetics-hero'),linkUrl:'/shop',position:'HOME_HERO',sortOrder:1,isActive:true}})
  const settings = {
    store_name:'H&H Hair & Cosmetics',currency:'GBP',support_email:'hello@hhcosmetics.co.uk',support_phone:'+44 20 7946 0123',free_delivery_threshold:45,standard_delivery_fee:4.95,express_delivery_fee:7.95,cod_fee:0,cod_enabled:true
  }
  for (const [key,value] of Object.entries(settings)) await Setting.findOrCreate({where:{key},defaults:{key,value,isPublic:true}})

  const orderNumber='HH-DEMO-1001'
  if (!(await Order.findOne({where:{orderNumber}}))) {
    const oil=productMap['signature-radiance-hair-oil']; const bonnet=productMap['signature-satin-sleep-bonnet']
    const order=await Order.create({userId:customer.id,orderNumber,status:'DELIVERED',paymentMethod:'COD',paymentStatus:'PAID',shippingMethod:'STANDARD',currency:'GBP',subtotal:24.90,discountAmount:0,shippingAmount:4.95,codFee:0,totalAmount:29.85,shippingAddress:{firstName:'Amelia',lastName:'Brown',phone:'07123456789',addressLine1:'24 Kensington Gardens',city:'London',county:'Greater London',postcode:'W8 4PX',country:'United Kingdom'},billingAddress:{firstName:'Amelia',lastName:'Brown',phone:'07123456789',addressLine1:'24 Kensington Gardens',city:'London',county:'Greater London',postcode:'W8 4PX',country:'United Kingdom'},confirmedAt:new Date(Date.now()-5*86400000),shippedAt:new Date(Date.now()-4*86400000),deliveredAt:new Date(Date.now()-2*86400000)})
    await OrderItem.bulkCreate([{orderId:order.id,productId:oil.id,productName:oil.name,sku:oil.sku,imageUrl:img(oil.slug),unitPrice:14.95,quantity:1,lineTotal:14.95},{orderId:order.id,productId:bonnet.id,productName:bonnet.name,sku:bonnet.sku,imageUrl:img(bonnet.slug),unitPrice:9.95,quantity:1,lineTotal:9.95}])
    await OrderStatusHistory.bulkCreate([{orderId:order.id,status:'PENDING',note:'Demo order placed',changedByUserId:customer.id},{orderId:order.id,status:'CONFIRMED',note:'Confirmed by H&H',changedByUserId:admin.id},{orderId:order.id,status:'SHIPPED',note:'Royal Mail demo shipment',changedByUserId:admin.id},{orderId:order.id,status:'DELIVERED',note:'Delivered and COD collected',changedByUserId:admin.id}])
    await Review.findOrCreate({where:{userId:customer.id,productId:oil.id},defaults:{userId:customer.id,productId:oil.id,orderId:order.id,rating:5,title:'Lovely finish',comment:'Leaves my hair soft and glossy without feeling heavy.',status:'APPROVED',isVerifiedPurchase:true}})
  }
  await ContactMessage.findOrCreate({where:{email:'customer@example.com',subject:'Product availability'},defaults:{userId:customer.id,name:'Amelia Brown',email:'customer@example.com',phone:'07123456789',subject:'Product availability',message:'Will the satin bonnet be available in more colours?',status:'NEW'}})
  await NewsletterSubscriber.findOrCreate({where:{email:'customer@example.com'},defaults:{email:'customer@example.com',isActive:true,subscribedAt:new Date()}})

  return { admin, customer }
}
