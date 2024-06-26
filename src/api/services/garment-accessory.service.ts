import GarmentAccessorySchema, { GarmentAccessory } from '~/models/garment-accessory.model'
import { ItemStatusType, RequestBodyType } from '~/type'
import logging from '~/utils/logging'
import { dynamicQuery } from '../helpers/query'
import ProductSchema from '../models/product.model'

const NAMESPACE = 'services/garment-accessory'

export const createNewItem = async (item: GarmentAccessory): Promise<GarmentAccessorySchema> => {
  try {
    return await GarmentAccessorySchema.create({
      ...item
    })
  } catch (error: any) {
    logging.error(NAMESPACE, `${error.message}`)
    throw new Error(`${NAMESPACE} ${error}`)
  }
}
export const createOrUpdateItemByPk = async (
  id: number,
  item: GarmentAccessory
): Promise<GarmentAccessory | GarmentAccessorySchema | undefined> => {
  try {
    const affectedRows = await GarmentAccessorySchema.update(
      {
        ...item
      },
      {
        where: {
          id: id
        }
      }
    )
    if (affectedRows[0] > 0) {
      return item
    } else {
      return await GarmentAccessorySchema.create({ ...item })
    }
  } catch (error: any) {
    logging.error(NAMESPACE, `Error createOrUpdateItemByPk :: ${error}`)
    throw new Error(`createOrUpdateItemByPk :: ${error}`)
  }
}
// Get by id
export const getItemByPk = async (id: number): Promise<GarmentAccessorySchema | null> => {
  try {
    const item = await GarmentAccessorySchema.findByPk(id, {
      include: [{ model: ProductSchema, as: 'product' }]
    })
    return item
  } catch (error: any) {
    logging.error(NAMESPACE, `${error.message}`)
    throw new Error(`${error.message}`)
  }
}

// Get by id
export const getItemBy = async (item: GarmentAccessory): Promise<GarmentAccessorySchema | null> => {
  try {
    const itemFound = await GarmentAccessorySchema.findOne({
      where: { ...item },
      include: [{ model: ProductSchema, as: 'product' }]
    })
    return itemFound
  } catch (error: any) {
    logging.error(NAMESPACE, `${error.message}`)
    throw new Error(`${NAMESPACE} ${error}`)
  }
}

// Get all
export const getItems = async (body: RequestBodyType): Promise<{ count: number; rows: GarmentAccessorySchema[] }> => {
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
    logging.error(NAMESPACE, `${error.message}`)
    throw new Error(`${NAMESPACE} ${error}`)
  }
}

export const getItemsWithStatus = async (status: ItemStatusType): Promise<GarmentAccessorySchema[]> => {
  try {
    const items = await GarmentAccessorySchema.findAll({
      where: {
        status: status
      },
      include: [{ model: ProductSchema, as: 'product' }]
    })
    return items
  } catch (error: any) {
    logging.error(NAMESPACE, `${error.message}`)
    throw new Error(`${error.message}`)
  }
}

export const getItemsCount = async (): Promise<number> => {
  try {
    return await ProductSchema.count()
  } catch (error: any) {
    logging.error(NAMESPACE, `${error.message}`)
    throw new Error(`${NAMESPACE} ${error}`)
  }
}

// Update
export const updateItemByPk = async (
  id: number,
  itemToUpdate: GarmentAccessory
): Promise<GarmentAccessory | undefined> => {
  try {
    const affectedRows = await GarmentAccessorySchema.update(
      {
        ...itemToUpdate
      },
      {
        where: {
          id: id
        }
      }
    )
    return affectedRows[0] > 0 ? itemToUpdate : undefined
  } catch (error: any) {
    logging.error(NAMESPACE, `Error updateItemByPk :: ${error}`)
    throw new Error(`updateItemByPk :: ${error}`)
  }
}

export const updateItemByProductID = async (
  productID: number,
  itemToUpdate: GarmentAccessory
): Promise<GarmentAccessory | undefined> => {
  try {
    const affectedRows = await GarmentAccessorySchema.update(
      {
        ...itemToUpdate
      },
      {
        where: {
          productID: productID
        }
      }
    )
    return affectedRows[0] > 0 ? itemToUpdate : undefined
  } catch (error: any) {
    logging.error(NAMESPACE, `Error updateItemByProductID :: ${error}`)
    throw new Error(`updateItemByProductID :: ${error}`)
  }
}

export const deleteItemBy = async (query: { field: string; id: number }): Promise<number> => {
  try {
    return await GarmentAccessorySchema.destroy({ where: { [query.field]: query.id } })
  } catch (error: any) {
    logging.error(NAMESPACE, `Error deleteItemBy :: ${error}`)
    throw new Error(`deleteItemBy :: ${error}`)
  }
}
