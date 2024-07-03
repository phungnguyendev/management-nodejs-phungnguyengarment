import { getItemsQuery } from '~/helpers/query'
import GarmentAccessorySchema, { GarmentAccessory } from '~/models/garment-accessory.model'
import { ErrorType, RequestBodyType } from '~/type'

const NAMESPACE = 'services/garment-accessory'

export const createNewItem = async (item: GarmentAccessory) => {
  try {
    const newItem = await GarmentAccessorySchema.create(item)
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
    const itemFound = await GarmentAccessorySchema.findByPk(id)
    if (!itemFound) throw new Error(`Item not found`)
    return itemFound
  } catch (error: any) {
    throw {
      error: `Error get item`,
      errorDetail: `${error.message}`
    } as ErrorType
  }
}

export const getItemByProductID = async (productID: number) => {
  try {
    const itemFound = await GarmentAccessorySchema.findOne({ where: { productID } })
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
    const items = await GarmentAccessorySchema.findAndCountAll(getItemsQuery(body))
    return items
  } catch (error: any) {
    throw {
      error: `Error get list`,
      errorDetail: `${error.message}`
    } as ErrorType
  }
}

// Update
export const updateItemByPk = async (id: number, itemToUpdate: GarmentAccessory) => {
  try {
    const itemFound = await GarmentAccessorySchema.findByPk(id)
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

// Update
export const updateItemByProductID = async (productID: number, itemToUpdate: GarmentAccessory) => {
  try {
    const itemFound = await GarmentAccessorySchema.findOne({ where: { productID } })
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

export const updateItems = async (itemsUpdate: GarmentAccessory[]) => {
  try {
    const updatedItems = await Promise.all(
      itemsUpdate.map(async (item) => {
        const user = await GarmentAccessorySchema.findByPk(item.id)
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
    const itemFound = await GarmentAccessorySchema.findByPk(id)
    if (!itemFound) throw new Error(`Item not found`)
    await itemFound.destroy()
    return { message: 'Deleted successfully' }
  } catch (error: any) {
    throw {
      error: `Error delete item`,
      errorDetail: `${error.message}`
    } as ErrorType
  }
}

export const deleteItemByProductID = async (productID: number) => {
  try {
    const itemFound = await GarmentAccessorySchema.findOne({ where: { productID } })
    if (!itemFound) throw new Error(`Item not found`)
    await itemFound.destroy()
    return { message: 'Deleted successfully' }
  } catch (error: any) {
    throw {
      error: `Error delete item`,
      errorDetail: `${error.message}`
    } as ErrorType
  }
}
