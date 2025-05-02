<template>
    <label>Precision:
    <select v-model="precision" :disabled="is_running">
      <option :value="7">7</option>
      <option :value="13" selected="selected">13</option>
      <option :value="20">20</option>
    </select>
  </label>
</template>

<script setup>
import {is_running, precision} from '../models';
</script>
