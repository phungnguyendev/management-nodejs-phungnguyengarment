import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { ItemStatusType } from '~/type'
import ProductSchema from './product.model'

const { INTEGER, STRING, BOOLEAN, FLOAT, DATE } = DataType

export type Completion = {
  id?: number
  productID?: number
  quantityIroned?: number
  quantityCheckPassed?: number
  quantityPackaged?: number
  exportedDate?: string
  passFIDate?: string
  status?: ItemStatusType
}

@Table({
  modelName: 'Completion',
  tableName: 'completion',
  timestamps: true
})
export default class CompletionSchema extends Model<Completion> {
  @Column({ type: INTEGER, primaryKey: true, autoIncrement: true, field: 'id' })
  declare id: number

  @Column({ type: INTEGER, field: 'product_id' })
  @ForeignKey(() => ProductSchema)
  declare productID: number

  @Column({ type: FLOAT, field: 'quantity_ironed' })
  declare quantityIroned: number

  @Column({ type: FLOAT, field: 'quantity_check_passed' })
  declare quantityCheckPassed: string

  @Column({ type: FLOAT, field: 'quantity_packaged' })
  declare quantityPackaged: string

  @Column({ type: DATE, field: 'exported_date' })
  declare exportedDate: string

  @Column({ type: DATE, field: 'pass_fi_date' })
  declare passFIDate: string

  @Column({ type: STRING, field: 'status' })
  declare status: string

  @BelongsTo(() => ProductSchema)
  declare product: ProductSchema
}
