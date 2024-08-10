<template>
<div>
    Precision: <select v-model="precision">
        <option>7</option>
        <option selected="selected">13</option>
        <option>20</option>
    </select>
    <button>Change</button></div>
</template>

<script setup>
import {precision} from '../models';
</script>