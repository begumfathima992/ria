import { Op, fn, col, literal } from 'sequelize'
import { InventoryLog, Order, OrderItem, Product, ProductVariant } from '../../models/index.js'
import { pagination, paginationMeta, success } from '../../utils/helpers.js'

export async function salesReport(req,res,next){
  try{
    const from=req.query.from?new Date(req.query.from):new Date(Date.now()-30*86400000)
    const to=req.query.to?new Date(`${req.query.to}T23:59:59.999`):new Date()
    const where={createdAt:{[Op.between]:[from,to]},status:{[Op.notIn]:['CANCELLED','RETURNED']}}
    const totals=await Order.findOne({where,attributes:[[fn('COUNT',col('id')),'orders'],[fn('SUM',col('subtotal')),'subtotal'],[fn('SUM',col('discount_amount')),'discount'],[fn('SUM',col('shipping_amount')),'shipping'],[fn('SUM',col('total_amount')),'revenue']],raw:true})
    const daily=await Order.findAll({where,attributes:[[fn('DATE',col('created_at')),'date'],[fn('COUNT',col('id')),'orders'],[fn('SUM',col('total_amount')),'revenue']],group:[literal('DATE(created_at)')],order:[[literal('DATE(created_at)'),'ASC']],raw:true})
    const topProducts=await OrderItem.findAll({attributes:['productId','productName',[fn('SUM',col('quantity')),'unitsSold'],[fn('SUM',col('line_total')),'sales']],include:[{model:Order,attributes:[],where}],group:['productId','productName'],order:[[literal('unitsSold'),'DESC']],limit:20,raw:true})
    return success(res,{from,to,totals:{orders:Number(totals?.orders||0),subtotal:Number(totals?.subtotal||0),discount:Number(totals?.discount||0),shipping:Number(totals?.shipping||0),revenue:Number(totals?.revenue||0)},daily,topProducts})
  }catch(error){next(error)}
}

export async function inventoryReport(req,res,next){
  try{
    const products=await Product.findAll({where:{isActive:true,trackInventory:true},attributes:['id','name','sku','stock','lowStockThreshold'],order:[['stock','ASC']]})
    const variants=await ProductVariant.findAll({where:{isActive:true},include:[{model:Product,as:'product',attributes:['id','name']}],attributes:['id','productId','name','sku','stock','lowStockThreshold'],order:[['stock','ASC']]})
    return success(res,{products,variants})
  }catch(error){next(error)}
}

export async function inventoryLogs(req,res,next){
  try{const{page,limit,offset}=pagination(req.query);const where={};if(req.query.productId)where.productId=req.query.productId;if(req.query.variantId)where.variantId=req.query.variantId;const{rows,count}=await InventoryLog.findAndCountAll({where,include:[{model:Product,attributes:['id','name','sku']},{model:ProductVariant,attributes:['id','name','sku'],required:false}],order:[['createdAt','DESC']],limit,offset});return success(res,rows,'OK',200,paginationMeta(count,page,limit))}catch(error){next(error)}
}
