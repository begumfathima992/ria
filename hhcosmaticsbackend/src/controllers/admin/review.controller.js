import { Product, Review, User } from '../../models/index.js'
import { refreshProductRating } from '../../services/review.service.js'
import { pagination, paginationMeta, success } from '../../utils/helpers.js'
import { ApiError } from '../../utils/ApiError.js'
import { adminLog } from '../../utils/adminLog.js'


export async function listReviews(req,res,next){
  try{const{page,limit,offset}=pagination(req.query);const where={};if(req.query.status)where.status=req.query.status;if(req.query.productId)where.productId=req.query.productId;const{rows,count}=await Review.findAndCountAll({where,include:[{model:User,as:'user',attributes:['id','firstName','lastName','email']},{model:Product,as:'product',attributes:['id','name','slug']}],order:[['createdAt','DESC']],limit,offset});return success(res,rows,'OK',200,paginationMeta(count,page,limit))}catch(error){next(error)}
}
export async function moderateReview(req,res,next){try{const row=await Review.findByPk(req.params.id);if(!row)throw new ApiError(404,'Review not found','REVIEW_NOT_FOUND');await row.update({status:req.body.status});await refreshProductRating(row.productId);await adminLog(req,'REVIEW_MODERATED','REVIEW',row.id,{status:row.status});return success(res,row,'Review status updated')}catch(error){next(error)}}
export async function deleteReview(req,res,next){try{const row=await Review.findByPk(req.params.id);if(!row)throw new ApiError(404,'Review not found','REVIEW_NOT_FOUND');const productId=row.productId;await row.destroy();await refreshProductRating(productId);await adminLog(req,'REVIEW_DELETED','REVIEW',row.id);return success(res,null,'Review deleted')}catch(error){next(error)}}
