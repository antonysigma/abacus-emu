<template>
    <h1>Abacus emulator</h1>
    <SpeedOption/>
    <PrecisionOption/>
    <Abacus/>
    <OverflowWarning/>
    <Keypad/>
    <InstructionList/>
</template>

<script setup>
import SpeedOption from 'speed_option.vue';
import PrecisionOption from 'precision_option.vue';
import Abacus from 'abacus.vue';
import OverflowWarning from './overflow_warning.vue';
import Keypad from 'keypad.vue';
import InstructionList from 'instruction_list.vue';
</script>