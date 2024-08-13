<template>
    <ol>
        <li v-for="[index, inst] of instruction_steps.entries()" :key="index">{{ inst }}</li>
    </ol>
</template>

<script setup>
import {instruction_steps} from '../models';
</script>