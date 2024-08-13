<template>
    <form @submit.prevent="onSubmit" id="keypad">
        <input maxlength="10" id="a" v-model="a"/>
        <select v-model="operator">
            <option value="plus">&plus;</option>
            <option value="minus">&minus;</option>
            <option value="times">&times;</option>
            <option value="divide by">&#x00F7;</option>
        </select>
        <input maxlength="10" id="b" v-model="b" />
        <input value="Execute" type="submit"/>
    </form>
</template>

<style>
#keypad input {
    font-size: 120%;
    width: 7em;
}

#keypad select {
    font-size: 170%;
}
</style>

<script setup>
import {a, b, operator} from '../models';
import { dispatchCalculation } from '../services/dispatch';

function onSubmit(e) {
    dispatchCalculation(a.value, b.value, operator.value);
}
</script>