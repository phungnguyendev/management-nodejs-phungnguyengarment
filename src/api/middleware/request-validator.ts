import { NextFunction, Request, Response } from 'express'
import { Location, ValidationChain, body, cookie, header, param, query, validationResult } from 'express-validator'

type RuleType = {
  field: string
  location: Location
  type: 'string' | 'int' | 'float' | 'date' | 'boolean' | 'object' | 'array' | 'email'
  required?: boolean | null
}

const validationRules = (rules: RuleType[]) => {
  const smartRenderValidationChain = (rule: RuleType): ValidationChain => {
    switch (rule.location) {
      case 'body':
        return customValidators(rule, body(rule.field))
      case 'cookies':
        return customValidators(rule, cookie(rule.field))
      case 'headers':
        return customValidators(rule, header(rule.field))
      case 'params':
        return customValidators(rule, param(rule.field))
      default:
        return customValidators(rule, query(rule.field))
    }
  }

  const customValidators = (rule: RuleType, validationChain: ValidationChain): ValidationChain => {
    switch (rule.type) {
      case 'string':
        return validationChain
          .exists()
          .withMessage('Field is not exist!')
          .notEmpty()
          .withMessage('Field is not empty!')
          .isString()
          .withMessage('Field must be string type!')
      case 'email':
        return validationChain
          .exists()
          .withMessage('Field is not exist!')
          .notEmpty()
          .withMessage('Field is not empty!')
          .isString()
          .withMessage('Field must be string type!')
          .isEmail()
          .withMessage('Field is not valid email type!')
      case 'int':
        return validationChain
          .exists()
          .withMessage('Field is not exist!')
          .notEmpty()
          .withMessage('Field is not empty!')
          .isInt()
          .withMessage('Field must be int type!')
      case 'float':
        return validationChain
          .exists()
          .withMessage('Field is not exist!')
          .notEmpty()
          .withMessage('Field is not empty!')
          .isFloat()
          .withMessage('Field must be float type!')
      case 'boolean':
        return validationChain
          .exists()
          .withMessage('Field is not exist!')
          .notEmpty()
          .withMessage('Field is not empty!')
          .isBoolean()
          .withMessage('Field must be boolean type!')
      case 'date':
        return validationChain
          .exists()
          .withMessage('Field is not exist!')
          .notEmpty()
          .withMessage('Field is not empty!')
          .isString()
          .withMessage('Field must be date type!')
      case 'array':
        return validationChain
          .exists()
          .withMessage('Field is not exist!')
          .notEmpty()
          .withMessage('Field is not empty!')
          .isArray()
          .withMessage('Field must be array type!')
      default:
        return validationChain
          .exists()
          .withMessage('Field is not exist!')
          .notEmpty()
          .withMessage('Field is not empty!')
          .isObject()
          .withMessage('Field must be object type!')
    }
  }

  return async (req: Request, res: Response, next: NextFunction) => {
    // Áp dụng các quy tắc xác nhận cho từng trường
    await Promise.all(rules.map((rule) => smartRenderValidationChain(rule).run(req)))

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        isSuccess: false,
        message: 'Error validate request',
        errors: errors.array()
      })
    }

    next()
  }
}

export default validationRules
