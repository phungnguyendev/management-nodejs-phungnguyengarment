import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { ItemStatusType } from '~/type'
import ProductSchema from './product.model'

const { INTEGER, STRING, FLOAT, DATE } = DataType

export type Importation = {
  id?: number
  productID?: number
  quantity?: number | null
  status?: ItemStatusType
  dateImported?: string | null
}

@Table({
  modelName: 'Importation',
  tableName: 'importations',
  timestamps: true
})
export default class ImportationSchema extends Model<Importation> {
  @Column({ type: INTEGER, primaryKey: true, autoIncrement: true, field: 'id' })
  declare id: number

  @Column({ type: INTEGER, field: 'product_id' })
  @ForeignKey(() => ProductSchema)
  declare productID: number

  @Column({ type: STRING(45), field: 'status' })
  declare status: string

  @Column({ type: FLOAT, field: 'quantity' })
  declare quantity: number

  @Column({ type: STRING, field: 'date_imported' })
  declare dateImported: string

  @BelongsTo(() => ProductSchema)
  declare product: ProductSchema
}
