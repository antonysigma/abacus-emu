<template>
    <form @submit.prevent="onSubmit">
        <input maxlength="10" id="a" v-model="a"/>
        <select v-model="operator">
            <option>plus</option>
            <option>minus</option>
            <option>times</option>
            <option>divide by</option>
        </select>
        <input maxlength="10" id="b" v-model="b" />
        <input value="Execute" type="submit"/>
    </form>
</template>

<script setup>
import {a, b, operator} from '../models';

function onSubmit(e) {

}
</script>