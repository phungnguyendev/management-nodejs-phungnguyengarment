import { Sequelize } from 'sequelize-typescript'
import appConfig from '~/config/app.config'
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
import TokenSchema from './token.model'
import UserRoleSchema from './user-role.model'
import UserSchema from './user.model'

const PATH = 'model/index'

const sequelize = new Sequelize(databaseConfig)

sequelize?.addModels([
  UserSchema,
  TokenSchema,
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
    createRoleIfNotExist()
    createAdminIfNotExist()
    logging.info(PATH, 'Connection has been established successfully. 🥳🎉')
  })
  .catch((error) => logging.error(PATH, `Unable to connect to the database: ${error}`))

const createAdminIfNotExist = async () => {
  try {
    const admin = await UserSchema.findOne({ where: { email: appConfig.admin.mail } })
    if (!admin) {
      await UserSchema.create({
        email: appConfig.admin.mail,
        password: appConfig.admin.password,
        fullName: appConfig.admin.full_name,
        phone: appConfig.admin.phone,
        avatar: appConfig.admin.avatar,
        workDescription: 'Administrators',
        status: 'active',
        isAdmin: true
      }).then(async () => {
        await UserRoleSchema.create({ userID: 1, roleID: 1, status: 'active' }).then(() => {
          logging.info(PATH, 'User admin has been created. ✅')
        })
      })
    }
  } catch (error: any) {
    logging.error(PATH, `Error creating user admin: ${error.message}`)
  }
}

const createRoleIfNotExist = async () => {
  try {
    const roles = await RoleSchema.findAll()
    if (roles.length <= 0) {
      await RoleSchema.bulkCreate([
        {
          id: 1,
          role: 'admin',
          shortName: 'Administrators',
          desc: 'Quản trị viên',
          status: 'active'
        },
        {
          id: 2,
          role: 'product_manager',
          shortName: 'Product Manager',
          desc: 'Quản lý sản phẩm',
          status: 'active'
        },
        {
          id: 3,
          role: 'importation_manager',
          shortName: 'Importation Manager',
          desc: 'Quản lý xuất nhập khấu',
          status: 'active'
        },
        {
          id: 4,
          role: 'sample_sewing_manager',
          shortName: 'Sample Sewing Manager',
          desc: 'Quản lý may mẫu',
          status: 'active'
        },
        {
          id: 5,
          role: 'accessory_manager',
          shortName: 'Accessory Manager',
          desc: 'Quản lý kho phụ liệu',
          status: 'active'
        },
        {
          id: 6,
          role: 'cutting_group_manager',
          shortName: 'Cutting Group Manager',
          desc: 'Quản lý tổ cắt',
          status: 'active'
        },
        {
          id: 7,
          role: 'completion_manager',
          shortName: 'Completion Manager',
          desc: 'Quản lý kho hoàn thành',
          status: 'active'
        },
        {
          id: 8,
          role: 'sewing_line_manager',
          shortName: 'Sewing Line Manager',
          desc: 'Quản lý chuyền may',
          status: 'active'
        },
        {
          id: 9,
          role: 'staff',
          shortName: 'Staff',
          desc: 'Nhân viên',
          status: 'active'
        }
      ]).then(() => {
        logging.info(PATH, 'User role has been created. ✅')
      })
    }
  } catch (error: any) {
    logging.error(PATH, `Error creating user roles: ${error.message}`)
  }
}

export default sequelize
