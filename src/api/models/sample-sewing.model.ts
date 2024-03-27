import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { ItemStatusType } from '~/type'
import ProductSchema from './product.model'

const { INTEGER, STRING, DATE } = DataType

export type SampleSewing = {
  id?: number
  productID?: number
  dateSubmissionNPL?: string
  dateApprovalSO?: string
  dateApprovalPP?: string
  dateSubmissionFirstTime?: string
  dateSubmissionSecondTime?: string
  dateSubmissionThirdTime?: string
  dateSubmissionForthTime?: string
  dateSubmissionFifthTime?: string
  status?: ItemStatusType
}

@Table({
  modelName: 'SampleSewing',
  tableName: 'sample-sewing',
  timestamps: true
})
export default class SampleSewingSchema extends Model<SampleSewing> {
  @Column({ type: INTEGER, primaryKey: true, autoIncrement: true, field: 'id' })
  declare id: number

  @Column({ type: INTEGER, field: 'product_id' })
  @ForeignKey(() => ProductSchema)
  declare productID: string

  @Column({ type: DATE, field: 'date_submission_npl' })
  declare dateSubmissionNPL: string

  @Column({ type: DATE, field: 'date_approval_so' })
  declare dateApprovalSO: string

  @Column({ type: DATE, field: 'date_approval_pp' })
  declare dateApprovalPP: string

  @Column({ type: DATE, field: 'date_submission_first_time' })
  declare dateSubmissionFirstTime: string

  @Column({ type: DATE, field: 'date_submission_second_time' })
  declare dateSubmissionSecondTime: string

  @Column({ type: DATE, field: 'date_submission_third_time' })
  declare dateSubmissionThirdTime: string

  @Column({ type: DATE, field: 'date_submission_forth_time' })
  declare dateSubmissionForthTime: string

  @Column({ type: DATE, field: 'date_submission_fifth_time' })
  declare dateSubmissionFifthTime: string

  @Column({ type: STRING, field: 'status' })
  declare status: string

  @BelongsTo(() => ProductSchema)
  declare product: ProductSchema
}
