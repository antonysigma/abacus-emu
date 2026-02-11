<template>
  <h4>Assembly code listing</h4>
  <ol class="instruction_view">
    <li v-for="[index, inst] of instruction_steps.entries()" :key="index">
      {{ inst }}
    </li>
  </ol>
</template>

<script setup>
import {instruction_steps} from '../models';
</script>

<style>
.instruction_view {
  height: max(50vh, 20em);
  overflow-y: scroll;
  font-family: monospace;
}
.instruction_view li:nth-child(even) {
  background-color: #eee;
}
</style>
