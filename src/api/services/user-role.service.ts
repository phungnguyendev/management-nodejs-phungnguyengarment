import { dynamicQuery } from '~/helpers/query'
import UserRoleSchema, { UserRole } from '~/models/user-role.model'
import { RequestBodyType } from '~/type'
import RoleSchema from '../models/role.model'
import UserSchema from '../models/user.model'

const NAMESPACE = 'services/user-role'

export const createNewItem = async (item: UserRole) => {
  try {
    const itemCreated = await UserRoleSchema.create(item)
    const adminFound = await RoleSchema.findOne({ where: { role: 'admin' } })
    if (adminFound) {
      if (itemCreated.roleID === adminFound.id) {
        await UserSchema.update({ isAdmin: true }, { where: { id: item.userID } }).then((result) => {
          return result
        })
      }
    }
    const itemFound = await UserRoleSchema.findByPk(itemCreated.id, {
      include: [{ model: RoleSchema, as: 'role' }]
    })
    return itemFound
  } catch (error: any) {
    throw `${error.message}`
  }
}

// Get by id
export const getItemByPk = async (id: number) => {
  try {
    const itemFound = await UserRoleSchema.findByPk(id, { include: [{ model: RoleSchema, as: 'role' }] })
    if (!itemFound) throw new Error(`Item not found`)
    return itemFound
  } catch (error: any) {
    throw `${error.message}`
  }
}

// Get by id
export const getItemByUserID = async (userID: number) => {
  try {
    const itemsFound = await UserRoleSchema.findAll({
      where: { userID },
      include: [{ model: RoleSchema, as: 'role' }]
    })
    if (!itemsFound) throw new Error(`Item not found`)
    return itemsFound
  } catch (error: any) {
    throw `${error.message}`
  }
}

// Get all
export const getItems = async (body: RequestBodyType) => {
  try {
    const items = await UserRoleSchema.findAndCountAll({
      offset: (Number(body.paginator.page) - 1) * Number(body.paginator.pageSize),
      limit: body.paginator.pageSize === -1 ? undefined : body.paginator.pageSize,
      order: [[body.sorting.column, body.sorting.direction]],
      where: dynamicQuery<UserRole>(body),
      include: [{ model: RoleSchema, as: 'role' }]
    })
    return items
  } catch (error: any) {
    throw `${error.message}`
  }
}

// Update
export const updateItemByPk = async (id: number, itemToUpdate: UserRole) => {
  try {
    const itemFound = await UserRoleSchema.findByPk(id)
    if (!itemFound) throw new Error(`Item not found`)
    await itemFound.update(itemToUpdate)
    const itemUpdated = await UserRoleSchema.findByPk(itemFound.id, { include: [{ model: RoleSchema, as: 'role' }] })
    return itemUpdated
  } catch (error: any) {
    throw `${error.message}`
  }
}

export const updateItemByUserID = async (userID: number, itemToUpdate: UserRole) => {
  try {
    const itemFound = await UserRoleSchema.findOne({ where: { userID } })
    if (!itemFound) throw new Error(`Item not found`)
    await itemFound.update(itemToUpdate)
    const itemUpdated = await UserRoleSchema.findByPk(itemFound.id, { include: [{ model: RoleSchema, as: 'role' }] })
    return itemUpdated
  } catch (error: any) {
    throw `${error.message}`
  }
}

export const updateItemsBy = async (query: { field: string; id: number }, recordsToUpdate: UserRole[]) => {
  try {
    // return updatedItems
    const existingRecords = await UserRoleSchema.findAll({
      where: { [query.field]: query.id }
    })

    // Tìm các bản ghi cần xoá
    const recordsToDelete = existingRecords.filter(
      (existingRecord) => !recordsToUpdate.some((item) => item.roleID === existingRecord.roleID)
    )

    // Tìm các bản ghi cần thêm mới
    const recordsToAdd = recordsToUpdate.filter(
      (recordToUpdate) => !existingRecords.some((existingRecord) => existingRecord.roleID === recordToUpdate.roleID)
    )

    // Xoá các bản ghi không còn trong danh sách
    await UserRoleSchema.destroy({
      where: {
        roleID: recordsToDelete.map((record) => record.roleID),
        userID: query.id
      }
    })

    // Cập nhật lại thuộc tính isAdmin của user nếu tìm thấy role = "admin"
    const adminRoleFound = await RoleSchema.findOne({ where: { role: 'admin' } })
    if (adminRoleFound && recordsToUpdate.some((item) => item.roleID === adminRoleFound.id)) {
      await UserSchema.update({ isAdmin: true }, { where: { id: query.id } })
    } else {
      await UserSchema.update({ isAdmin: false }, { where: { id: query.id } })
    }

    // Thêm mới các bảng ghi mới
    const itemsCreated = await UserRoleSchema.bulkCreate(
      recordsToAdd.map((item) => {
        return { ...item, status: 'active' } as UserRole
      })
    )

    // Lấy lại danh sách user đầy đủ
    const updatedUserRoles = await UserRoleSchema.findAll({
      where: { userID: query.id },
      include: [
        { model: RoleSchema, as: 'role' },
        { model: UserSchema, as: 'user' }
      ]
    })

    // Trả về danh sách cập nhật sau xử lý
    // const updatedList = [...existingRecords.filter((record) => !recordsToDelete.includes(record)), ...itemsCreated]
    return updatedUserRoles
  } catch (error: any) {
    throw `${error.message}`
  }
}

// Delete
export const deleteItemByPk = async (id: number) => {
  try {
    const itemFound = await UserRoleSchema.findByPk(id)
    if (!itemFound) throw new Error(`Item not found`)
    await itemFound.destroy()
    return { message: 'Deleted successfully' }
  } catch (error: any) {
    throw `${error.message}`
  }
}

// Delete
export const deleteItemByUserID = async (userID: number) => {
  try {
    const itemFound = await UserRoleSchema.findOne({ where: { userID } })
    if (!itemFound) throw new Error(`Item not found`)
    await itemFound.destroy()
    return { message: 'Deleted successfully' }
  } catch (error: any) {
    throw `${error.message}`
  }
}
