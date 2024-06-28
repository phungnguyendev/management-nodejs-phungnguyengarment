import { Router } from 'express'
import * as controller from '~/controllers/role.controller'
import validationRules from '~/middleware/request-validator'

const router = Router()

router.post(
  '/',
  validationRules([
    { field: 'role', type: 'string', location: 'body' },
    { field: 'isAdmin', type: 'boolean', location: 'body' },
    { field: 'shortName', type: 'string', location: 'body' },
    { field: 'desc', type: 'string', location: 'body' }
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

// Update item by productID and importedID
router.patch('/:id', validationRules([{ field: 'id', type: 'int', location: 'params' }]), controller.updateItemByPk)

// Delete item by productID
router.delete('/:id', validationRules([{ field: 'id', type: 'int', location: 'params' }]), controller.deleteItemByPk)

export default router
