import { Router } from 'express'
import * as controller from '~/controllers/product-group.controller'
import validationRules from '~/middleware/request-validator'

const router = Router()

router.post(
  '/',
  validationRules([
    { field: 'groupID', type: 'int', location: 'body' },
    { field: 'productID', type: 'int', location: 'body' }
  ]),
  controller.createNewItem
)

// Get item by productID and importedID
router.get('/:id', validationRules([{ field: 'id', type: 'int', location: 'params' }]), controller.getItemByPk)

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

router.put('/', controller.updateItems)

// Update item by productID and importedID
router.patch('/:id', validationRules([{ field: 'id', type: 'int', location: 'params' }]), controller.updateItemByPk)

// Delete item by productID
router.delete('/:id', validationRules([{ field: 'id', type: 'int', location: 'params' }]), controller.deleteItemByPk)

export default router
