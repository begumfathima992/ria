import { success } from '../../utils/helpers.js'
import { ApiError } from '../../utils/ApiError.js'

export async function uploadImage(req,res,next){
  try{
    if(!req.file) throw new ApiError(422,'Select an image file','IMAGE_REQUIRED')
    const base=(process.env.APP_URL||`${req.protocol}://${req.get('host')}`).replace(/\/$/,'')
    return success(res,{filename:req.file.filename,url:`${base}/uploads/${encodeURIComponent(req.file.filename)}`,size:req.file.size,mimetype:req.file.mimetype},'Image uploaded',201)
  }catch(error){next(error)}
}
