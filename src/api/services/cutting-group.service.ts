import { dynamicQuery } from '~/helpers/query'
import CuttingGroupSchema, { CuttingGroup } from '~/models/cutting-group.model'
import { ErrorType, RequestBodyType } from '~/type'
import ProductSchema from '../models/product.model'

const NAMESPACE = 'services/cutting-group'

export const createNewItem = async (item: CuttingGroup) => {
  try {
    const foundItem = await CuttingGroupSchema.findOne({ where: { productID: item.productID } })
    if (foundItem) throw new Error(`Data already exist!`)
    const newItem = await CuttingGroupSchema.create(item)
    const createdItem = await CuttingGroupSchema.findByPk(newItem.id, {
      include: [{ model: ProductSchema, as: 'product' }]
    })
    return createdItem
  } catch (error: any) {
    throw `${error.message}`
  }
}

// Get by id
export const getItemByPk = async (id: number) => {
  try {
    const itemFound = await CuttingGroupSchema.findByPk(id, { include: [{ model: ProductSchema, as: 'product' }] })
    if (!itemFound) throw new Error(`Item not found`)
    return itemFound
  } catch (error: any) {
    throw `${error.message}`
  }
}

export const getItemByProductID = async (productID: number) => {
  try {
    const itemFound = await CuttingGroupSchema.findOne({
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
    const items = await CuttingGroupSchema.findAndCountAll({
      offset: (Number(body.paginator.page) - 1) * Number(body.paginator.pageSize),
      limit: body.paginator.pageSize === -1 ? undefined : body.paginator.pageSize,
      order: [[body.sorting.column, body.sorting.direction]],
      where: dynamicQuery<CuttingGroup>(body),
      include: [{ model: ProductSchema, as: 'product' }]
    })
    return items
  } catch (error: any) {
    throw `${error.message}`
  }
}

// Update
export const updateItemByPk = async (id: number, itemToUpdate: CuttingGroup) => {
  try {
    const itemFound = await CuttingGroupSchema.findByPk(id)
    if (!itemFound) throw new Error(`Item not found`)
    await itemFound.update(itemToUpdate)
    const updatedItem = await CuttingGroupSchema.findByPk(id, {
      include: [{ model: ProductSchema, as: 'product' }]
    })
    return updatedItem
  } catch (error: any) {
    throw `${error.message}`
  }
}

export const updateItemByProductID = async (productID: number, itemToUpdate: CuttingGroup) => {
  try {
    const itemFound = await CuttingGroupSchema.findOne({ where: { productID } })
    if (!itemFound) throw new Error(`Item not found`)
    await itemFound.update(itemToUpdate)
    const updatedItem = await CuttingGroupSchema.findOne({
      where: { productID },
      include: [{ model: ProductSchema, as: 'product' }]
    })
    return updatedItem
  } catch (error: any) {
    throw `${error.message}`
  }
}

// Delete
export const deleteItemByPk = async (id: number) => {
  try {
    const itemFound = await CuttingGroupSchema.findByPk(id)
    if (!itemFound) throw new Error(`Item not found`)
    await itemFound.destroy()
    return { message: 'Deleted successfully' }
  } catch (error: any) {
    throw `${error.message}`
  }
}

export const deleteItemByProductID = async (productID: number) => {
  try {
    const itemFound = await CuttingGroupSchema.findOne({ where: { productID } })
    if (!itemFound) throw new Error(`Item not found`)
    await itemFound.destroy()
    return { message: 'Deleted successfully' }
  } catch (error: any) {
    throw `${error.message}`
  }
}
