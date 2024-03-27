import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { ItemStatusType } from '~/type'
import ProductSchema from './product.model'

const { INTEGER, STRING, DATE, FLOAT, BOOLEAN } = DataType

export type CuttingGroup = {
  id?: number
  productID?: number
  quantityRealCut?: number
  timeCut?: string
  dateSendEmbroidered?: string
  quantityDeliveredBTP?: string
  status?: ItemStatusType
  syncStatus?: boolean
  dateArrived1Th?: string
  quantityArrived1Th?: string
  dateArrived2Th?: string
  quantityArrived2Th?: string
  dateArrived3Th?: string
  quantityArrived3Th?: string
  dateArrived4Th?: string
  quantityArrived4Th?: string
  dateArrived5Th?: string
  quantityArrived5Th?: string
  dateArrived6Th?: string
  quantityArrived6Th?: string
  dateArrived7Th?: string
  quantityArrived7Th?: string
  dateArrived8Th?: string
  quantityArrived8Th?: string
  dateArrived9Th?: string
  quantityArrived9Th?: string
  dateArrived10Th?: string
  quantityArrived10Th?: string
}

@Table({
  modelName: 'CuttingGroup',
  tableName: 'cutting_groups',
  timestamps: true
})
export default class CuttingGroupSchema extends Model<CuttingGroup> {
  @Column({ type: INTEGER, primaryKey: true, autoIncrement: true, field: 'id' })
  declare id: number

  @Column({ type: INTEGER, field: 'product_id' })
  @ForeignKey(() => ProductSchema)
  declare productID: number

  @Column({ type: FLOAT, field: 'quantity_real_cut' })
  declare quantityRealCut: string

  @Column({ type: DATE, field: 'time_cut' })
  declare timeCut: string

  @Column({ type: DATE, field: 'date_send_embroidered' })
  declare dateSendEmbroidered: string

  @Column({ type: FLOAT, field: 'quantity_delivered_btp' })
  declare quantityDeliveredBTP: number

  @Column({ type: STRING, field: 'status' })
  declare status: string

  @Column({ type: BOOLEAN, field: 'sync_status' })
  declare syncStatus: boolean

  @Column({ type: DATE, field: 'date_arrived_1th' })
  declare dateArrived1Th: string
  @Column({ type: FLOAT, field: 'quantity_arrived_1th' })
  declare quantityArrived1Th: number

  @Column({ type: DATE, field: 'date_arrived_2th' })
  declare dateArrived2Th: string
  @Column({ type: FLOAT, field: 'quantity_arrived_2th' })
  declare quantityArrived2Th: number

  @Column({ type: DATE, field: 'date_arrived_3th' })
  declare dateArrived3Th: string
  @Column({ type: FLOAT, field: 'quantity_arrived_3th' })
  declare quantityArrived3Th: number

  @Column({ type: DATE, field: 'date_arrived_4th' })
  declare dateArrived4Th: string
  @Column({ type: FLOAT, field: 'quantity_arrived_4th' })
  declare quantityArrived4Th: number

  @Column({ type: DATE, field: 'date_arrived_5th' })
  declare dateArrived5Th: string
  @Column({ type: FLOAT, field: 'quantity_arrived_5th' })
  declare quantityArrived5Th: number

  @Column({ type: DATE, field: 'date_arrived_6th' })
  declare dateArrived6Th: string
  @Column({ type: FLOAT, field: 'quantity_arrived_6th' })
  declare quantityArrived6Th: number

  @Column({ type: DATE, field: 'date_arrived_7th' })
  declare dateArrived7Th: string
  @Column({ type: FLOAT, field: 'quantity_arrived_7th' })
  declare quantityArrived7Th: number

  @Column({ type: DATE, field: 'date_arrived_8th' })
  declare dateArrived8Th: string
  @Column({ type: FLOAT, field: 'quantity_arrived_8th' })
  declare quantityArrived8Th: number

  @Column({ type: DATE, field: 'date_arrived_th' })
  declare dateArrived9Th: string
  @Column({ type: FLOAT, field: 'quantity_arrived_9th' })
  declare quantityArrived9Th: number

  @Column({ type: DATE, field: 'date_arrived_10th' })
  declare dateArrived10Th: string
  @Column({ type: FLOAT, field: 'quantity_arrived_10th' })
  declare quantityArrived10Th: number

  @BelongsTo(() => ProductSchema)
  declare product: ProductSchema
}
