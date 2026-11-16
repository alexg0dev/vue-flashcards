<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  deck: { type: Object, required: true },
})
const emit = defineEmits(['rename', 'remove', 'add-card', 'update-card', 'remove-card'])

const name = ref(props.deck.name)
watch(() => props.deck.id, () => { name.value = props.deck.name; cancelEdit() })

const front = ref('')
const back = ref('')
const frontInput = ref(null)

function addCard() {
  if (!front.value.trim() || !back.value.trim()) return
  emit('add-card', front.value, back.value)
  front.value = ''
  back.value = ''
  frontInput.value?.focus()
}

const editingId = ref(null)
const editFront = ref('')
const editBack = ref('')

function startEdit(card) {
  editingId.value = card.id
  editFront.value = card.front
  editBack.value = card.back
}

function saveEdit() {
  if (!editFront.value.trim() || !editBack.value.trim()) return
  emit('update-card', editingId.value, editFront.value, editBack.value)
  cancelEdit()
}

function cancelEdit() {
  editingId.value = null
}

function saveName() {
  if (name.value.trim() && name.value.trim() !== props.deck.name) {
    emit('rename', name.value)
  }
}

function removeDeck() {
  if (window.confirm(`Delete the deck "${props.deck.name}" and all its cards?`)) {
    emit('remove')
  }
}
</script>

<template>
  <section class="editor" aria-labelledby="editor-heading">
    <h2 id="editor-heading" class="visually-hidden">Edit {{ deck.name }}</h2>

    <form class="editor__row" @submit.prevent="saveName">
      <label class="field">
        <span class="field__label">Deck name</span>
        <input v-model="name" class="field__input" required maxlength="60" @blur="saveName" />
      </label>
      <button type="button" class="btn btn--danger" @click="removeDeck">Delete deck</button>
    </form>

    <form class="editor__new card-panel" @submit.prevent="addCard">
      <h3 class="editor__title">Add a card</h3>
      <label class="field">
        <span class="field__label">Front</span>
        <textarea ref="frontInput" v-model="front" class="field__input" rows="2" required />
      </label>
      <label class="field">
        <span class="field__label">Back</span>
        <textarea v-model="back" class="field__input" rows="2" required />
      </label>
      <button type="submit" class="btn btn--primary">Add card</button>
    </form>

    <h3 class="editor__title">{{ deck.cards.length }} {{ deck.cards.length === 1 ? 'card' : 'cards' }}</h3>
    <ul class="editor__list">
      <li v-for="card in deck.cards" :key="card.id" class="editor__item card-panel">
        <form v-if="editingId === card.id" class="editor__edit" @submit.prevent="saveEdit">
          <label class="field">
            <span class="field__label">Front</span>
            <textarea v-model="editFront" class="field__input" rows="2" required />
          </label>
          <label class="field">
            <span class="field__label">Back</span>
            <textarea v-model="editBack" class="field__input" rows="2" required />
          </label>
          <div class="editor__buttons">
            <button type="submit" class="btn btn--primary">Save</button>
            <button type="button" class="btn btn--secondary" @click="cancelEdit">Cancel</button>
          </div>
        </form>
        <template v-else>
          <div class="editor__text">
            <p class="editor__front">{{ card.front }}</p>
            <p class="editor__back">{{ card.back }}</p>
          </div>
          <div class="editor__buttons">
            <button type="button" class="btn btn--small btn--secondary" @click="startEdit(card)">
              Edit<span class="visually-hidden"> card: {{ card.front }}</span>
            </button>
            <button type="button" class="btn btn--small btn--ghost" @click="emit('remove-card', card.id)">
              Delete<span class="visually-hidden"> card: {{ card.front }}</span>
            </button>
          </div>
        </template>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
@use '../styles/variables' as *;
@use '../styles/mixins' as *;

.editor {
  display: grid;
  gap: $space-3;
}

.editor__row {
  display: flex;
  align-items: flex-end;
  gap: $space-2;

  .field {
    flex: 1;
  }
}

.editor__new {
  display: grid;
  gap: $space-2;
  justify-items: start;

  .field {
    width: 100%;
  }
}

.editor__title {
  margin: 0;
  font-size: 1rem;
}

.editor__list {
  display: grid;
  gap: $space-2;
  margin: 0;
  padding: 0;
  list-style: none;
}

.editor__item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: $space-2;

  @include below($bp-small) {
    flex-direction: column;
  }
}

.editor__edit {
  display: grid;
  gap: $space-2;
  width: 100%;
}

.editor__text p {
  margin: 0;
  overflow-wrap: anywhere;
}

.editor__front {
  font-weight: 600;
}

.editor__back {
  color: $color-muted;
}

.editor__buttons {
  display: flex;
  gap: $space-1;
  flex-shrink: 0;
}
</style>
