import { getItemsQuery } from '~/helpers/query'
import GroupSchema, { Group } from '~/models/group.model'
import { RequestBodyType } from '~/type'

const NAMESPACE = 'services/group'

export const createNewItem = async (item: Group) => {
  try {
    const newItem = await GroupSchema.create(item)
    return newItem
  } catch (error: any) {
    throw new Error(`Error creating item: ${error.message}`)
  }
}

// Get by id
export const getItemByPk = async (id: number) => {
  try {
    const itemFound = await GroupSchema.findByPk(id)
    if (!itemFound) throw new Error(`Item not found`)
    return itemFound
  } catch (error: any) {
    throw new Error(`Error getting item: ${error.message}`)
  }
}

// Get all
export const getItems = async (body: RequestBodyType) => {
  try {
    const items = await GroupSchema.findAndCountAll(getItemsQuery(body))
    return items
  } catch (error: any) {
    throw `Error getting list: ${error.message}`
  }
}

// Update
export const updateItemByPk = async (id: number, itemToUpdate: Group) => {
  try {
    const itemFound = await GroupSchema.findByPk(id)
    if (!itemFound) throw new Error(`Item not found`)
    await itemFound.update(itemToUpdate)
    return itemToUpdate
  } catch (error: any) {
    throw new Error(`Error updating item: ${error.message}`)
  }
}

export const updateItems = async (itemsUpdate: Group[]) => {
  try {
    const updatedItems = await Promise.all(
      itemsUpdate.map(async (item) => {
        const user = await GroupSchema.findByPk(item.id)
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
    const itemFound = await GroupSchema.findByPk(id)
    if (!itemFound) throw new Error(`Item not found`)
    await itemFound.destroy()
    return { message: 'Deleted successfully' }
  } catch (error: any) {
    throw new Error(`Error deleting item: ${error.message}`)
  }
}
