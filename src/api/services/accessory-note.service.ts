import { getItemsQuery } from '~/helpers/query'
import AccessoryNoteSchema, { AccessoryNote } from '~/models/accessory-note.model'
import { ErrorType, RequestBodyType } from '~/type'

const NAMESPACE = 'services/accessory-note'

export const createNewItem = async (item: AccessoryNote) => {
  try {
    const newItem = await AccessoryNoteSchema.create(item)
    return newItem
  } catch (error: any) {
    throw `${error.message}`
  }
}

// Get by id
export const getItemByPk = async (id: number) => {
  try {
    const itemFound = await AccessoryNoteSchema.findByPk(id)
    if (!itemFound) throw new Error(`Item not found`)
    return itemFound
  } catch (error: any) {
    throw `${error.message}`
  }
}

// Get all
export const getItems = async (body: RequestBodyType) => {
  try {
    const items = await AccessoryNoteSchema.findAndCountAll(getItemsQuery(body))
    return items
  } catch (error: any) {
    throw `${error.message}`
  }
}

// Update
export const updateItemByPk = async (id: number, itemToUpdate: AccessoryNote) => {
  try {
    const itemFound = await AccessoryNoteSchema.findByPk(id)
    if (!itemFound) throw new Error(`Item not found`)
    await itemFound.update(itemToUpdate)
    return itemToUpdate
  } catch (error: any) {
    throw `${error.message}`
  }
}

export const updateItems = async (itemsUpdate: AccessoryNote[]) => {
  try {
    const updatedItems = await Promise.all(
      itemsUpdate.map(async (item) => {
        const user = await AccessoryNoteSchema.findByPk(item.id)
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
    const itemFound = await AccessoryNoteSchema.findByPk(id)
    if (!itemFound) throw new Error(`Item not found`)
    await itemFound.destroy()
    return { message: 'Deleted successfully' }
  } catch (error: any) {
    throw `${error.message}`
  }
}
