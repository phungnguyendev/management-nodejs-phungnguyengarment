import { Router } from 'express'
import * as controller from '~/controllers/cutting-group.controller'
import validationRules from '~/middleware/request-validator'

const router = Router()

router.post(
  '/',
  validationRules([
    { field: 'productID', type: 'int', location: 'body' }
    // { field: 'quantityRealCut', type: 'int', location: 'body' },
    // { field: 'dateTimeCut', type: 'date', location: 'body' },
    // { field: 'dateSendEmbroidered', type: 'date', location: 'body' },
    // { field: 'quantityDeliveredBTP', type: 'date', location: 'body' },
    // { field: 'syncStatus', type: 'boolean', location: 'body' }
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
