import { addDays, addHours, addMinutes, addYears, toDate } from 'date-fns'
import { format, toZonedTime } from 'date-fns-tz'
import { JwtConfig } from './jsonwebtoken.helper'

// Đặt múi giờ châu Á (UTC+7)
const timeZoneLocal = 'Asia/Bangkok'

export type DateFormatType = 'iso8601' | 'dateOnly' | 'default'

export const dateLocal = (date: Date | string): Date => {
  return toZonedTime(date, timeZoneLocal)
}

export const dateNowString = (formatType?: DateFormatType): string => {
  const myDate = toZonedTime(Date.now(), timeZoneLocal)
  switch (formatType) {
    case 'iso8601':
      return format(myDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    case 'dateOnly':
      return format(myDate, 'MM/dd/yyyy')
    default:
      return String(myDate)
  }
}

export const dateNow = (formatType?: DateFormatType): Date => {
  const myDate = toZonedTime(Date.now(), timeZoneLocal)
  switch (formatType) {
    case 'iso8601':
      return toDate(format(myDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"))
    case 'dateOnly':
      return toDate(format(myDate, 'MM/dd/yyyy'))
    default:
      return toDate(myDate)
  }
}

export const dateFormatter = (date: Date | string, formatType?: DateFormatType): Date => {
  const myDate = toZonedTime(typeof date === 'string' ? toDate(date) : date, timeZoneLocal)
  switch (formatType) {
    case 'iso8601':
      return toDate(format(myDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"))
    case 'dateOnly':
      return toDate(format(myDate, 'MM/dd/yyyy'))
    default:
      return myDate
  }
}

export const dateFormatterToString = (date: Date | string, formatType?: DateFormatType): string => {
  const myDate = toZonedTime(typeof date === 'string' ? toDate(date) : date, timeZoneLocal)
  switch (formatType) {
    case 'iso8601':
      return format(myDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    case 'dateOnly':
      return format(myDate, 'MM/dd/yyyy')
    default:
      return String(myDate)
  }
}

export const expiresDateFormJWTConfig = (jwtConfig: JwtConfig): Date => {
  switch (jwtConfig.expiresType) {
    case 'day':
      return addDays(Date.now(), jwtConfig.expiresIn) // Days
    case 'minutes':
      return addMinutes(Date.now(), jwtConfig.expiresIn)
    case 'hour':
      return addHours(Date.now(), jwtConfig.expiresIn)
    default:
      return addYears(Date.now(), jwtConfig.expiresIn)
  }
}
