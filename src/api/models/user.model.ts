import { Column, DataType, Model, Table } from 'sequelize-typescript'
import { ItemStatusType } from '~/type'

const { INTEGER, STRING, BOOLEAN } = DataType

export interface User {
  id?: number
  fullName?: string | null
  email?: string | null
  password?: string | null
  avatar?: string | null
  phone?: string | null
  otp?: string | null | null
  isAdmin?: boolean | null
  accessKey?: string | null
  workDescription?: string | null
  birthday?: string | null
  status?: ItemStatusType
}

@Table({
  modelName: 'User',
  tableName: 'users',
  timestamps: true
})
export default class UserSchema extends Model<User> {
  @Column({ type: INTEGER, primaryKey: true, autoIncrement: true, field: 'id' })
  declare id: number

  @Column({ type: STRING, field: 'full_name' })
  declare fullName: string

  @Column({ type: STRING, field: 'email' })
  declare email: string

  @Column({ type: STRING, field: 'password' })
  declare password: string

  @Column({ type: STRING, field: 'avatar' })
  declare avatar: string

  @Column({ type: STRING, field: 'phone' })
  declare phone: string

  @Column({ type: STRING, field: 'otp' })
  declare otp: string

  @Column({ type: BOOLEAN, field: 'is_admin' })
  declare isAdmin: boolean

  @Column({ type: STRING(45), field: 'access_key' })
  declare accessKey: string

  @Column({ type: STRING, field: 'work_description' })
  declare workDescription: string

  @Column({ type: STRING, field: 'birthday' })
  declare birthday: string

  @Column({ type: STRING(45), field: 'status' })
  declare status: ItemStatusType
}
