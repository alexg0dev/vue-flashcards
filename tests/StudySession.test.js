import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import StudySession from '../src/components/StudySession.vue'
import { newCard } from '../src/lib/scheduler.js'

function makeDeck() {
  return {
    id: 'deck-1',
    name: 'Test deck',
    cards: [newCard('Capital of France?', 'Paris'), newCard('2 + 2?', '4')],
  }
}

function buttonByText(wrapper, text) {
  return wrapper.findAll('button').find((b) => b.text() === text)
}

describe('StudySession', () => {
  it('shows the question, then the answer and the rating buttons', async () => {
    const wrapper = mount(StudySession, { props: { deck: makeDeck() } })

    expect(wrapper.find('[data-test="front"]').text()).toBe('Capital of France?')
    expect(wrapper.text()).toContain('2 cards left')
    expect(buttonByText(wrapper, 'Got it')).toBeUndefined()

    await buttonByText(wrapper, 'Show answer').trigger('click')

    expect(wrapper.find('.flashcard--flipped').exists()).toBe(true)
    expect(buttonByText(wrapper, 'Got it')).toBeDefined()
    expect(buttonByText(wrapper, 'Not yet')).toBeDefined()
  })

  it('emits the answer and moves on to the next card', async () => {
    const deck = makeDeck()
    const wrapper = mount(StudySession, { props: { deck } })

    await buttonByText(wrapper, 'Show answer').trigger('click')
    await buttonByText(wrapper, 'Got it').trigger('click')

    expect(wrapper.emitted('answer')).toEqual([[deck.cards[0].id, true]])
    expect(wrapper.find('[data-test="front"]').text()).toBe('2 + 2?')
    expect(wrapper.text()).toContain('1 card left')
  })

  it('puts a "Not yet" card back at the end of the session', async () => {
    const wrapper = mount(StudySession, { props: { deck: makeDeck() } })

    await buttonByText(wrapper, 'Show answer').trigger('click')
    await buttonByText(wrapper, 'Not yet').trigger('click')

    expect(wrapper.text()).toContain('2 cards left')
    expect(wrapper.find('[data-test="front"]').text()).toBe('2 + 2?')
  })

  it('supports keyboard shortcuts', async () => {
    const deck = makeDeck()
    const wrapper = mount(StudySession, { props: { deck }, attachTo: document.body })

    window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }))
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.flashcard--flipped').exists()).toBe(true)

    window.dispatchEvent(new KeyboardEvent('keydown', { key: '2' }))
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('answer')[0]).toEqual([deck.cards[0].id, true])

    wrapper.unmount()
  })

  it('says when there is nothing left to review', async () => {
    const deck = makeDeck()
    deck.cards.forEach((card) => { card.due = Date.now() + 100000 })
    const wrapper = mount(StudySession, { props: { deck } })
    expect(wrapper.find('[data-test="done"]').exists()).toBe(true)
  })
})
