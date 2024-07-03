import { dynamicQuery } from '~/helpers/query'
import GarmentAccessoryNoteSchema, { GarmentAccessoryNote } from '~/models/garment-accessory-note.model'
import { ErrorType, RequestBodyType } from '~/type'
import GarmentAccessorySchema from '../models/garment-accessory.model'
import logging from '../utils/logging'

const NAMESPACE = 'services/garment-accessory-note'

export const createNewItem = async (item: GarmentAccessoryNote) => {
  try {
    const newItem = await GarmentAccessoryNoteSchema.create(item)
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
    const itemFound = await GarmentAccessoryNoteSchema.findByPk(id)
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
    const itemFound = await GarmentAccessoryNoteSchema.findOne({ where: { productID } })
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
    const items = await GarmentAccessoryNoteSchema.findAndCountAll({
      offset: (Number(body.paginator.page) - 1) * Number(body.paginator.pageSize),
      limit: body.paginator.pageSize === -1 ? undefined : body.paginator.pageSize,
      order: [[body.sorting.column, body.sorting.direction]],
      where: dynamicQuery<GarmentAccessoryNote>(body),
      include: [{ model: GarmentAccessorySchema, as: 'garmentAccessory' }]
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
export const updateItemByPk = async (id: number, itemToUpdate: GarmentAccessoryNote) => {
  try {
    const itemFound = await GarmentAccessoryNoteSchema.findByPk(id)
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

export const updateItemByProductID = async (productID: number, itemToUpdate: GarmentAccessoryNote) => {
  try {
    const itemFound = await GarmentAccessoryNoteSchema.findOne({ where: { productID } })
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

export const updateItemsBy = async (
  query: { field: string; id: number },
  updatedRecords: GarmentAccessoryNote[]
): Promise<GarmentAccessoryNote[] | undefined | any> => {
  try {
    const existingRecords = await GarmentAccessoryNoteSchema.findAll({
      where: {
        [query.field]: query.id
      }
    })

    // Tìm các bản ghi cần xoá
    const recordsToDelete = existingRecords.filter(
      (existingRecord) =>
        !updatedRecords.some((updatedRecord) => updatedRecord.accessoryNoteID === existingRecord.accessoryNoteID)
    )

    // Tìm các bản ghi cần thêm mới
    const recordsToAdd = updatedRecords.filter(
      (updatedRecord) =>
        !existingRecords.some((existingRecord) => existingRecord.accessoryNoteID === updatedRecord.accessoryNoteID)
    )

    // Xoá các bản ghi không còn trong danh sách
    await GarmentAccessoryNoteSchema.destroy({
      where: {
        accessoryNoteID: recordsToDelete.map((record) => record.accessoryNoteID)
      }
    })

    // Thêm mới các bảng ghi mới
    await GarmentAccessoryNoteSchema.bulkCreate(recordsToAdd)

    // Trả về danh sách cập nhật sau xử lý
    const updatedList = [...existingRecords.filter((record) => recordsToDelete.includes(record), ...recordsToAdd)]
    return updatedList
  } catch (error: any) {
    logging.error(NAMESPACE, `${error.message}`)
    throw {
      error: `Error update multiple item`,
      errorDetail: `${error.message}`
    } as ErrorType
  }
}

// Delete
export const deleteItemByPk = async (id: number) => {
  try {
    const itemFound = await GarmentAccessoryNoteSchema.findByPk(id)
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
    const itemFound = await GarmentAccessoryNoteSchema.findOne({ where: { productID } })
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
