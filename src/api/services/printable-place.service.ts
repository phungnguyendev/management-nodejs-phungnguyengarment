import { dynamicQuery } from '~/helpers/query'
import PrintablePlaceSchema, { PrintablePlace } from '~/models/printable-place.model'
import { RequestBodyType } from '~/type'
import PrintSchema from '../models/print.model'
import ProductSchema from '../models/product.model'

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

export const updateItemsBy = async (
  query: { field: string; id: number },
  updatedRecords: PrintablePlace[]
): Promise<PrintablePlace[] | undefined | any> => {
  try {
    const existingRecords = await PrintablePlaceSchema.findAll({
      where: {
        [query.field]: query.id
      }
    })

    // Tìm các bản ghi cần xoá
    const recordsToDelete = existingRecords.filter(
      (existingRecord) => !updatedRecords.some((updatedRecord) => updatedRecord.printID === existingRecord.printID)
    )

    // Tìm các bản ghi cần thêm mới
    const recordsToAdd = updatedRecords.filter(
      (updatedRecord) => !existingRecords.some((existingRecord) => existingRecord.printID === updatedRecord.printID)
    )

    if (recordsToAdd.length > 0) {
      // Thêm mới các bảng ghi mới
      await PrintablePlaceSchema.bulkCreate(
        recordsToAdd.map((item) => {
          return { ...item, status: 'active' } as PrintablePlace
        })
      )
    }

    if (recordsToDelete.length > 0) {
      // Xoá các bản ghi không còn trong danh sách
      await PrintablePlaceSchema.destroy({
        where: {
          printID: recordsToDelete.map((record) => record.printID),
          productID: query.id
        }
      })
    }

    const itemsUpdated = await PrintablePlaceSchema.findAll({
      where: {
        [query.field]: query.id,
        status: 'active'
      },
      include: [
        { model: ProductSchema, as: 'product' },
        { model: PrintSchema, as: 'print' }
      ]
    })
    // Trả về danh sách cập nhật sau xử lý
    // const updatedList = [...existingRecords.filter((record) => !recordsToDelete.includes(record), ...itemsCreated)]
    return itemsUpdated
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
    if (!itemFound) throw new Error(`PrintablePlace item not found`)
    await itemFound.destroy()
    return { message: 'Deleted successfully' }
  } catch (error: any) {
    throw `${error.message}`
  }
}
