<template>
  <div>
    Speed:
    <label v-for="item in speed_settings" :key="item.name">
      <input type="radio" name="speed" :value="item.value" v-model="speed" />
      {{ item.name }}</label
    >
  </div>
</template>

<script setup>
import {speed} from '../models';

const speed_settings = [
    {name: 'Slow', value: 3000},
    {name: 'Fast', value: 500},
    {name: 'Lightning-fast', value: 50},
];
</script>
