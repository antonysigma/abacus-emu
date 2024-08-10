<template>
  <p class="overflow">Overflow: cannot guarantee correct results.</p>
</template>

<style>
.overflow {
  color: red;
  font-weight: bold;
  visibility: v-bind(is_overflow? "visible": "hidden");
}
</style>

<script setup>
import {is_overflow} from '../models';
</script>
