import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { ItemStatusType } from '~/type'
import ColorSchema from './color.model'
import ProductSchema from './product.model'

const { INTEGER, DOUBLE, STRING } = DataType

export type ProductColor = {
  id?: number
  colorID?: number
  productID?: number
  status?: ItemStatusType
}

@Table({
  modelName: 'ProductColor',
  tableName: 'product_colors',
  timestamps: true
})
export default class ProductColorSchema extends Model<ProductColor> {
  @Column({ type: INTEGER, primaryKey: true, autoIncrement: true, field: 'id' })
  declare id: number

  @Column({ type: INTEGER, field: 'color_id' })
  @ForeignKey(() => ColorSchema)
  declare colorID: number

  @Column({ type: INTEGER, field: 'product_id' })
  @ForeignKey(() => ProductSchema)
  declare productID: number

  @Column({ type: STRING(45), field: 'status' })
  declare status: string

  @BelongsTo(() => ProductSchema)
  declare product: ProductSchema

  @BelongsTo(() => ColorSchema)
  declare color: ColorSchema
}
