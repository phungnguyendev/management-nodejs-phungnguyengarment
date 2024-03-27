import { Column, DataType, Model, Table } from 'sequelize-typescript'
import { ItemStatusType } from '~/type'

const { INTEGER, STRING } = DataType

export type Color = {
  id?: number
  name?: string
  hexColor?: string
  status?: ItemStatusType
}

@Table({
  modelName: 'Color',
  tableName: 'colors',
  timestamps: true
})
export default class ColorSchema extends Model<Color> {
  @Column({ type: INTEGER, primaryKey: true, autoIncrement: true, field: 'id' })
  declare id: number

  @Column({ type: STRING, field: 'name' })
  declare name: string

  @Column({ type: STRING, field: 'hex_color' })
  declare hexColor: string

  @Column({ type: STRING, field: 'status' })
  declare status: string
}
