---
name: answer-checker
description: Guidelines and patterns for implementing interactive answer checking inputs with DaisyUI input-group structure in Svelte.
---

# Answer Checker Skill Guide

## Component Overview
Use the `AnswerChecker` component (`src/lib/components/AnswerChecker.svelte`) whenever rendering text or number inputs paired with a submit button for exercise or puzzle answer checking.

## Usage Pattern

```svelte
<script lang="ts">
  import AnswerChecker from '$lib/components/AnswerChecker.svelte';

  let userAnswer = '';

  function handleCheck() {
    console.log('Submitted:', userAnswer);
  }
</script>

<AnswerChecker
  bind:value={userAnswer}
  placeholder="พิมพ์คำตอบที่นี่..."
  buttonText="ตรวจคำตอบ"
  btnClass="btn-primary text-primary-content"
  on:submit={handleCheck}
/>
```

## Key Rules
1. **Input Group Wrapper**: Always wrap `<input>` and `<button>` inside a DaisyUI `<div class="input-group">` container inside `<form class="form-control">`.
2. **Theme Contrast**: Use `bg-base-100 text-base-content` for inputs and `btn-primary text-primary-content` for submit buttons. Never hard-code dark backgrounds or white text; follow the active theme.
3. **Responsive Sizing**: Support `size="sm"`, `size="md"`, or `size="lg"`.
