import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { ItemStatusType } from '~/type'
import AccessoryNoteSchema from './accessory-note.model'
import GarmentAccessorySchema from './garment-accessory.model'

const { INTEGER, STRING } = DataType

export type GarmentAccessoryNote = {
  id?: number
  accessoryNoteID?: number
  garmentAccessoryID?: number
  status?: ItemStatusType
}

@Table({
  modelName: 'GarmentAccessoryNote',
  tableName: 'garment_accessory_notes',
  timestamps: true
})
export default class GarmentAccessoryNoteSchema extends Model<GarmentAccessoryNote> {
  @Column({ type: INTEGER, primaryKey: true, autoIncrement: true, field: 'id' })
  declare id: number

  @Column({ type: INTEGER, field: 'accessory_note_id' })
  @ForeignKey(() => AccessoryNoteSchema)
  declare accessoryNoteID: number

  @Column({ type: INTEGER, field: 'garment_accessory_id' })
  @ForeignKey(() => GarmentAccessorySchema)
  declare garmentAccessoryID: number

  @Column({ type: STRING(45), field: 'status' })
  declare status: string

  @BelongsTo(() => AccessoryNoteSchema)
  declare accessoryNote: AccessoryNoteSchema

  @BelongsTo(() => GarmentAccessorySchema)
  declare garmentAccessory: GarmentAccessorySchema
}
