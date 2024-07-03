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
    const itemFound = await ProductGroupSchema.findByPk(id, { include: [{ model: GroupSchema, as: 'group' }] })
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
    const itemFound = await ProductGroupSchema.findOne({
      where: { productID },
      include: [{ model: GroupSchema, as: 'group' }]
    })
    if (!itemFound) throw new Error(`Item not found`)
    return itemFound
  } catch (error: any) {
    throw {
      error: `Error get item by`,
      errorDetail: `${error.message}`
    } as ErrorType
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
    {
      throw {
        error: `Error get list`,
        errorDetail: `${error.message}`
      } as ErrorType
    }
  }
}

// Update
export const updateItemByPk = async (id: number, itemToUpdate: ProductGroup) => {
  try {
    const itemFound = await ProductGroupSchema.findByPk(id)
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
export const updateItemByProductID = async (productID: number, itemToUpdate: ProductGroup) => {
  try {
    const itemFound = await ProductGroupSchema.findOne({ where: { productID } })
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

export const updateItems = async (itemsUpdate: ProductGroup[]) => {
  try {
    const updatedItems = await Promise.all(
      itemsUpdate.map(async (item) => {
        const user = await ProductGroupSchema.findByPk(item.id)
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
    const itemFound = await ProductGroupSchema.findByPk(id)
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
    const itemFound = await ProductGroupSchema.findOne({ where: { productID } })
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
