import { Column, DataType, Model, Table } from 'sequelize-typescript'
import { ItemStatusType } from '~/type'

const { INTEGER, STRING } = DataType

export type SewingLine = {
  id?: number
  name?: string
  status?: ItemStatusType
}

@Table({
  modelName: 'SewingLine',
  tableName: 'sewing-line',
  timestamps: true
})
export default class SewingLineSchema extends Model<SewingLine> {
  @Column({ type: INTEGER, primaryKey: true, autoIncrement: true, field: 'id' })
  declare id: number

  @Column({ type: STRING, field: 'name' })
  declare name: string

  @Column({ type: STRING, field: 'status' })
  declare status: string
}
