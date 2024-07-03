import { getItemsQuery } from '~/helpers/query'
import ColorSchema, { Color } from '~/models/color.model'
import { ErrorType, RequestBodyType } from '~/type'

const NAMESPACE = 'services/color'

export const createNewItem = async (item: Color) => {
  try {
    const itemFound = await ColorSchema.findOne({ where: { name: item.name?.trim() } })
    if (itemFound) throw new Error(`Color exist!`)
    const newItem = await ColorSchema.create(item)
    return newItem
  } catch (error: any) {
    throw {
      error: `Error create item`,
      errorDetail: `${error.message}`
    } as ErrorType
  }
}

// Get by id
export const getItemByPk = async (id: number) => {
  try {
    const itemFound = await ColorSchema.findByPk(id)
    if (!itemFound) throw new Error(`Item not found`)
    return itemFound
  } catch (error: any) {
    throw {
      error: `Error get item`,
      errorDetail: `${error.message}`
    } as ErrorType
  }
}

// Get all
export const getItems = async (body: RequestBodyType) => {
  try {
    const items = await ColorSchema.findAndCountAll(getItemsQuery(body))
    return items
  } catch (error: any) {
    throw {
      error: `Error get list`,
      errorDetail: `${error.message}`
    } as ErrorType
  }
}

// Update
export const updateItemByPk = async (id: number, itemToUpdate: Color) => {
  try {
    const itemFound = await ColorSchema.findByPk(id)
    if (!itemFound) throw new Error(`Item not found`)
    await itemFound.update(itemToUpdate)
    return itemToUpdate
  } catch (error: any) {
    throw {
      error: `Error update item`,
      errorDetail: `${error.message}`
    } as ErrorType
  }
}

export const updateItems = async (itemsUpdate: Color[]) => {
  try {
    const updatedItems = await Promise.all(
      itemsUpdate.map(async (item) => {
        const user = await ColorSchema.findByPk(item.id)
        if (!user) {
          throw new Error(`Item with id ${item.id} not found`)
        }
        await user.update(item)
        return user
      })
    )
    return updatedItems
  } catch (error: any) {
    throw {
      error: `Error update multiple item`,
      errorDetail: `${error.message}`
    } as ErrorType
  }
}

// Delete
export const deleteItemByPk = async (id: number) => {
  try {
    const itemFound = await ColorSchema.findByPk(id)
    if (!itemFound) throw new Error(`Item not found`)
    await itemFound.destroy({ force: true })
    return { message: 'Deleted successfully!' }
  } catch (error: any) {
    throw {
      error: `Error delete item`,
      errorDetail: `${error.message}`
    } as ErrorType
  }
}
