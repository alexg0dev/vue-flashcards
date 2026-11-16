import { newCard, createId } from './scheduler.js'

// Two starter decks so the app is not empty on first visit.
export function sampleDecks() {
  return [
    {
      id: createId(),
      name: 'Web basics',
      cards: [
        ['What does HTML stand for?', 'HyperText Markup Language'],
        ['Which CSS property sets the space inside an element\'s border?', 'padding'],
        ['What does AJAX let a page do?', 'Request data from a server without reloading the page'],
        ['Which HTTP method is normally used to create a resource in a REST API?', 'POST'],
        ['What does git status show?', 'Changed, staged and untracked files in the working tree'],
      ].map(([front, back]) => newCard(front, back)),
    },
    {
      id: createId(),
      name: 'French verbs',
      cards: [
        ['to be', 'être'],
        ['to have', 'avoir'],
        ['to go', 'aller'],
        ['to do / to make', 'faire'],
      ].map(([front, back]) => newCard(front, back)),
    },
  ]
}
