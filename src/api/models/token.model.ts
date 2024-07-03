import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import UserSchema from './user.model'

const { INTEGER, STRING, DATE } = DataType

export interface Token {
  id?: number
  userID?: number | null
  refreshToken?: string | null
  expiresAt?: string
}

@Table({
  modelName: 'Token',
  tableName: 'tokens',
  timestamps: true
})
export default class TokenSchema extends Model<Token> {
  @Column({ type: INTEGER, primaryKey: true, autoIncrement: true, field: 'id' })
  declare id: number

  @Column({ type: INTEGER, field: 'user_id' })
  @ForeignKey(() => UserSchema)
  declare userID: number

  @Column({ type: STRING, field: 'refresh_token' })
  declare refreshToken: string

  @Column({ type: STRING, field: 'expires_at' })
  declare expiresAt: string

  @BelongsTo(() => UserSchema)
  declare user: UserSchema
}
