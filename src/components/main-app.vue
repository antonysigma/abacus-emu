<template>
  <h1>Abacus emulator</h1>
  <SpeedOption />
  <PrecisionOption />
  <Abacus />
  <OverflowWarning />
  <Keypad />
  <InstructionList />
</template>

<script setup>
import Abacus from 'abacus.vue';
import InstructionList from 'instruction_list.vue';
import Keypad from 'keypad.vue';
import PrecisionOption from 'precision_option.vue';
import SpeedOption from 'speed_option.vue';

import OverflowWarning from './overflow_warning.vue';
</script>
