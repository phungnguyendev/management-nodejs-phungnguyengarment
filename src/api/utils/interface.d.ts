export type LevelState = 'Error' | 'Warning' | 'Success'

export interface StepRound {
  name: string
  type: LevelState
}

export interface ProductResponse {
  productID?: number
  productCode?: string | null
  quantityPO?: number | null
  dateOutputFCR?: string | null
  stepRounds: StepRound[]
  orderNumber?: number | null
}
