export function validate(schema, source = 'body', options = {}) {
  return (req, res, next) => {
    const { value, error } = schema.validate(req[source], { abortEarly: false, stripUnknown: true, convert: true, ...options })
    if (error) {
      return res.status(422).json({
        success: false,
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        errors: error.details.map((item) => ({ field: item.path.join('.'), message: item.message, type: item.type }))
      })
    }
    req[source] = value
    next()
  }
}
