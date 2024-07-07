import GarmentAccessorySchema, { GarmentAccessory } from '~/models/garment-accessory.model'
import { ErrorType, RequestBodyType } from '~/type'
import { dynamicQuery } from '../helpers/query'
import GarmentAccessoryNoteSchema from '../models/garment-accessory-note.model'
import ProductSchema from '../models/product.model'

const NAMESPACE = 'services/garment-accessory'

export const createNewItem = async (item: GarmentAccessory) => {
  try {
    const itemFound = await GarmentAccessorySchema.findOne({ where: { productID: item.productID } })
    if (itemFound) throw new Error(`Data already exist!`)
    const newItem = await GarmentAccessorySchema.create(item)
    const itemCreated = await GarmentAccessorySchema.findByPk(newItem.id, {
      include: [{ model: ProductSchema, as: 'product' }]
    })
    return itemCreated
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
    const itemFound = await GarmentAccessorySchema.findByPk(id, { include: [{ model: ProductSchema, as: 'product' }] })
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
    const itemFound = await GarmentAccessorySchema.findOne({
      where: { productID },
      include: [{ model: ProductSchema, as: 'product' }]
    })
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
    const items = await GarmentAccessorySchema.findAndCountAll({
      offset: (Number(body.paginator.page) - 1) * Number(body.paginator.pageSize),
      limit: body.paginator.pageSize === -1 ? undefined : body.paginator.pageSize,
      order: [[body.sorting.column, body.sorting.direction]],
      where: dynamicQuery<GarmentAccessory>(body),
      include: [{ model: ProductSchema, as: 'product' }]
    })
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
    const itemUpdated = await GarmentAccessorySchema.findByPk(id, {
      include: [{ model: ProductSchema, as  : 'product' }]
    })
    return itemUpdated
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
    const itemUpdated = await GarmentAccessorySchema.findOne({
      where: { productID },
      include: [{ model: ProductSchema, as: 'product' }]
    })
    return itemUpdated
  } catch (error: any) {
    throw {
      error: `Error update item`,
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
    // Xoá các ràng buộc trước
    const itemGarmentAccessoryNoteFound = await GarmentAccessoryNoteSchema.findAll({
      where: { garmentAccessoryID: itemFound.id }
    })
    if (!itemGarmentAccessoryNoteFound) throw new Error(`Item not found`)
    await GarmentAccessoryNoteSchema.destroy({
      where: {
        garmentAccessoryID: itemGarmentAccessoryNoteFound.map((item) => {
          return item.garmentAccessoryID
        })
      }
    })
    await itemFound.destroy()
    return { message: 'Deleted successfully' }
  } catch (error: any) {
    throw {
      error: `Error delete item`,
      errorDetail: `${error.message}`
    } as ErrorType
  }
}
