import { getItemsQuery } from '~/helpers/query'
import UserRoleSchema, { UserRole } from '~/models/user-role.model'
import { RequestBodyType } from '~/type'

const NAMESPACE = 'services/user-role'

export const createNewItem = async (item: UserRole) => {
  try {
    const newItem = await UserRoleSchema.create(item)
    return newItem
  } catch (error: any) {
    throw new Error(`Error creating item: ${error.message}`)
  }
}

// Get by id
export const getItemByPk = async (id: number) => {
  try {
    const itemFound = await UserRoleSchema.findByPk(id)
    if (!itemFound) throw new Error(`Item not found`)
    return itemFound
  } catch (error: any) {
    throw new Error(`Error getting item: ${error.message}`)
  }
}

// Get by id
export const getItemByUserID = async (userID: number) => {
  try {
    const itemsFound = await UserRoleSchema.findAll({ where: { userID } })
    if (!itemsFound) throw new Error(`Item not found`)
    return itemsFound
  } catch (error: any) {
    throw new Error(`Error getting item: ${error.message}`)
  }
}

// Get all
export const getItems = async (body: RequestBodyType) => {
  try {
    const items = await UserRoleSchema.findAndCountAll(getItemsQuery(body))
    return items
  } catch (error: any) {
    throw `Error getting list: ${error.message}`
  }
}

// Update
export const updateItemByPk = async (id: number, itemToUpdate: UserRole) => {
  try {
    const itemFound = await UserRoleSchema.findByPk(id)
    if (!itemFound) throw new Error(`Item not found`)
    await itemFound.update(itemToUpdate)
    return itemToUpdate
  } catch (error: any) {
    throw new Error(`Error updating item: ${error.message}`)
  }
}

export const updateItemByUserID = async (userID: number, itemToUpdate: UserRole) => {
  try {
    const itemFound = await UserRoleSchema.findOne({ where: { userID } })
    if (!itemFound) throw new Error(`Item not found`)
    await itemFound.update(itemToUpdate)
    return itemToUpdate
  } catch (error: any) {
    throw new Error(`Error updating item: ${error.message}`)
  }
}

export const updateItems = async (itemsUpdate: UserRole[]) => {
  try {
    const updatedItems = await Promise.all(
      itemsUpdate.map(async (item) => {
        const user = await UserRoleSchema.findByPk(item.id)
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
    const itemFound = await UserRoleSchema.findByPk(id)
    if (!itemFound) throw new Error(`Item not found`)
    await itemFound.destroy()
    return { message: 'Deleted successfully' }
  } catch (error: any) {
    throw new Error(`Error deleting item: ${error.message}`)
  }
}

// Delete
export const deleteItemByUserID = async (userID: number) => {
  try {
    const itemFound = await UserRoleSchema.findOne({ where: { userID } })
    if (!itemFound) throw new Error(`Item not found`)
    await itemFound.destroy()
    return { message: 'Deleted successfully' }
  } catch (error: any) {
    throw new Error(`Error deleting item: ${error.message}`)
  }
}
