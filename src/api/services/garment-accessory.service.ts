import GarmentAccessorySchema, { GarmentAccessory } from '~/models/garment-accessory.model'
import { RequestBodyType } from '~/type'
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
    throw `${error.message}`
  }
}

// Get by id
export const getItemByPk = async (id: number) => {
  try {
    const itemFound = await GarmentAccessorySchema.findByPk(id, { include: [{ model: ProductSchema, as: 'product' }] })
    if (!itemFound) throw new Error(`Item not found`)
    return itemFound
  } catch (error: any) {
    throw `${error.message}`
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
    throw `${error.message}`
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
    throw `${error.message}`
  }
}

// Update
export const updateItemByPk = async (id: number, itemToUpdate: GarmentAccessory) => {
  try {
    const itemFound = await GarmentAccessorySchema.findByPk(id)
    if (!itemFound) throw new Error(`Item not found`)
    await itemFound.update(itemToUpdate)
    const itemUpdated = await GarmentAccessorySchema.findByPk(id, {
      include: [{ model: ProductSchema, as: 'product' }]
    })
    return itemUpdated
  } catch (error: any) {
    throw `${error.message}`
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
    throw `${error.message}`
  }
}

// Delete
export const deleteItemByPk = async (id: number) => {
  try {
    const itemFound = await GarmentAccessorySchema.findByPk(id)
    if (!itemFound) throw new Error(`Item not found`)
    const garmentAccessoryNotes = await GarmentAccessoryNoteSchema.findAll({
      where: { garmentAccessoryID: itemFound.id }
    })
    if (garmentAccessoryNotes.length > 0) {
      await Promise.all(
        garmentAccessoryNotes.map((item) =>
          GarmentAccessoryNoteSchema.destroy({
            where: { id: item.id, garmentAccessoryID: id }
          })
        )
      )
    }
    await itemFound.destroy()
    return { message: 'Deleted successfully' }
  } catch (error: any) {
    throw `${error.message}`
  }
}

export const deleteItemByProductID = async (productID: number) => {
  try {
    const itemFound = await GarmentAccessorySchema.findOne({ where: { productID } })
    if (!itemFound) throw new Error(`Item not found`)
    // Xoá các ràng buộc trước
    const garmentAccessoryNotes = await GarmentAccessoryNoteSchema.findAll({
      where: { garmentAccessoryID: itemFound.id }
    })
    if (garmentAccessoryNotes.length > 0) {
      await Promise.all(
        garmentAccessoryNotes.map((item) =>
          GarmentAccessoryNoteSchema.destroy({
            where: { id: item.id, garmentAccessoryID: itemFound.id }
          })
        )
      )
    }
    await itemFound.destroy()
    return { message: 'Deleted successfully' }
  } catch (error: any) {
    throw `${error.message}`
  }
}
