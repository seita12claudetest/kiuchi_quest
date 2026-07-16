import type { Season, TimeSlot, Weekday } from '@/types'

const TIME_SLOTS: TimeSlot[] = ['morning', 'noon', 'evening', 'night']
const WEEKDAYS: Weekday[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
const SEASONS: Season[] = ['spring', 'summer', 'autumn', 'winter']

export class TimeSystem {
  getTimeSlot(step: number): TimeSlot {
    return TIME_SLOTS[((step % TIME_SLOTS.length) + TIME_SLOTS.length) % TIME_SLOTS.length]
  }

  getDay(step: number): number {
    return Math.floor(Math.max(0, step) / TIME_SLOTS.length) + 1
  }

  getWeekday(day: number): Weekday {
    return WEEKDAYS[((day - 1) % WEEKDAYS.length + WEEKDAYS.length) % WEEKDAYS.length]
  }

  getSeason(day: number): Season {
    const seasonIndex = Math.floor((Math.max(1, day) - 1) / 30) % SEASONS.length
    return SEASONS[seasonIndex]
  }

  advance(step: number, amount = 1): number {
    return Math.max(0, step + amount)
  }
}
