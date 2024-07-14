import { Column, DataType, Model, Table } from 'sequelize-typescript'
import { ItemStatusType } from '~/type'

const { INTEGER, STRING, DATE, FLOAT } = DataType

export type Product = {
  id?: number
  productCode?: string | null
  quantityPO?: number | null
  status?: ItemStatusType
  dateInputNPL?: string
  dateOutputFCR?: string
}

@Table({
  modelName: 'Product',
  tableName: 'products',
  timestamps: true
})
export default class ProductSchema extends Model<Product> {
  @Column({ type: INTEGER, primaryKey: true, autoIncrement: true, field: 'id' })
  declare id: number

  @Column({ type: STRING, field: 'product_code' })
  declare productCode: string

  @Column({ type: FLOAT, field: 'quantity_po' })
  declare quantityPO: number

  @Column({ type: STRING(45), field: 'status' })
  declare status: string

  @Column({ type: STRING, field: 'date_input_npl' })
  declare dateInputNPL: string

  @Column({ type: STRING, field: 'date_output_fcr' })
  declare dateOutputFCR: string
}
