import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { ItemStatusType } from '~/type'
import SampleSewingSchema from './sample-sewing.model'

const { INTEGER, STRING, FLOAT, DATE } = DataType

export type DateSubmission = {
  id?: number
  sampleSewingID?: number
  dateSubmission?: STRING
  dateSubmissionNPL?: STRING
  dateApprovalSO?: STRING
  status?: ItemStatusType
}

@Table({
  modelName: 'DateSubmission',
  tableName: 'date-submission',
  timestamps: true
})
export default class DateSubmissionSchema extends Model<DateSubmission> {
  @Column({ type: INTEGER, primaryKey: true, autoIncrement: true, field: 'id' })
  declare id: number

  @Column({ type: INTEGER, field: 'sample_sewing_id' })
  @ForeignKey(() => SampleSewingSchema)
  declare sampleSewingID: number

  @Column({ type: STRING, field: 'date_submission' })
  declare dateSubmission: STRING

  @Column({ type: STRING, field: 'date_submission_npl' })
  declare dateSubmissionNPL: STRING

  @Column({ type: STRING, field: 'summary' })
  declare summary: string

  @Column({ type: STRING, field: 'date_approval_so' })
  declare dateApprovalSO: STRING

  @Column({ type: STRING, field: 'status' })
  declare status: string

  @BelongsTo(() => SampleSewingSchema)
  declare sampleSewing: SampleSewingSchema
}
