import { Router } from 'express'
import * as controller from '~/controllers/garment-accessory-note.controller'
import validationRules from '~/middleware/request-validator'

const router = Router()

router.post(
  '/',
  validationRules([
    { field: 'garmentAccessoryID', type: 'int', location: 'body' },
    { field: 'accessoryNoteID', type: 'int', location: 'body' }
  ]),
  controller.createNewItem
)

router.get(
  '/garmentAccessoryID/:garmentAccessoryID',
  validationRules([{ field: 'garmentAccessoryID', type: 'int', location: 'params' }]),
  controller.getItemByGarmentAccessoryID
)

// Get item by garmentAccessoryID and importedID
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

router.put(
  '/garmentAccessoryID/:garmentAccessoryID',
  validationRules([{ field: 'garmentAccessoryID', type: 'int', location: 'params' }]),
  controller.updateItemsByGarmentAccessoryID
)

// Update item by productID and importedID
router.patch('/:id', validationRules([{ field: 'id', type: 'int', location: 'params' }]), controller.updateItemByPk)

router.patch(
  '/garmentAccessoryID/:garmentAccessoryID',
  validationRules([{ field: 'garmentAccessoryID', type: 'int', location: 'params' }]),
  controller.updateItemByGarmentAccessoryID
)

// Delete item by productID
router.delete('/:id', validationRules([{ field: 'id', type: 'int', location: 'params' }]), controller.deleteItemByPk)

router.delete(
  '/garmentAccessoryID/:garmentAccessoryID',
  validationRules([{ field: 'garmentAccessoryID', type: 'int', location: 'params' }]),
  controller.deleteItemByGarmentAccessoryID
)

export default router
