import { format, getTimezoneOffset, toDate, toZonedTime } from 'date-fns-tz'

const date = new Date()

export const dateNow = (): Date => {
  const myDate = toZonedTime(date, 'Asia/Ho_Chi_Minh')
  const formatted = format(myDate, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone: 'Asia/Ho_Chi_Minh' })
  return toDate(formatted)
}

export const dateFormatter = (date: Date, formatter?: string): Date => {
  const myDate = toZonedTime(date, 'Asia/Ho_Chi_Minh')
  const formatted = format(myDate, formatter ?? 'yyyy-MM-dd HH:mm:ssXXX', { timeZone: 'Asia/Ho_Chi_Minh' })
  return toDate(formatted)
}

export const dateOffset = (date: Date): number => {
  return getTimezoneOffset('Asia/Ho_Chi_Minh', date)
}
