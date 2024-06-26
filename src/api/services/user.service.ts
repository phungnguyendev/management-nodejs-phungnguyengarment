import appConfig from '~/config/app.config'
import { mailOptionVerifyOTPCode, transporter } from '~/config/nodemailer.config'
import { getItemsQuery } from '~/helpers/query'
import UserSchema, { User } from '~/models/user.model'
import { RequestBodyType } from '~/type'
import TokenSchema from '../models/token.model'
import { otpGenerator } from '../utils'

const NAMESPACE = 'services/user'

export const createNewItem = async (item: User) => {
  try {
    const userFound = await UserSchema.findOne({ where: { email: item.email } })
    if (userFound) throw new Error(`User already exists!`)
    const newUser = await UserSchema.create(item)
    const otp = otpGenerator()
    await transporter.sendMail(mailOptionVerifyOTPCode(newUser.email, otp)).then(() => {
      newUser.update({ otp: otp })
    })
    return newUser
  } catch (error: any) {
    throw `Error creating item: ${error.message}`
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
    throw `Error getting item: ${error.message}`
  }
}

// Get all
export const getItems = async (body: RequestBodyType) => {
  try {
    const items = await UserSchema.findAndCountAll(getItemsQuery(body))
    return items
  } catch (error: any) {
    throw `Error getting list: ${error.message}`
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
    throw `Error updating item: ${error.message}`
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
    throw `Error updating multiple item: ${error.message}`
  }
}

// Delete
export const deleteItemByPk = async (id: number) => {
  try {
    const itemFound = await UserSchema.findByPk(id)
    if (!itemFound) throw new Error(`Item not found`)
    if (itemFound.email === appConfig.admin.mail.trim()) throw new Error(`The user is an admin, cannot be deleted!`)
    await TokenSchema.destroy({
      where: {
        userID: itemFound.id
      }
    }).then(async () => {
      await itemFound.destroy()
    })
    return { message: 'Deleted successfully' }
  } catch (error: any) {
    throw `Error deleting item: ${error.message}`
  }
}
