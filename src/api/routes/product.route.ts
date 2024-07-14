import { Router } from 'express'
import * as controller from '~/controllers/product.controller'
import validationRules from '~/middleware/request-validator'

const router = Router()

router.post(
  '/',
  validationRules([
    { field: 'productCode', type: 'string', location: 'body' },
    { field: 'quantityPO', type: 'int', location: 'body' }
    // { field: 'dateInputNPL', type: 'date', location: 'body' },
    // { field: 'dateOutputFCR', type: 'date', location: 'body' }
  ]),
  controller.createNewItem
)

// Get item by productID and importedID
router.get('/:id', validationRules([{ field: 'id', type: 'int', location: 'params' }]), controller.getItemByPk)
router.get(
  '/productCode/:productCode',
  validationRules([{ field: 'productCode', type: 'string', location: 'params' }]),
  controller.getItemByProductCode
)

// Get all items
router.post(
  '/find',
  validationRules([
    { field: 'filter', type: 'object', location: 'body' },
    { field: 'paginator', type: 'object', location: 'body' },
    { field: 'search', type: 'object', location: 'body' },
    { field: 'sorting', type: 'object', location: 'body' }
  ]),
  controller.getItems
)

// Update item by productID and importedID
router.patch('/:id', validationRules([{ field: 'id', type: 'int', location: 'params' }]), controller.updateItemByPk)

// Delete item by productID
router.delete('/:id', validationRules([{ field: 'id', type: 'int', location: 'params' }]), controller.deleteItemByPk)

export default router
