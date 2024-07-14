import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { ItemStatusType } from '~/type'
import ProductSchema from './product.model'

const { INTEGER, STRING, FLOAT, BOOLEAN } = DataType

export type CuttingGroup = {
  id?: number
  productID?: number
  quantityRealCut?: number | null
  dateTimeCut?: string | null
  dateSendEmbroidered?: string | null
  status?: ItemStatusType
  syncStatus?: boolean | null
  quantitySendDeliveredBTP?: number | null
  dateSendDeliveredBTP?: string | null
  dateArrived1Th?: string | null
  quantityArrived1Th?: string | null
  dateArrived2Th?: string | null
  quantityArrived2Th?: string | null
  dateArrived3Th?: string | null
  quantityArrived3Th?: string | null
  dateArrived4Th?: string | null
  quantityArrived4Th?: string | null
  dateArrived5Th?: string | null
  quantityArrived5Th?: string | null
  dateArrived6Th?: string | null
  quantityArrived6Th?: string | null
  dateArrived7Th?: string | null
  quantityArrived7Th?: string | null
  dateArrived8Th?: string | null
  quantityArrived8Th?: string | null
  dateArrived9Th?: string | null
  quantityArrived9Th?: string | null
  dateArrived10Th?: string | null
  quantityArrived10Th?: string | null
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

  @Column({ type: STRING, field: 'date_time_cut' })
  declare dateTimeCut: string

  @Column({ type: STRING, field: 'date_send_embroidered' })
  declare dateSendEmbroidered: string

  @Column({ type: FLOAT, field: 'quantity_send_delivered_btp' })
  declare quantitySendDeliveredBTP: number

  @Column({ type: STRING, field: 'date_send_delivered_btp' })
  declare dateSendDeliveredBTP: string

  @Column({ type: STRING, field: 'status' })
  declare status: string

  @Column({ type: BOOLEAN, field: 'sync_status' })
  declare syncStatus: boolean

  @Column({ type: STRING, field: 'date_arrived_1th' })
  declare dateArrived1Th: string
  @Column({ type: FLOAT, field: 'quantity_arrived_1th' })
  declare quantityArrived1Th: number

  @Column({ type: STRING, field: 'date_arrived_2th' })
  declare dateArrived2Th: string
  @Column({ type: FLOAT, field: 'quantity_arrived_2th' })
  declare quantityArrived2Th: number

  @Column({ type: STRING, field: 'date_arrived_3th' })
  declare dateArrived3Th: string
  @Column({ type: FLOAT, field: 'quantity_arrived_3th' })
  declare quantityArrived3Th: number

  @Column({ type: STRING, field: 'date_arrived_4th' })
  declare dateArrived4Th: string
  @Column({ type: FLOAT, field: 'quantity_arrived_4th' })
  declare quantityArrived4Th: number

  @Column({ type: STRING, field: 'date_arrived_5th' })
  declare dateArrived5Th: string
  @Column({ type: FLOAT, field: 'quantity_arrived_5th' })
  declare quantityArrived5Th: number

  @Column({ type: STRING, field: 'date_arrived_6th' })
  declare dateArrived6Th: string
  @Column({ type: FLOAT, field: 'quantity_arrived_6th' })
  declare quantityArrived6Th: number

  @Column({ type: STRING, field: 'date_arrived_7th' })
  declare dateArrived7Th: string
  @Column({ type: FLOAT, field: 'quantity_arrived_7th' })
  declare quantityArrived7Th: number

  @Column({ type: STRING, field: 'date_arrived_8th' })
  declare dateArrived8Th: string
  @Column({ type: FLOAT, field: 'quantity_arrived_8th' })
  declare quantityArrived8Th: number

  @Column({ type: STRING, field: 'date_arrived_th' })
  declare dateArrived9Th: string
  @Column({ type: FLOAT, field: 'quantity_arrived_9th' })
  declare quantityArrived9Th: number

  @Column({ type: STRING, field: 'date_arrived_10th' })
  declare dateArrived10Th: string
  @Column({ type: FLOAT, field: 'quantity_arrived_10th' })
  declare quantityArrived10Th: number

  @BelongsTo(() => ProductSchema)
  declare product: ProductSchema
}
