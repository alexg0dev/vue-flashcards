// Simple Leitner-style spaced repetition.
//
// Every card sits in a box from 0 to MAX_BOX. Answering "Got it" moves the
// card up one box and pushes its due date further out. Answering "Not yet"
// sends it back to box 0 so it comes up again straight away.

export const DAY = 24 * 60 * 60 * 1000

// Days to wait before a card in each box is due again.
export const INTERVALS = [0, 1, 3, 7, 14, 30]
export const MAX_BOX = INTERVALS.length - 1

export function newCard(front, back, now = Date.now()) {
  return {
    id: createId(),
    front: front.trim(),
    back: back.trim(),
    box: 0,
    due: now,
  }
}

export function review(card, gotIt, now = Date.now()) {
  if (!gotIt) {
    return { ...card, box: 0, due: now }
  }
  const box = Math.min(card.box + 1, MAX_BOX)
  return { ...card, box, due: now + INTERVALS[box] * DAY }
}

export function isDue(card, now = Date.now()) {
  return card.due <= now
}

// Due cards, lowest box first, then the ones that have waited longest.
export function dueCards(cards, now = Date.now()) {
  return cards
    .filter((card) => isDue(card, now))
    .sort((a, b) => a.box - b.box || a.due - b.due)
}

export function deckStats(cards, now = Date.now()) {
  const due = cards.filter((card) => isDue(card, now)).length
  const learned = cards.filter((card) => card.box >= 3).length
  return { total: cards.length, due, learned }
}

export function createId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}
