<template>
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
  height: 50vh;
  overflow-y: scroll;
}
</style>
