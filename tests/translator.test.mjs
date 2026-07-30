import assert from 'node:assert/strict'
import test from 'node:test'
import { createLang } from '../dist/core/translator.js'

const lang = createLang(() => ({
  auth: {
    greeting: 'Hello, :name',
    legacyGreeting: 'Welcome, {name}',
    apples: '{0} No apples|{1} One apple|[2,*] :count apples'
  },
  'literal.key': 'Literal key value'
}))

test('translates nested keys and replaces placeholders', () => {
  assert.equal(lang.trans('auth.greeting', { name: 'Amit' }), 'Hello, Amit')
  assert.equal(lang.__('auth.legacyGreeting', { name: 'Amit' }), 'Welcome, Amit')
})

test('keeps unresolved placeholders and supports string replacements', () => {
  assert.equal(lang.trans('auth.greeting'), 'Hello, :name')
  assert.equal(lang.trans('auth.greeting', 'Amit'), 'Hello, :name Amit')
})

test('prioritizes literal-dot keys over nested traversal', () => {
  assert.equal(lang.trans('literal.key'), 'Literal key value')
  assert.equal(lang.trans('missing.key'), 'missing.key')
})

test('supports exact and interval pluralization', () => {
  assert.equal(lang.transChoice('auth.apples', 0), 'No apples')
  assert.equal(lang.transChoice('auth.apples', 1), 'One apple')
  assert.equal(lang.transChoice('auth.apples', 5), '5 apples')
  assert.equal(lang.trans_choice('auth.apples', 3), '3 apples')
})
