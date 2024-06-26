import { Router } from 'express'
import * as controller from '~/controllers/sample-sewing.controller'
import validationRules from '~/middleware/request-validator'

const router = Router()

router.post(
  '/',
  validationRules([
    { field: 'productID', type: 'int', location: 'body' },
    { field: 'dateSubmissionNPL', type: 'int', location: 'body' },
    { field: 'dateApprovalPP', type: 'date', location: 'body' },
    { field: 'dateSubmissionFirstTime', type: 'date', location: 'body' },
    { field: 'dateSubmissionSecondTime', type: 'date', location: 'body' },
    { field: 'dateSubmissionThirdTime', type: 'date', location: 'body' },
    { field: 'dateSubmissionForthTime', type: 'date', location: 'body' },
    { field: 'dateSubmissionFifthTime', type: 'date', location: 'body' }
  ]),
  controller.createNewItem
)

// Get item by productID and importedID
router.get('/:id', validationRules([{ field: 'id', type: 'int', location: 'params' }]), controller.getItemByPk)

router.get(
  '/productID/:productID',
  validationRules([{ field: 'productID', type: 'int', location: 'params' }]),
  controller.getItemByProductID
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

router.put('/', controller.updateItems)

// Update item by productID and importedID
router.patch('/:id', validationRules([{ field: 'id', type: 'int', location: 'params' }]), controller.updateItemByPk)

router.patch(
  '/productID/:productID',
  validationRules([{ field: 'productID', type: 'int', location: 'params' }]),
  controller.updateItemByProductID
)

// Delete item by productID
router.delete('/:id', validationRules([{ field: 'id', type: 'int', location: 'params' }]), controller.deleteItemByPk)

router.delete(
  'productID/:productID',
  validationRules([{ field: 'productID', type: 'int', location: 'params' }]),
  controller.deleteItemByProductID
)

export default router
