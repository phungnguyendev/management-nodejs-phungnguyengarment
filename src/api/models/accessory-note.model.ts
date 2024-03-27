import { Column, DataType, Model, Table } from 'sequelize-typescript'
import { ItemStatusType } from '~/type'

const { INTEGER, STRING } = DataType

export type AccessoryNote = {
  id?: number
  title?: string
  summary?: string
  status?: ItemStatusType
}

@Table({
  modelName: 'AccessoryNote',
  tableName: 'accessory_note',
  timestamps: true
})
export default class AccessoryNoteSchema extends Model<AccessoryNote> {
  @Column({ type: INTEGER, primaryKey: true, autoIncrement: true, field: 'id' })
  declare id: number

  @Column({ type: STRING, field: 'title' })
  declare title: string

  @Column({ type: STRING, field: 'summary' })
  declare summary: string

  @Column({ type: STRING, field: 'status' })
  declare status: string
}
