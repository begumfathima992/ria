import { AdminActivityLog } from '../models/index.js'

export async function adminLog(req, action, entityType, entityId, details = null, transaction) {
  try {
    await AdminActivityLog.create({
      adminUserId: req.user.id,
      action,
      entityType: entityType || null,
      entityId: entityId != null ? String(entityId) : null,
      details,
      ipAddress: req.ip || null
    }, { transaction })
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') console.warn('Admin activity log failed:', error.message)
  }
}
