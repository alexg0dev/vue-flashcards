import { ref, watch } from 'vue'
import { createId, newCard, review } from '../lib/scheduler.js'
import { sampleDecks } from '../lib/sampleDecks.js'

export const STORAGE_KEY = 'vue-flashcards:v1'

function load(storage) {
  try {
    const saved = JSON.parse(storage.getItem(STORAGE_KEY))
    if (Array.isArray(saved)) return saved
  } catch {
    // Broken or missing data: fall back to the sample decks.
  }
  return sampleDecks()
}

export function useDecks(storage = window.localStorage) {
  const decks = ref(load(storage))

  watch(
    decks,
    (value) => storage.setItem(STORAGE_KEY, JSON.stringify(value)),
    { deep: true },
  )

  const find = (deckId) => decks.value.find((deck) => deck.id === deckId)

  function addDeck(name) {
    const deck = { id: createId(), name: name.trim(), cards: [] }
    decks.value.push(deck)
    return deck
  }

  function renameDeck(deckId, name) {
    const deck = find(deckId)
    if (deck) deck.name = name.trim()
  }

  function removeDeck(deckId) {
    decks.value = decks.value.filter((deck) => deck.id !== deckId)
  }

  function addCard(deckId, front, back) {
    find(deckId)?.cards.push(newCard(front, back))
  }

  function updateCard(deckId, cardId, front, back) {
    const card = find(deckId)?.cards.find((c) => c.id === cardId)
    if (card) {
      card.front = front.trim()
      card.back = back.trim()
    }
  }

  function removeCard(deckId, cardId) {
    const deck = find(deckId)
    if (deck) deck.cards = deck.cards.filter((c) => c.id !== cardId)
  }

  function answer(deckId, cardId, gotIt) {
    const deck = find(deckId)
    if (!deck) return
    const index = deck.cards.findIndex((c) => c.id === cardId)
    if (index !== -1) deck.cards[index] = review(deck.cards[index], gotIt)
  }

  return { decks, find, addDeck, renameDeck, removeDeck, addCard, updateCard, removeCard, answer }
}
