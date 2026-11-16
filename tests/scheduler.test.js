import { describe, expect, it } from 'vitest'
import { DAY, INTERVALS, MAX_BOX, deckStats, dueCards, isDue, newCard, review } from '../src/lib/scheduler.js'

const NOW = new Date('2026-01-01T09:00:00Z').getTime()

describe('newCard', () => {
  it('starts in box 0 and is due straight away', () => {
    const card = newCard('  front  ', ' back ', NOW)
    expect(card).toMatchObject({ front: 'front', back: 'back', box: 0, due: NOW })
    expect(card.id).toBeTruthy()
  })
})

describe('review', () => {
  it('moves a card up a box and schedules it by that box interval', () => {
    const card = newCard('a', 'b', NOW)
    const once = review(card, true, NOW)
    expect(once.box).toBe(1)
    expect(once.due).toBe(NOW + INTERVALS[1] * DAY)

    const twice = review(once, true, NOW)
    expect(twice.box).toBe(2)
    expect(twice.due).toBe(NOW + INTERVALS[2] * DAY)
  })

  it('never goes past the last box', () => {
    const card = { ...newCard('a', 'b', NOW), box: MAX_BOX }
    const next = review(card, true, NOW)
    expect(next.box).toBe(MAX_BOX)
    expect(next.due).toBe(NOW + INTERVALS[MAX_BOX] * DAY)
  })

  it('sends a card back to box 0 and makes it due now on "Not yet"', () => {
    const card = { ...newCard('a', 'b', NOW), box: 3, due: NOW + 7 * DAY }
    const next = review(card, false, NOW)
    expect(next.box).toBe(0)
    expect(next.due).toBe(NOW)
  })

  it('does not change the original card', () => {
    const card = newCard('a', 'b', NOW)
    review(card, true, NOW)
    expect(card.box).toBe(0)
  })
})

describe('dueCards', () => {
  it('returns only due cards, lowest box first then oldest', () => {
    const a = { ...newCard('a', '1', NOW), box: 2, due: NOW - DAY }
    const b = { ...newCard('b', '2', NOW), box: 0, due: NOW }
    const c = { ...newCard('c', '3', NOW), box: 0, due: NOW - 2 * DAY }
    const later = { ...newCard('d', '4', NOW), box: 1, due: NOW + DAY }

    expect(dueCards([a, b, c, later], NOW).map((card) => card.front)).toEqual(['c', 'b', 'a'])
    expect(isDue(later, NOW)).toBe(false)
  })
})

describe('deckStats', () => {
  it('counts total, due and learned cards', () => {
    const cards = [
      { ...newCard('a', '1', NOW), box: 0, due: NOW },
      { ...newCard('b', '2', NOW), box: 3, due: NOW + DAY },
      { ...newCard('c', '3', NOW), box: 4, due: NOW - DAY },
    ]
    expect(deckStats(cards, NOW)).toEqual({ total: 3, due: 2, learned: 2 })
  })
})
