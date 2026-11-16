<script setup>
defineProps({
  front: { type: String, required: true },
  back: { type: String, required: true },
  flipped: { type: Boolean, default: false },
})
defineEmits(['flip'])
</script>

<template>
  <button
    type="button"
    class="flashcard"
    :class="{ 'flashcard--flipped': flipped }"
    :aria-label="flipped ? `Answer: ${back}. Press to show the question.` : `Question: ${front}. Press to show the answer.`"
    @click="$emit('flip')"
  >
    <span class="flashcard__inner">
      <span class="flashcard__face flashcard__face--front" :aria-hidden="flipped">
        <span class="flashcard__label">Question</span>
        <span class="flashcard__text" data-test="front">{{ front }}</span>
      </span>
      <span class="flashcard__face flashcard__face--back" :aria-hidden="!flipped">
        <span class="flashcard__label">Answer</span>
        <span class="flashcard__text" data-test="back">{{ back }}</span>
      </span>
    </span>
  </button>
</template>

<style scoped lang="scss">
@use '../styles/variables' as *;

.flashcard {
  display: block;
  width: 100%;
  min-height: 16rem;
  padding: 0;
  border: 0;
  background: none;
  perspective: 1200px;
  cursor: pointer;
  font: inherit;
  color: inherit;
  text-align: center;

  &:focus-visible {
    outline: 3px solid $color-focus;
    outline-offset: 4px;
    border-radius: $radius;
  }
}

.flashcard__inner {
  position: relative;
  display: block;
  min-height: 16rem;
  transition: transform 0.45s ease;
  transform-style: preserve-3d;

  .flashcard--flipped & {
    transform: rotateY(180deg);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

.flashcard__face {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $space-2;
  padding: $space-4;
  border: 1px solid $color-border;
  border-radius: $radius;
  background: $color-surface;
  box-shadow: $shadow;
  backface-visibility: hidden;

  &--back {
    transform: rotateY(180deg);
    background: $color-surface-alt;
  }
}

.flashcard__label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: $color-muted;
}

.flashcard__text {
  font-size: clamp(1.25rem, 3vw, 1.6rem);
  line-height: 1.4;
  overflow-wrap: anywhere;
}
</style>
