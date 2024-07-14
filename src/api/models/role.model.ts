import { Column, DataType, Model, Table } from 'sequelize-typescript'
import { ItemStatusType } from '~/type'

const { INTEGER, BOOLEAN, STRING } = DataType

export interface Role {
  id?: number
  role?: string | null // product_manager
  shortName?: string | null // Product manager
  desc?: string | null // Quản lý sản phẩm
  status?: ItemStatusType
}

@Table({
  modelName: 'Role',
  tableName: 'roles',
  timestamps: true
})
export default class RoleSchema extends Model<Role> {
  @Column({ type: INTEGER, primaryKey: true, autoIncrement: true, field: 'id' })
  declare id: number

  @Column({ type: STRING, field: 'role' })
  declare role: string

  @Column({ type: STRING, field: 'short_name' })
  declare shortName: string

  @Column({ type: STRING, field: 'desc' })
  declare desc: string

  @Column({ type: STRING(45), field: 'status' })
  declare status: ItemStatusType
}
