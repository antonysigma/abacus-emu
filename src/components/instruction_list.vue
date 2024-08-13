<template>
    <div>
        <li v-for="[index, inst] of instruction_steps.entries()" :key="index">{{ inst }}</li>
    </div>
</template>

<script setup>
import {instruction_steps} from '../models';
</script>