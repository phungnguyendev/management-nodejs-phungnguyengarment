import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { ItemStatusType } from '~/type'
import ProductSchema from './product.model'
import SewingLineSchema from './sewing-line.model'

const { INTEGER, STRING, FLOAT, DATE } = DataType

export type SewingLineDelivery = {
  id?: number
  sewingLineID?: number
  productID?: number
  quantityOriginal?: number | null
  quantitySewed?: number | null
  expiredDate?: string | null
  status?: ItemStatusType
}

@Table({
  modelName: 'SewingLineDelivery',
  tableName: 'sewing-line-delivery',
  timestamps: true
})
export default class SewingLineDeliverySchema extends Model<SewingLineDelivery> {
  @Column({ type: INTEGER, primaryKey: true, autoIncrement: true, field: 'id' })
  declare id: number

  @Column({ type: INTEGER, field: 'sewing_line_id' })
  @ForeignKey(() => SewingLineSchema)
  declare sewingLineID: number

  @Column({ type: INTEGER, field: 'product_id' })
  @ForeignKey(() => ProductSchema)
  declare productID: number

  @Column({ type: FLOAT, field: 'quantity_original' })
  declare quantityOriginal: number

  @Column({ type: FLOAT, field: 'quantity_sewed' })
  declare quantitySewed: number

  @Column({ type: STRING, field: 'expired_date' })
  declare expiredDate: string

  @Column({ type: STRING(45), field: 'status' })
  declare status: string

  @BelongsTo(() => SewingLineSchema)
  declare sewingLine: SewingLineSchema

  @BelongsTo(() => ProductSchema)
  declare product: ProductSchema
}
