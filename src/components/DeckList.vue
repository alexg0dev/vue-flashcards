<script setup>
import { ref } from 'vue'
import { deckStats } from '../lib/scheduler.js'

defineProps({
  decks: { type: Array, required: true },
  selectedId: { type: String, default: null },
})
const emit = defineEmits(['select', 'add'])

const newName = ref('')

function add() {
  if (!newName.value.trim()) return
  emit('add', newName.value)
  newName.value = ''
}
</script>

<template>
  <nav class="decks" aria-label="Decks">
    <h2 class="decks__heading">Decks</h2>
    <ul class="decks__list">
      <li v-for="deck in decks" :key="deck.id">
        <button
          type="button"
          class="decks__item"
          :class="{ 'decks__item--active': deck.id === selectedId }"
          :aria-current="deck.id === selectedId ? 'true' : undefined"
          @click="emit('select', deck.id)"
        >
          <span class="decks__name">{{ deck.name }}</span>
          <span class="decks__meta">
            {{ deckStats(deck.cards).due }} due &middot; {{ deck.cards.length }} total
          </span>
        </button>
      </li>
    </ul>
    <form class="decks__new" @submit.prevent="add">
      <label for="new-deck" class="visually-hidden">New deck name</label>
      <input id="new-deck" v-model="newName" class="field__input" placeholder="New deck name" maxlength="60" />
      <button type="submit" class="btn btn--secondary">Add</button>
    </form>
  </nav>
</template>

<style scoped lang="scss">
@use '../styles/variables' as *;

.decks__heading {
  margin: 0 0 $space-2;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: $color-muted;
}

.decks__list {
  display: grid;
  gap: $space-1;
  margin: 0 0 $space-3;
  padding: 0;
  list-style: none;
}

.decks__item {
  display: grid;
  width: 100%;
  padding: $space-2;
  border: 1px solid transparent;
  border-radius: $radius-small;
  background: none;
  font: inherit;
  color: inherit;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: $color-surface-alt;
  }

  &--active {
    border-color: $color-border;
    background: $color-surface;
    box-shadow: $shadow;
  }

  &:focus-visible {
    outline: 3px solid $color-focus;
    outline-offset: 1px;
  }
}

.decks__name {
  font-weight: 600;
}

.decks__meta {
  font-size: 0.85rem;
  color: $color-muted;
}

.decks__new {
  display: flex;
  gap: $space-1;

  input {
    flex: 1;
    min-width: 0;
  }
}
</style>
