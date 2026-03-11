import { format, isToday, isTomorrow, isYesterday, parseISO } from 'date-fns'
import { ko } from 'date-fns/locale'

export function formatDate(dateStr: string): string {
  const date = parseISO(dateStr)
  if (isToday(date)) return '오늘'
  if (isTomorrow(date)) return '내일'
  if (isYesterday(date)) return '어제'
  return format(date, 'M월 d일 (E)', { locale: ko })
}

export function formatDateTime(dateStr: string): string {
  return format(parseISO(dateStr), 'M월 d일 HH:mm', { locale: ko })
}

export function formatTime(dateStr: string): string {
  return format(parseISO(dateStr), 'HH:mm')
}

export function formatMonthDay(dateStr: string): string {
  return format(parseISO(dateStr), 'M/d')
}

export function todayString(): string {
  return format(new Date(), 'yyyy-MM-dd')
}
