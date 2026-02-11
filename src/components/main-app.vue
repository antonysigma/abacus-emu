<template>
  <h1>Abacus emulator</h1>
  <p>
  <SpeedOption />
  <PrecisionOption />
  <BeadShape />
  </p>
  <Abacus />
  <OverflowWarning />
  <Keypad />
  <InstructionList />
</template>

<style>
#app {
  width: min(50rem, 100%);
  margin: 0 auto;
}

body {
  font-family: sans-serif;
}
</style>

<script setup>
import Abacus from 'abacus.vue';
import InstructionList from 'instruction_list.vue';
import Keypad from 'keypad.vue';
import PrecisionOption from 'precision_option.vue';
import SpeedOption from 'speed_option.vue';

import OverflowWarning from './overflow_warning.vue';
import BeadShape from './bead_shape.vue';
</script>
