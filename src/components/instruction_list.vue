<template>
    <div>
        <li v-for="{inst, index} in instruction_list" :key="index">{{ inst }}</li>
    </div>
</template>

<script setup>
import {instruction_steps} from '../models';
</script>