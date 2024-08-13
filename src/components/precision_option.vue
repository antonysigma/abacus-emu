<template>
<div>
    Precision: <select v-model="precision">
        <option :value="7">7</option>
        <option :value="13" selected="selected">13</option>
        <option :value="20">20</option>
    </select>
</div>
</template>

<script setup>
import {precision} from '../models';
</script>