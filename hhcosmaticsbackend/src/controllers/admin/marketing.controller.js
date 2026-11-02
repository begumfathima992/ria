import { Op } from 'sequelize'
import { Banner, Coupon, Setting, ContactMessage, NewsletterSubscriber } from '../../models/index.js'
import { pagination, paginationMeta, success } from '../../utils/helpers.js'
import { ApiError } from '../../utils/ApiError.js'
import { adminLog } from '../../utils/adminLog.js'

export async function listCoupons(req, res, next) {
  try { return success(res, await Coupon.findAll({ paranoid: false, order: [['createdAt','DESC']] })) } catch (error) { next(error) }
}
export async function createCoupon(req, res, next) {
  try { const row = await Coupon.create(req.body); await adminLog(req,'COUPON_CREATED','COUPON',row.id,{code:row.code}); return success(res,row,'Coupon created',201) } catch (error) { next(error) }
}
export async function updateCoupon(req, res, next) {
  try { const row = await Coupon.findByPk(req.params.id,{paranoid:false}); if(!row) throw new ApiError(404,'Coupon not found','COUPON_NOT_FOUND'); await row.update(req.body); await adminLog(req,'COUPON_UPDATED','COUPON',row.id,req.body); return success(res,row,'Coupon updated') } catch (error) { next(error) }
}
export async function deleteCoupon(req, res, next) {
  try { const row = await Coupon.findByPk(req.params.id); if(!row) throw new ApiError(404,'Coupon not found','COUPON_NOT_FOUND'); await row.destroy(); await adminLog(req,'COUPON_DELETED','COUPON',row.id); return success(res,null,'Coupon deleted') } catch (error) { next(error) }
}
export async function restoreCoupon(req,res,next){try{const row=await Coupon.findByPk(req.params.id,{paranoid:false});if(!row)throw new ApiError(404,'Coupon not found','COUPON_NOT_FOUND');await row.restore();await adminLog(req,'COUPON_RESTORED','COUPON',row.id);return success(res,row,'Coupon restored')}catch(error){next(error)}}

export async function listBanners(req,res,next){try{return success(res,await Banner.findAll({paranoid:false,order:[['position','ASC'],['sortOrder','ASC']]}))}catch(error){next(error)}}
export async function createBanner(req,res,next){try{const row=await Banner.create(req.body);await adminLog(req,'BANNER_CREATED','BANNER',row.id);return success(res,row,'Banner created',201)}catch(error){next(error)}}
export async function updateBanner(req,res,next){try{const row=await Banner.findByPk(req.params.id,{paranoid:false});if(!row)throw new ApiError(404,'Banner not found','BANNER_NOT_FOUND');await row.update(req.body);await adminLog(req,'BANNER_UPDATED','BANNER',row.id,req.body);return success(res,row,'Banner updated')}catch(error){next(error)}}
export async function deleteBanner(req,res,next){try{const row=await Banner.findByPk(req.params.id);if(!row)throw new ApiError(404,'Banner not found','BANNER_NOT_FOUND');await row.destroy();await adminLog(req,'BANNER_DELETED','BANNER',row.id);return success(res,null,'Banner deleted')}catch(error){next(error)}}
export async function restoreBanner(req,res,next){try{const row=await Banner.findByPk(req.params.id,{paranoid:false});if(!row)throw new ApiError(404,'Banner not found','BANNER_NOT_FOUND');await row.restore();await adminLog(req,'BANNER_RESTORED','BANNER',row.id);return success(res,row,'Banner restored')}catch(error){next(error)}}

export async function listSettings(req,res,next){try{return success(res,await Setting.findAll({order:[['key','ASC']]}))}catch(error){next(error)}}
export async function upsertSetting(req,res,next){try{const [row,created]=await Setting.findOrCreate({where:{key:req.params.key},defaults:{key:req.params.key,value:req.body.value,isPublic:req.body.isPublic ?? false}});if(!created)await row.update(req.body);await adminLog(req,'SETTING_UPSERTED','SETTING',row.id,{key:row.key});return success(res,row,created?'Setting created':'Setting updated',created?201:200)}catch(error){next(error)}}

export async function listContactMessages(req,res,next){
  try{const{page,limit,offset}=pagination(req.query);const where={};if(req.query.status)where.status=req.query.status;if(req.query.search){const q=`%${String(req.query.search).trim()}%`;where[Op.or]=[{name:{[Op.like]:q}},{email:{[Op.like]:q}},{subject:{[Op.like]:q}}]}const{rows,count}=await ContactMessage.findAndCountAll({where,order:[['createdAt','DESC']],limit,offset});return success(res,rows,'OK',200,paginationMeta(count,page,limit))}catch(error){next(error)}
}
export async function updateContactMessage(req,res,next){try{const row=await ContactMessage.findByPk(req.params.id);if(!row)throw new ApiError(404,'Contact message not found','CONTACT_NOT_FOUND');const patch={};if(req.body.status)patch.status=req.body.status;if('adminNote'in req.body)patch.adminNote=req.body.adminNote;await row.update(patch);await adminLog(req,'CONTACT_UPDATED','CONTACT_MESSAGE',row.id,patch);return success(res,row,'Contact message updated')}catch(error){next(error)}}
export async function listSubscribers(req,res,next){try{const{page,limit,offset}=pagination(req.query);const where={};if(req.query.active==='true')where.isActive=true;if(req.query.active==='false')where.isActive=false;const{rows,count}=await NewsletterSubscriber.findAndCountAll({where,order:[['subscribedAt','DESC']],limit,offset});return success(res,rows,'OK',200,paginationMeta(count,page,limit))}catch(error){next(error)}}
