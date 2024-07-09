import appConfig from '~/config/app.config'
import { mailOptionToSendUserInfo, transporter } from '~/config/nodemailer.config'
import { getItemsQuery } from '~/helpers/query'
import UserSchema, { User } from '~/models/user.model'
import { RequestBodyType } from '~/type'
import TokenSchema from '../models/token.model'
import UserRoleSchema from '../models/user-role.model'

const NAMESPACE = 'services/user'

export const createNewItem = async (item: User) => {
  try {
    const userFound = await UserSchema.findOne({ where: { email: item.email } })
    if (userFound) throw new Error(`User already exists!`)
    const newUser = await UserSchema.create(item)
    await transporter.sendMail(mailOptionToSendUserInfo(newUser.email, newUser))
    return newUser
  } catch (error: any) {
    throw `${error.message}`
  }
}

// Get by id
export const getItemByPk = async (id: number) => {
  try {
    const itemFound = await UserSchema.findByPk(id)
    if (!itemFound) throw new Error(`Item not found`)
    delete itemFound.dataValues.password
    return itemFound.dataValues
  } catch (error: any) {
    throw `${error.message}`
  }
}

// Get all
export const getItems = async (body: RequestBodyType) => {
  try {
    const items = await UserSchema.findAndCountAll(getItemsQuery(body))
    return items
  } catch (error: any) {
    throw `${error.message}`
  }
}

// Update
export const updateItemByPk = async (id: number, itemToUpdate: User) => {
  try {
    const itemFound = await UserSchema.findByPk(id)
    if (!itemFound) throw new Error(`Item not found`)
    await itemFound.update(itemToUpdate)
    return itemToUpdate
  } catch (error: any) {
    throw `${error.message}`
  }
}

export const updateItems = async (itemsUpdate: User[]) => {
  try {
    const updatedItems = await Promise.all(
      itemsUpdate.map(async (item) => {
        const user = await UserSchema.findByPk(item.id)
        if (!user) {
          throw new Error(`Item with id ${item.id} not found`)
        }
        await user.update(item)
        return user
      })
    )
    return updatedItems
  } catch (error: any) {
    throw `${error.message}`
  }
}

// Delete
export const deleteItemByPk = async (id: number) => {
  try {
    const itemFound = await UserSchema.findByPk(id)
    if (!itemFound) throw new Error(`Item not found`)
    if (itemFound.email === appConfig.admin.mail.trim()) throw new Error(`The user is an admin, cannot be deleted!`)
    const tokenFound = await TokenSchema.findOne({ where: { userID: id } })
    const userRolesFound = await UserRoleSchema.findAll({ where: { userID: id } })
    if (tokenFound) {
      await tokenFound.destroy().catch(() => {
        throw new Error(`Error delete token`)
      })
    }
    await UserRoleSchema.destroy({ where: { roleID: userRolesFound.map((item) => item.roleID), userID: id } }).catch(
      () => {
        throw new Error(`Error delete user role`)
      }
    )
    await itemFound.destroy().catch(() => {
      throw new Error(`Error delete user`)
    })
    return { message: 'Deleted successfully' }
  } catch (error: any) {
    throw `${error.message}`
  }
}
