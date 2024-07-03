import { Router } from 'express'
import accessoryNoteRoute from '~/routes/accessory-note.route'
import authRoute from '~/routes/auth/auth.route'
import colorRoute from '~/routes/color.route'
import completionRoute from '~/routes/completion.route'
import cuttingGroupRoute from '~/routes/cutting-group.route'
import garmentAccessoryNoteRoute from '~/routes/garment-accessory-note.route'
import garmentAccessoryRoute from '~/routes/garment-accessory.route'
import groupRoute from '~/routes/group.route'
import importationRoute from '~/routes/importation.route'
import printRoute from '~/routes/print.route'
import printablePlaceRoute from '~/routes/printable-place.route'
import productColorRoute from '~/routes/product-color.route'
import productGroupRoute from '~/routes/product-group.route'
import productRoute from '~/routes/product.route'
import roleRoute from '~/routes/role.route'
import sampleSewingRoute from '~/routes/sample-sewing.route'
import sewingLineDeliveryRoute from '~/routes/sewing-line-delivery.route'
import sewingLineRoute from '~/routes/sewing-line.route'
import userRoleRoute from '~/routes/user-role.route'
import userRoute from '~/routes/user.route'

const router = Router()

router.use('/auth', authRoute)
router.use('/users', userRoute)
router.use('/roles', roleRoute)
router.use('/user-roles', userRoleRoute)
router.use('/colors', colorRoute)
router.use('/groups', groupRoute)
router.use('/prints', printRoute)
router.use('/products', productRoute)
router.use('/sample-sewings', sampleSewingRoute)
router.use('/sewing-lines', sewingLineRoute)
router.use('/importations', importationRoute)
router.use('/product-groups', productGroupRoute)
router.use('/product-colors', productColorRoute)
router.use('/accessory-notes', accessoryNoteRoute)
router.use('/printable-places', printablePlaceRoute)
router.use('/garment-accessories', garmentAccessoryRoute)
router.use('/sewing-line-deliveries', sewingLineDeliveryRoute)
router.use('/garment-accessory-notes', garmentAccessoryNoteRoute)
router.use('/cutting-groups', cuttingGroupRoute)
router.use('/completions', completionRoute)

export default router
