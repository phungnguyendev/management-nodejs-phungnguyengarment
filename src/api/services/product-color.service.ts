import ProductColorSchema, { ProductColor } from '~/models/product-color.model'
import { ErrorType, RequestBodyType } from '~/type'
import { dynamicQuery } from '../helpers/query'
import ColorSchema from '../models/color.model'
import ProductSchema from '../models/product.model'

const NAMESPACE = 'services/product-color'

export const createNewItem = async (item: ProductColor) => {
  try {
    const itemFound = await ProductColorSchema.findOne({ where: { productID: item.productID } })
    if (itemFound) throw new Error(`Data already exist!`)
    const newItem = await ProductColorSchema.create(item)
    // Tìm lại model đầy đủ
    const createdItem = await ProductColorSchema.findByPk(newItem.id, {
      include: [{ model: ColorSchema, as: 'color' }]
    })
    return createdItem
  } catch (error: any) {
    throw `${error.message}`
  }
}

// Get by id
export const getItemByPk = async (id: number) => {
  try {
    const itemFound = await ProductColorSchema.findByPk(id, { include: [{ model: ColorSchema, as: 'color' }] })
    if (!itemFound) throw new Error(`Item not found`)
    return itemFound
  } catch (error: any) {
    throw `${error.message}`
  }
}

export const getItemByProductID = async (productID: number) => {
  try {
    const itemFound = await ProductColorSchema.findOne({
      where: { productID },
      include: [{ model: ColorSchema, as: 'color' }]
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
    const items = await ProductColorSchema.findAndCountAll({
      offset: (Number(body.paginator.page) - 1) * Number(body.paginator.pageSize),
      limit: body.paginator.pageSize === -1 ? undefined : body.paginator.pageSize,
      order: [[body.sorting.column, body.sorting.direction]],
      where: dynamicQuery<ProductColor>(body),
      include: [{ model: ColorSchema, as: 'color' }]
    })
    return items
  } catch (error: any) {
    throw `${error.message}`
  }
}

// Update
export const updateItemByPk = async (id: number, itemToUpdate: ProductColor) => {
  try {
    // Tìm theo ID
    const itemFound = await ProductColorSchema.findByPk(id)
    if (!itemFound) throw new Error(`Item not found`)
    // Cập nhật
    await itemFound.update(itemToUpdate)
    // Tìm lại model đầy đủ sau khi cập nhật
    const updatedItem = await ProductColorSchema.findByPk(id, {
      include: [{ model: ColorSchema, as: 'color' }]
    })
    return updatedItem
  } catch (error: any) {
    throw `${error.message}`
  }
}

// Update
export const updateItemByProductID = async (productID: number, itemToUpdate: ProductColor) => {
  try {
    const itemFound = await ProductColorSchema.findOne({ where: { productID } })
    if (!itemFound) throw new Error(`Item not found`)
    await itemFound.update(itemToUpdate)
    // Tìm lại model đầy đủ sau khi cập nhật
    const updatedItem = await ProductColorSchema.findOne({
      where: { productID },
      include: [{ model: ColorSchema, as: 'color' }]
    })
    return updatedItem
  } catch (error: any) {
    throw `${error.message}`
  }
}

export const updateItemsBy = async (query: { field: string; id: number }, recordsToUpdate: ProductColor[]) => {
  try {
    const existingRecords = await ProductColorSchema.findAll({
      where: { [query.field]: query.id },
      include: [{ model: ColorSchema, as: 'color' }]
    })

    const userFound = await ProductSchema.findByPk(query.id)

    // Tìm các bản ghi cần xoá
    const recordsToDelete = existingRecords.filter(
      (existingRecord) => !recordsToUpdate.some((item) => item.colorID === existingRecord.colorID)
    )

    // Tìm các bản ghi cần thêm mới
    const recordsToAdd = recordsToUpdate.filter(
      (recordToUpdate) => !existingRecords.some((existingRecord) => existingRecord.colorID === recordToUpdate.colorID)
    )

    // Xoá các bản ghi không còn trong danh sách
    await ProductColorSchema.destroy({
      where: {
        colorID: recordsToDelete.map((record) => record.colorID),
        productID: query.id
      }
    })

    // Thêm mới các bảng ghi mới
    const itemsCreated = await ProductColorSchema.bulkCreate(
      recordsToAdd.map((item) => {
        return { ...item, status: 'active' } as ProductColor
      })
    )
    const updatedList = [...existingRecords.filter((record) => !recordsToDelete.includes(record)), ...itemsCreated]
    return updatedList
  } catch (error: any) {
    throw `${error.message}`
  }
}

// Delete
export const deleteItemByPk = async (id: number) => {
  try {
    const itemFound = await ProductColorSchema.findByPk(id)
    if (!itemFound) throw new Error(`Item not found`)
    await itemFound.destroy()
    return { message: 'Deleted successfully' }
  } catch (error: any) {
    throw `${error.message}`
  }
}

export const deleteItemByProductID = async (productID: number) => {
  try {
    const itemFound = await ProductColorSchema.findOne({ where: { productID } })
    if (!itemFound) throw new Error(`Item not found`)
    await itemFound.destroy()
    return { message: 'Deleted successfully' }
  } catch (error: any) {
    throw `${error.message}`
  }
}
