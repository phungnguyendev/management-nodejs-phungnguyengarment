import { Column, DataType, HasOne, Model, Table } from 'sequelize-typescript'
import { ItemStatusType } from '~/type'
import ImportationSchema from './importation.model'
import PrintablePlaceSchema from './printable-place.model'
import ProductColorSchema from './product-color.model'
import ProductGroupSchema from './product-group.model'

const { INTEGER, STRING, DATE, FLOAT } = DataType

export type Product = {
  id?: number
  productCode?: string | null
  quantityPO?: number | null
  status?: ItemStatusType
  dateInputNPL?: Date
  dateOutputFCR?: Date
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

  @Column({ type: STRING, field: 'status' })
  declare status: string

  @Column({ type: DATE, field: 'date_input_npl' })
  declare dateInputNPL: Date

  @Column({ type: DATE, field: 'date_output_fcr' })
  declare dateOutputFCR: Date

  @HasOne(() => ImportationSchema)
  declare importation: ImportationSchema

  @HasOne(() => ProductColorSchema)
  declare productColor: ProductColorSchema

  @HasOne(() => ProductGroupSchema)
  declare productGroup: ProductGroupSchema

  @HasOne(() => PrintablePlaceSchema)
  declare printablePlace: PrintablePlaceSchema
}
