<template>
    <form @submit.prevent="onSubmit">
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
form input {
    font-size: 120%;
    width: 7em;
}

select {
    font-size: 170%;
}
</style>

<script setup>
import {a, b, operator} from '../models';

function onSubmit(e) {

}
</script>