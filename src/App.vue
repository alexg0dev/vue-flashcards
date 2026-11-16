<script setup>
import { computed, ref } from 'vue'
import DeckList from './components/DeckList.vue'
import DeckEditor from './components/DeckEditor.vue'
import StudySession from './components/StudySession.vue'
import { useDecks } from './composables/useDecks.js'

const store = useDecks()
const { decks } = store

const selectedId = ref(decks.value[0]?.id ?? null)
const tab = ref('study')
const deck = computed(() => store.find(selectedId.value))

function select(id) {
  selectedId.value = id
  tab.value = 'study'
}

function addDeck(name) {
  const created = store.addDeck(name)
  selectedId.value = created.id
  tab.value = 'edit'
}

function removeDeck() {
  store.removeDeck(selectedId.value)
  selectedId.value = decks.value[0]?.id ?? null
  tab.value = 'study'
}
</script>

<template>
  <header class="site-header">
    <div class="container site-header__inner">
      <h1 class="site-header__title">Flashcards</h1>
      <p class="site-header__tagline">Make a deck, flip through it, and come back when cards are due.</p>
    </div>
  </header>

  <div class="container layout">
    <aside class="layout__sidebar">
      <DeckList :decks="decks" :selected-id="selectedId" @select="select" @add="addDeck" />
    </aside>

    <main class="layout__main" id="main">
      <template v-if="deck">
        <div class="deck-header">
          <h2 class="deck-header__title">{{ deck.name }}</h2>
          <div class="tabs" role="group" aria-label="Deck view">
            <button
              type="button"
              class="tabs__tab"
              :aria-pressed="tab === 'study'"
              @click="tab = 'study'"
            >Study</button>
            <button
              type="button"
              class="tabs__tab"
              :aria-pressed="tab === 'edit'"
              @click="tab = 'edit'"
            >Edit cards</button>
          </div>
        </div>

        <StudySession
          v-if="tab === 'study'"
          :deck="deck"
          @answer="(cardId, gotIt) => store.answer(deck.id, cardId, gotIt)"
        />
        <DeckEditor
          v-else
          :deck="deck"
          @rename="(name) => store.renameDeck(deck.id, name)"
          @remove="removeDeck"
          @add-card="(front, back) => store.addCard(deck.id, front, back)"
          @update-card="(id, front, back) => store.updateCard(deck.id, id, front, back)"
          @remove-card="(id) => store.removeCard(deck.id, id)"
        />
      </template>
      <p v-else class="empty">Create a deck to get started.</p>
    </main>
  </div>

  <footer class="site-footer">
    <div class="container">
      Your decks are saved in this browser only.
      <a href="https://github.com/alexg0dev/vue-flashcards">Source on GitHub</a>
    </div>
  </footer>
</template>

<style scoped lang="scss">
@use './styles/variables' as *;
@use './styles/mixins' as *;

.site-header {
  border-bottom: 1px solid $color-border;
  background: $color-surface;

  &__inner {
    padding-block: $space-3;
  }

  &__title {
    margin: 0;
    font-size: 1.5rem;
    color: $color-primary;
  }

  &__tagline {
    margin: $space-1 0 0;
    color: $color-muted;
  }
}

.layout {
  display: grid;
  grid-template-columns: 16rem 1fr;
  gap: $space-4;
  padding-block: $space-4;

  @include below($bp-medium) {
    grid-template-columns: 1fr;
    gap: $space-3;
  }
}

.deck-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: $space-2;
  margin-bottom: $space-3;

  &__title {
    margin: 0;
    font-size: 1.35rem;
  }
}

.tabs {
  display: inline-flex;
  padding: 3px;
  border: 1px solid $color-border;
  border-radius: $radius-small;
  background: $color-surface-alt;

  &__tab {
    padding: $space-1 $space-2;
    border: 0;
    border-radius: calc(#{$radius-small} - 2px);
    background: none;
    font: inherit;
    color: $color-muted;
    cursor: pointer;

    &[aria-pressed='true'] {
      background: $color-surface;
      color: $color-text;
      font-weight: 600;
      box-shadow: $shadow;
    }

    &:focus-visible {
      outline: 3px solid $color-focus;
    }
  }
}

.empty {
  color: $color-muted;
}

.site-footer {
  padding-block: $space-3;
  border-top: 1px solid $color-border;
  color: $color-muted;
  font-size: 0.9rem;

  a {
    color: $color-primary;
  }
}
</style>
