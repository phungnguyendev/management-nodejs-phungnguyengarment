import { Sequelize } from 'sequelize-typescript'
import databaseConfig from '~/config/database.config'
import logging from '~/utils/logging'
import AccessoryNoteSchema from './accessory-note.model'
import ColorSchema from './color.model'
import CompletionSchema from './completion.model'
import CuttingGroupSchema from './cutting-group.model'
import GarmentAccessoryNoteSchema from './garment-accessory-note.model'
import GarmentAccessorySchema from './garment-accessory.model'
import GroupSchema from './group.model'
import ImportationSchema from './importation.model'
import PrintSchema from './print.model'
import PrintablePlaceSchema from './printable-place.model'
import ProductColorSchema from './product-color.model'
import ProductGroupSchema from './product-group.model'
import ProductSchema from './product.model'
import RoleSchema from './role.model'
import SampleSewingSchema from './sample-sewing.model'
import SewingLineDeliverySchema from './sewing-line-delivery.model'
import SewingLineSchema from './sewing-line.model'
import UserRoleSchema from './user-role.model'
import UserSchema from './user.model'

const PATH = 'model/index'

const sequelize = new Sequelize(databaseConfig)

sequelize?.addModels([
  UserSchema,
  RoleSchema,
  UserRoleSchema,
  ColorSchema,
  GroupSchema,
  PrintSchema,
  ProductSchema,
  SewingLineSchema,
  ImportationSchema,
  SampleSewingSchema,
  ProductColorSchema,
  ProductGroupSchema,
  AccessoryNoteSchema,
  PrintablePlaceSchema,
  GarmentAccessorySchema,
  GarmentAccessoryNoteSchema,
  SewingLineDeliverySchema,
  CuttingGroupSchema,
  CompletionSchema
])

sequelize
  .authenticate()
  .then(async () => {
    // Check admin exist
    const userExist = await UserSchema.count()
    logging.info(PATH, 'Connection has been established successfully. 🥳🎉')
  })
  .catch((error) => logging.error(PATH, `Unable to connect to the database: ${error}`))

export default sequelize
