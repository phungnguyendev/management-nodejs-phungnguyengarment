import { dynamicQuery } from '~/helpers/query'
import ProductGroupSchema, { ProductGroup } from '~/models/product-group.model'
import { ErrorType, RequestBodyType } from '~/type'
import GroupSchema from '../models/group.model'

const NAMESPACE = 'services/product-group'

export const createNewItem = async (item: ProductGroup) => {
  try {
    const itemFound = await ProductGroupSchema.findOne({ where: { productID: item.productID } })
    if (itemFound) throw new Error(`Data already exist!`)
    const newItem = await ProductGroupSchema.create(item)
    const itemCreated = await ProductGroupSchema.findByPk(newItem.id, {
      include: [{ model: GroupSchema, as: 'group' }]
    })
    return itemCreated
  } catch (error: any) {
    throw `${error.message}`
  }
}

// Get by id
export const getItemByPk = async (id: number) => {
  try {
    const itemFound = await ProductGroupSchema.findByPk(id, { include: [{ model: GroupSchema, as: 'group' }] })
    if (!itemFound) throw new Error(`Item not found`)
    return itemFound
  } catch (error: any) {
    throw `${error.message}`
  }
}

export const getItemByProductID = async (productID: number) => {
  try {
    const itemFound = await ProductGroupSchema.findOne({
      where: { productID },
      include: [{ model: GroupSchema, as: 'group' }]
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
    const items = await ProductGroupSchema.findAndCountAll({
      offset: (Number(body.paginator.page) - 1) * Number(body.paginator.pageSize),
      limit: body.paginator.pageSize === -1 ? undefined : body.paginator.pageSize,
      order: [[body.sorting.column, body.sorting.direction]],
      where: dynamicQuery<ProductGroup>(body),
      include: [{ model: GroupSchema, as: 'group' }]
    })
    return items
  } catch (error: any) {
    throw `${error.message}`
  }
}

// Update
export const updateItemByPk = async (id: number, itemToUpdate: ProductGroup) => {
  try {
    const itemFound = await ProductGroupSchema.findByPk(id)
    if (!itemFound) throw new Error(`Item not found`)
    await itemFound.update(itemToUpdate)
    const itemUpdated = await ProductGroupSchema.findByPk(id, { include: [{ model: GroupSchema, as: 'group' }] })
    return itemUpdated
  } catch (error: any) {
    throw `${error.message}`
  }
}

// Update
export const updateItemByProductID = async (productID: number, itemToUpdate: ProductGroup) => {
  try {
    const itemFound = await ProductGroupSchema.findOne({ where: { productID } })
    if (!itemFound) throw new Error(`Item not found`)
    await itemFound.update(itemToUpdate)
    const itemUpdated = await ProductGroupSchema.findOne({
      where: { productID },
      include: [{ model: GroupSchema, as: 'group' }]
    })
    return itemUpdated
  } catch (error: any) {
    throw `${error.message}`
  }
}

export const updateItems = async (itemsUpdate: ProductGroup[]) => {
  try {
    const updatedItems = await Promise.all(
      itemsUpdate.map(async (item) => {
        const user = await ProductGroupSchema.findByPk(item.id, { include: [{ model: GroupSchema, as: 'group' }] })
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
    const itemFound = await ProductGroupSchema.findByPk(id)
    if (!itemFound) throw new Error(`Item not found`)
    await itemFound.destroy()
    return { message: 'Deleted successfully' }
  } catch (error: any) {
    throw `${error.message}`
  }
}

export const deleteItemByProductID = async (productID: number) => {
  try {
    const itemFound = await ProductGroupSchema.findOne({ where: { productID } })
    if (!itemFound) throw new Error(`ProductGroup item not found`)
    await itemFound.destroy()
    return { message: 'Deleted successfully' }
  } catch (error: any) {
    throw `${error.message}`
  }
}
