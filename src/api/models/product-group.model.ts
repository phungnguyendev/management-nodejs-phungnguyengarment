import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { ItemStatusType } from '~/type'
import GroupSchema from './group.model'
import ProductSchema from './product.model'

const { INTEGER, STRING } = DataType

export type ProductGroup = {
  id?: number
  groupID?: number
  productID?: number
  status?: ItemStatusType
}

@Table({
  modelName: 'ProductGroup',
  tableName: 'product_groups',
  timestamps: true
})
export default class ProductGroupSchema extends Model<ProductGroup> {
  @Column({ type: INTEGER, primaryKey: true, autoIncrement: true, field: 'id' })
  declare id: number

  @Column({ type: INTEGER, field: 'group_id' })
  @ForeignKey(() => GroupSchema)
  declare groupID: number

  @Column({ type: INTEGER, field: 'product_id' })
  @ForeignKey(() => ProductSchema)
  declare productID: number

  @Column({ type: STRING(45), field: 'status' })
  declare status: string

  @BelongsTo(() => ProductSchema)
  declare product: ProductSchema

  @BelongsTo(() => GroupSchema)
  declare group: GroupSchema
}
