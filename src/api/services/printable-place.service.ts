import { dynamicQuery } from '~/helpers/query'
import PrintablePlaceSchema, { PrintablePlace } from '~/models/printable-place.model'
import { ErrorType, RequestBodyType } from '~/type'
import PrintSchema from '../models/print.model'

const NAMESPACE = 'services/printable-place'

export const createNewItem = async (item: PrintablePlace) => {
  try {
    const itemFound = await PrintablePlaceSchema.findOne({ where: { productID: item.productID } })
    if (itemFound) throw new Error(`Data already exist!`)
    const newItem = await PrintablePlaceSchema.create(item)
    const itemCreated = await PrintablePlaceSchema.findByPk(newItem.id, {
      include: [{ model: PrintSchema, as: 'print' }]
    })
    return itemCreated
  } catch (error: any) {
    throw `${error.message}`
  }
}

// Get by id
export const getItemByPk = async (id: number) => {
  try {
    const itemFound = await PrintablePlaceSchema.findByPk(id, { include: [{ model: PrintSchema, as: 'print' }] })
    if (!itemFound) throw new Error(`Item not found`)
    return itemFound
  } catch (error: any) {
    throw `${error.message}`
  }
}

export const getItemByProductID = async (productID: number) => {
  try {
    const itemFound = await PrintablePlaceSchema.findOne({
      where: { productID },
      include: [{ model: PrintSchema, as: 'print' }]
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
    const items = await PrintablePlaceSchema.findAndCountAll({
      offset: (Number(body.paginator.page) - 1) * Number(body.paginator.pageSize),
      limit: body.paginator.pageSize === -1 ? undefined : body.paginator.pageSize,
      order: [[body.sorting.column, body.sorting.direction]],
      where: dynamicQuery<PrintablePlace>(body),
      include: [{ model: PrintSchema, as: 'print' }]
    })
    return items
  } catch (error: any) {
    throw `${error.message}`
  }
}
// Update
export const updateItemByPk = async (id: number, itemToUpdate: PrintablePlace) => {
  try {
    const itemFound = await PrintablePlaceSchema.findByPk(id)
    if (!itemFound) throw new Error(`Item not found`)
    await itemFound.update(itemToUpdate)
    const itemUpdated = await PrintablePlaceSchema.findByPk(id, { include: [{ model: PrintSchema, as: 'print' }] })
    return itemUpdated
  } catch (error: any) {
    throw `${error.message}`
  }
}

// Update
export const updateItemByProductID = async (productID: number, itemToUpdate: PrintablePlace) => {
  try {
    const itemFound = await PrintablePlaceSchema.findOne({ where: { productID } })
    if (!itemFound) throw new Error(`Item not found`)
    await itemFound.update(itemToUpdate)
    const itemUpdated = await PrintablePlaceSchema.findOne({
      where: { productID },
      include: [{ model: PrintSchema, as: 'print' }]
    })
    return itemUpdated
  } catch (error: any) {
    throw `${error.message}`
  }
}

export const updateItems = async (itemsUpdate: PrintablePlace[]) => {
  try {
    const updatedItems = await Promise.all(
      itemsUpdate.map(async (item) => {
        const user = await PrintablePlaceSchema.findByPk(item.id, { include: [{ model: PrintSchema, as: 'print' }] })
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
    const itemFound = await PrintablePlaceSchema.findByPk(id)
    if (!itemFound) throw new Error(`Item not found`)
    await itemFound.destroy()
    return { message: 'Deleted successfully' }
  } catch (error: any) {
    throw `${error.message}`
  }
}

export const deleteItemByProductID = async (productID: number) => {
  try {
    const itemFound = await PrintablePlaceSchema.findOne({ where: { productID } })
    if (!itemFound) throw new Error(`Item not found`)
    await itemFound.destroy()
    return { message: 'Deleted successfully' }
  } catch (error: any) {
    throw `${error.message}`
  }
}
