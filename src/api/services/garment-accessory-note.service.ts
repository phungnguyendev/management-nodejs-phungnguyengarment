import { dynamicQuery } from '~/helpers/query'
import GarmentAccessoryNoteSchema, { GarmentAccessoryNote } from '~/models/garment-accessory-note.model'
import { RequestBodyType } from '~/type'
import AccessoryNoteSchema from '../models/accessory-note.model'
import GarmentAccessorySchema from '../models/garment-accessory.model'

const NAMESPACE = 'services/garment-accessory-note'

export const createNewItem = async (item: GarmentAccessoryNote) => {
  try {
    const itemFound = await GarmentAccessoryNoteSchema.findOne({
      where: {
        garmentAccessoryID: item.garmentAccessoryID,
        accessoryNoteID: item.accessoryNoteID
      }
    })

    if (itemFound) throw new Error(`Data already exist!`)
    const newItem = await GarmentAccessoryNoteSchema.create(item)
    const itemCreated = await GarmentAccessoryNoteSchema.findByPk(newItem.id, {
      include: [
        { model: GarmentAccessorySchema, as: 'garmentAccessory' },
        { model: AccessoryNoteSchema, as: 'accessoryNote' }
      ]
    })
    return itemCreated
  } catch (error: any) {
    throw `${error.message}`
  }
}

// Get by id
export const getItemByPk = async (id: number) => {
  try {
    const itemFound = await GarmentAccessoryNoteSchema.findByPk(id, {
      include: [
        { model: GarmentAccessorySchema, as: 'garmentAccessory' },
        { model: AccessoryNoteSchema, as: 'accessoryNote' }
      ]
    })
    if (!itemFound) throw new Error(`Item not found`)
    return itemFound
  } catch (error: any) {
    throw `${error.message}`
  }
}

export const getItemByGarmentAccessoryID = async (garmentAccessoryID: number) => {
  try {
    const itemFound = await GarmentAccessoryNoteSchema.findOne({
      where: { garmentAccessoryID },
      include: [
        { model: GarmentAccessorySchema, as: 'garmentAccessory' },
        { model: AccessoryNoteSchema, as: 'accessoryNote' }
      ]
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
    const items = await GarmentAccessoryNoteSchema.findAndCountAll({
      offset: (Number(body.paginator.page) - 1) * Number(body.paginator.pageSize),
      limit: body.paginator.pageSize === -1 ? undefined : body.paginator.pageSize,
      order: [[body.sorting.column, body.sorting.direction]],
      where: dynamicQuery<GarmentAccessoryNote>(body),
      include: [
        { model: GarmentAccessorySchema, as: 'garmentAccessory' },
        { model: AccessoryNoteSchema, as: 'accessoryNote' }
      ]
    })
    return items
  } catch (error: any) {
    throw `${error.message}`
  }
}

// Update
export const updateItemByPk = async (id: number, itemToUpdate: GarmentAccessoryNote) => {
  try {
    const itemFound = await GarmentAccessoryNoteSchema.findByPk(id)
    if (!itemFound) throw new Error(`Item not found`)
    await itemFound.update(itemToUpdate)
    const itemUpdated = await GarmentAccessoryNoteSchema.findByPk(itemFound.id, {
      include: [
        { model: GarmentAccessorySchema, as: 'garmentAccessory' },
        { model: AccessoryNoteSchema, as: 'accessoryNote' }
      ]
    })
    return itemUpdated
  } catch (error: any) {
    throw `${error.message}`
  }
}

export const updateItemByGarmentAccessoryID = async (
  garmentAccessoryID: number,
  itemToUpdate: GarmentAccessoryNote
) => {
  try {
    const itemFound = await GarmentAccessoryNoteSchema.findOne({ where: { garmentAccessoryID } })
    if (!itemFound) throw new Error(`Item not found`)
    await itemFound.update(itemToUpdate)
    const itemUpdated = await GarmentAccessoryNoteSchema.findOne({
      where: { garmentAccessoryID },
      include: [
        { model: GarmentAccessorySchema, as: 'garmentAccessory' },
        { model: AccessoryNoteSchema, as: 'accessoryNote' }
      ]
    })
    return itemUpdated
  } catch (error: any) {
    throw `${error.message}`
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

    if (recordsToAdd.length > 0) {
      // Thêm mới các bảng ghi mới
      await GarmentAccessoryNoteSchema.bulkCreate(
        recordsToAdd.map((item) => {
          return { ...item, status: 'active' } as GarmentAccessoryNote
        })
      )
    }

    if (recordsToDelete.length > 0) {
      // Xoá các bản ghi không còn trong danh sách
      await GarmentAccessoryNoteSchema.destroy({
        where: {
          accessoryNoteID: recordsToDelete.map((record) => record.accessoryNoteID),
          garmentAccessoryID: query.id
        }
      })
    }

    const itemsUpdated = await GarmentAccessoryNoteSchema.findAll({
      where: {
        [query.field]: query.id,
        status: 'active'
      },
      include: [
        { model: GarmentAccessorySchema, as: 'garmentAccessory' },
        { model: AccessoryNoteSchema, as: 'accessoryNote' }
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
    const itemFound = await GarmentAccessoryNoteSchema.findByPk(id)
    if (!itemFound) throw new Error(`Item not found`)
    await itemFound.destroy()
    return { message: 'Deleted successfully' }
  } catch (error: any) {
    throw `${error.message}`
  }
}

export const deleteItemByGarmentAccessoryID = async (garmentAccessoryID: number) => {
  try {
    const itemFound = await GarmentAccessoryNoteSchema.findOne({ where: { garmentAccessoryID } })
    if (!itemFound) throw new Error(`Item not found`)
    await itemFound.destroy()
    return { message: 'Deleted successfully' }
  } catch (error: any) {
    throw `${error.message}`
  }
}
