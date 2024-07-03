import { dynamicQuery } from '~/helpers/query'
import SewingLineDeliverySchema, { SewingLineDelivery } from '~/models/sewing-line-delivery.model'
import { ErrorType, RequestBodyType } from '~/type'
import SewingLineSchema from '../models/sewing-line.model'

const NAMESPACE = 'services/sewing-line-delivery'

export const createNewItem = async (item: SewingLineDelivery) => {
  try {
    const newItem = await SewingLineDeliverySchema.create(item)
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
    const itemFound = await SewingLineDeliverySchema.findByPk(id)
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
    const itemFound = await SewingLineDeliverySchema.findOne({ where: { productID } })
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
    const items = await SewingLineDeliverySchema.findAndCountAll({
      offset: (Number(body.paginator.page) - 1) * Number(body.paginator.pageSize),
      limit: body.paginator.pageSize === -1 ? undefined : body.paginator.pageSize,
      order: [[body.sorting.column, body.sorting.direction]],
      where: dynamicQuery<SewingLineDelivery>(body),
      include: [{ model: SewingLineSchema, as: 'sewingLine' }]
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
export const updateItemByPk = async (id: number, itemToUpdate: SewingLineDelivery) => {
  try {
    const itemFound = await SewingLineDeliverySchema.findByPk(id)
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
export const updateItemByProductID = async (productID: number, itemToUpdate: SewingLineDelivery) => {
  try {
    const itemFound = await SewingLineDeliverySchema.findOne({ where: { productID } })
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

export const updateItemsBy = async (query: { field: string; id: number }, itemsUpdate: SewingLineDelivery[]) => {
  try {
    // return updatedItems
    const existingRecords = await SewingLineDeliverySchema.findAll({ where: { [query.field]: query.id } })

    // Tìm các bản ghi cần xoá
    const recordsToDelete = existingRecords.filter(
      (existingRecord) =>
        !itemsUpdate.some((updatedRecord) => updatedRecord.sewingLineID === existingRecord.sewingLineID)
    )

    // Tìm các bản ghi cần thêm mới
    const recordsToAdd = itemsUpdate.filter(
      (updatedRecord) =>
        !existingRecords.some((existingRecord) => existingRecord.sewingLineID === updatedRecord.sewingLineID)
    )

    // Xoá các bản ghi không còn trong danh sách
    await SewingLineDeliverySchema.destroy({
      where: {
        sewingLineID: recordsToDelete.map((record) => record.sewingLineID)
      }
    })

    // Thêm mới các bảng ghi mới
    const itemsCreated = await SewingLineDeliverySchema.bulkCreate(
      recordsToAdd.map((item) => {
        return { ...item, status: 'active' } as SewingLineDelivery
      })
    )

    // Trả về danh sách cập nhật sau xử lý
    const updatedList = [...existingRecords.filter((record) => !recordsToDelete.includes(record)), ...itemsCreated]
    return updatedList
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
    const itemFound = await SewingLineDeliverySchema.findByPk(id)
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
    const itemFound = await SewingLineDeliverySchema.findOne({ where: { productID } })
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
