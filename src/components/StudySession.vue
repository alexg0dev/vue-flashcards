<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import FlashCard from './FlashCard.vue'
import { dueCards } from '../lib/scheduler.js'

const props = defineProps({
  deck: { type: Object, required: true },
})
const emit = defineEmits(['answer'])

// The queue is a snapshot of card ids taken when the session starts, so
// answering a card does not reshuffle the cards still waiting.
const queue = ref([])
const flipped = ref(false)
const results = ref({ gotIt: 0, notYet: 0 })

function start(all = false) {
  const cards = all ? props.deck.cards : dueCards(props.deck.cards)
  queue.value = cards.map((card) => card.id)
  flipped.value = false
  results.value = { gotIt: 0, notYet: 0 }
}

watch(() => props.deck.id, () => start(), { immediate: true })

const current = computed(() =>
  props.deck.cards.find((card) => card.id === queue.value[0]),
)
const remaining = computed(() => queue.value.length)

function flip() {
  if (current.value) flipped.value = !flipped.value
}

function answer(gotIt) {
  const card = current.value
  if (!card || !flipped.value) return
  emit('answer', card.id, gotIt)
  queue.value.shift()
  if (gotIt) {
    results.value.gotIt++
  } else {
    results.value.notYet++
    // Show it again at the end of this session.
    queue.value.push(card.id)
  }
  flipped.value = false
}

function onKeydown(event) {
  const tag = event.target?.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA') return
  if (event.key === ' ' || event.key === 'Enter') {
    // Let a focused button handle Enter/Space itself.
    if (tag === 'BUTTON') return
    event.preventDefault()
    flip()
  } else if (event.key === '1' || event.key === 'ArrowLeft') {
    answer(false)
  } else if (event.key === '2' || event.key === 'ArrowRight') {
    answer(true)
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <section class="study" aria-labelledby="study-heading">
    <h2 id="study-heading" class="visually-hidden">Study {{ deck.name }}</h2>

    <template v-if="current">
      <p class="study__progress" aria-live="polite">
        {{ remaining }} {{ remaining === 1 ? 'card' : 'cards' }} left
      </p>

      <FlashCard :front="current.front" :back="current.back" :flipped="flipped" @flip="flip" />

      <div class="study__actions">
        <button v-if="!flipped" type="button" class="btn btn--primary" @click="flip">
          Show answer
        </button>
        <template v-else>
          <button type="button" class="btn btn--secondary" @click="answer(false)">Not yet</button>
          <button type="button" class="btn btn--primary" @click="answer(true)">Got it</button>
        </template>
      </div>

      <p class="study__hint">
        Keys: <kbd>Space</kbd> flip, <kbd>1</kbd> or <kbd>&larr;</kbd> not yet,
        <kbd>2</kbd> or <kbd>&rarr;</kbd> got it
      </p>
    </template>

    <div v-else class="study__done">
      <template v-if="deck.cards.length === 0">
        <p class="study__done-title">This deck has no cards yet.</p>
        <p>Add some on the Edit cards tab.</p>
      </template>
      <template v-else>
        <p class="study__done-title" data-test="done">Nothing left to review right now.</p>
        <p v-if="results.gotIt || results.notYet">
          This session: {{ results.gotIt }} got it, {{ results.notYet }} not yet.
        </p>
        <button type="button" class="btn btn--secondary" @click="start(true)">
          Practise all cards anyway
        </button>
      </template>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '../styles/variables' as *;

.study {
  max-width: 36rem;
  margin: 0 auto;
}

.study__progress {
  margin: 0 0 $space-2;
  color: $color-muted;
  font-size: 0.9rem;
}

.study__actions {
  display: flex;
  justify-content: center;
  gap: $space-2;
  margin-top: $space-3;

  .btn {
    min-width: 8rem;
  }
}

.study__hint {
  margin-top: $space-3;
  text-align: center;
  color: $color-muted;
  font-size: 0.85rem;
}

.study__done {
  padding: $space-5 $space-3;
  border: 1px dashed $color-border;
  border-radius: $radius;
  text-align: center;
}

.study__done-title {
  font-size: 1.15rem;
  font-weight: 600;
}
</style>
