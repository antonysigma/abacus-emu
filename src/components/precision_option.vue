<template>
<div>
    Precision: <select v-model="precision" :disabled="is_running">
        <option :value="7">7</option>
        <option :value="13" selected="selected">13</option>
        <option :value="20">20</option>
    </select>
</div>
</template>

<script setup>
import {precision, is_running} from '../models';
</script>