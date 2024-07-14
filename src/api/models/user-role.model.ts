import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { ItemStatusType } from '~/type'
import RoleSchema from './role.model'
import UserSchema from './user.model'

const { INTEGER, STRING } = DataType

export interface UserRole {
  id?: number
  roleID?: number
  userID?: number
  status?: ItemStatusType
}

@Table({
  modelName: 'UserRole',
  tableName: 'user-roles',
  timestamps: true
})
export default class UserRoleSchema extends Model<UserRole> {
  @Column({ type: INTEGER, primaryKey: true, autoIncrement: true, field: 'id' })
  declare id: number

  @Column({ type: INTEGER, field: 'user_id' })
  @ForeignKey(() => UserSchema)
  declare userID: number

  @Column({ type: INTEGER, field: 'role_id' })
  @ForeignKey(() => RoleSchema)
  declare roleID: number

  @Column({ type: STRING(45), field: 'status' })
  declare status: ItemStatusType

  @BelongsTo(() => UserSchema)
  declare user: UserSchema

  @BelongsTo(() => RoleSchema)
  declare role: RoleSchema
}
