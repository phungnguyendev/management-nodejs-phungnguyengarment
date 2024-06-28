import { Router } from 'express'
import * as controller from '~/controllers/user-role.controller'
import validationRules from '~/middleware/request-validator'

const router = Router()

router.post(
  '/',
  validationRules([
    { field: 'userID', type: 'int', location: 'body' },
    { field: 'roleID', type: 'int', location: 'body' }
  ]),
  controller.createNewItem
)

// Get item by productID and importedID
router.get('/:id', validationRules([{ field: 'id', type: 'int', location: 'params' }]), controller.getItemByPk)

router.get(
  '/userID/:userID',
  validationRules([{ field: 'userID', type: 'int', location: 'params' }]),
  controller.getItemsByUserID
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

router.put(
  '/userID/:userID',
  validationRules([{ field: 'userID', type: 'int', location: 'params' }]),
  controller.updateItemsByUserID
)

// Update item by productID and importedID
router.patch('/:id', validationRules([{ field: 'id', type: 'int', location: 'params' }]), controller.updateItemByPk)

router.patch(
  '/userID/:userID',
  validationRules([{ field: 'userID', type: 'int', location: 'params' }]),
  controller.updateItemByUserID
)

// Delete item by productID
router.delete('/:id', validationRules([{ field: 'id', type: 'int', location: 'params' }]), controller.deleteItemByPk)

router.delete(
  '/userID/:userID',
  validationRules([{ field: 'userID', type: 'int', location: 'params' }]),
  controller.deleteItemByUserID
)

export default router
