import { dynamicQuery } from '~/helpers/query'
import SewingLineDeliverySchema, { SewingLineDelivery } from '~/models/sewing-line-delivery.model'
import { ErrorType, RequestBodyType } from '~/type'
import sequelize from '../models'
import ProductSchema from '../models/product.model'
import SewingLineSchema from '../models/sewing-line.model'

const NAMESPACE = 'services/sewing-line-delivery'

export const createNewItem = async (item: SewingLineDelivery) => {
  try {
    const foundItem = await SewingLineDeliverySchema.findOne({ where: { productID: item.productID } })
    if (foundItem) throw new Error(`Data already exist!`)
    const newItem = await SewingLineDeliverySchema.create(item)
    const createdItem = await SewingLineDeliverySchema.findByPk(newItem.id, {
      include: [
        { model: SewingLineSchema, as: 'sewingLine' },
        { model: ProductSchema, as: 'product' }
      ]
    })
    return createdItem
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
    const itemFound = await SewingLineDeliverySchema.findByPk(id, {
      include: [
        { model: SewingLineSchema, as: 'sewingLine' },
        { model: ProductSchema, as: 'product' }
      ]
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

export const getItemByProductID = async (productID: number) => {
  try {
    const itemFound = await SewingLineDeliverySchema.findOne({
      where: { productID },
      include: [
        { model: SewingLineSchema, as: 'sewingLine' },
        { model: ProductSchema, as: 'product' }
      ]
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
    const items = await SewingLineDeliverySchema.findAndCountAll({
      offset: (Number(body.paginator.page) - 1) * Number(body.paginator.pageSize),
      limit: body.paginator.pageSize === -1 ? undefined : body.paginator.pageSize,
      order: [[body.sorting.column, body.sorting.direction]],
      where: dynamicQuery<SewingLineDelivery>(body),
      include: [
        { model: SewingLineSchema, as: 'sewingLine' },
        { model: ProductSchema, as: 'product' }
      ]
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
    const updatedItem = await SewingLineDeliverySchema.findByPk(itemFound.id, {
      include: [
        { model: SewingLineSchema, as: 'sewingLine' },
        { model: ProductSchema, as: 'product' }
      ]
    })
    return updatedItem
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
    const updatedItem = await SewingLineDeliverySchema.findOne({
      where: { productID },
      include: [
        { model: SewingLineSchema, as: 'sewingLine' },
        { model: ProductSchema, as: 'product' }
      ]
    })
    return updatedItem
  } catch (error: any) {
    throw {
      error: `Error update item`,
      errorDetail: `${error.message}`
    } as ErrorType
  }
}

export const updateItemsBy = async (query: { field: string; id: number }, itemsUpdate: SewingLineDelivery[]) => {
  const transaction = await sequelize.transaction()
  try {
    // return updatedItems
    const existingRecords = await SewingLineDeliverySchema.findAll({ where: { [query.field]: query.id }, transaction })

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

    if (recordsToAdd.length > 0) {
      // Thêm mới các bảng ghi mới
      await SewingLineDeliverySchema.bulkCreate(
        recordsToAdd.map((item) => {
          return { ...item, status: 'active' } as SewingLineDelivery
        }),
        { transaction }
      )
    }

    if (recordsToDelete.length > 0) {
      // Xoá các bản ghi không còn trong danh sách
      await SewingLineDeliverySchema.destroy({
        where: {
          sewingLineID: recordsToDelete.map((record) => record.sewingLineID),
          productID: query.id
        },
        transaction
      })
    }

    if (recordsToAdd.length <= 0 && recordsToDelete.length <= 0) {
      // Xoá các bản ghi không còn trong danh sách
      await Promise.all(
        itemsUpdate.map((item) =>
          SewingLineDeliverySchema.update(item, {
            where: { sewingLineID: item.sewingLineID, productID: query.id },
            transaction
          })
        )
      )
    }

    const itemsUpdated = await SewingLineDeliverySchema.findAll({
      where: {
        [query.field]: query.id,
        status: 'active'
      },
      include: [
        { model: SewingLineSchema, as: 'sewingLine' },
        { model: ProductSchema, as: 'product' }
      ],
      transaction
    })

    await transaction.commit()

    // Trả về danh sách cập nhật sau xử lý
    // const updatedList = [...existingRecords.filter((record) => !recordsToDelete.includes(record)), ...itemsCreated]
    return itemsUpdated
  } catch (error: any) {
    // Rollback giao dịch nếu có lỗi
    await transaction.rollback()

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
