<template>
    <table>
        <thead>
            <tr v-for="i of range(3)" :key="i">
                <td v-for="j of abacus_digits.keys()"
                :class="{empty: (abacus_digits[j] >=10)?
                    (i===0):
                    (
                        (abacus_digits[j] >= 5)?(i===1):(i===2)
                    )}"
                :key="j"
                @click="() => { topBeadClicked(i, j); }">&#xFEFF;</td>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td v-for="j of abacus_digits.keys()"
                :class="`b${j}_${i}`" :key="j">{{ abacus_digits[j] }}</td>
            </tr>
        </tbody>
        <tfoot>
            <tr v-for="i of range(6)" :key="i">
                <td v-for="j of abacus_digits.keys()"
                :class="{empty: i === (abacus_digits[j] % 5)}"
                :key="j"
                @click="() => { bottomBeadClicked(i, j); }">&#xFEFF;</td>
            </tr>
        </tfoot>
    </table>
    <button @click="resetNumbers">Reset</button>
</template>

<script setup>
import {watch} from 'vue';

import {abacus_digits, precision} from '../models';
import { resetNumbers } from '../models';

function range(n) {
    return Array(n).keys();
}

watch(precision, (new_precision) => {
    const current_precision = abacus_digits.value.length + 0;
    abacus_digits.value.length = new_precision;

    if (precision <= current_precision) {
        return;
    }

    for (let i = current_precision; i < new_precision; i++) {
        abacus_digits.value[i] = 0;
    }
})

function topBeadClicked(i, j) {
    const current_value = abacus_digits.value[j];
    switch (i) {
        case 0:
            abacus_digits.value[j] = (current_value % 5) + 10;
            return;
        case 1:
            abacus_digits.value[j] = (current_value % 5) + 5;
            return;
        case 2:
            abacus_digits.value[j] = current_value % 5;
            return;
    }
}

function bottomBeadClicked(i, j) {
    const current_value = abacus_digits.value[j];
    if (current_value === 14 && i === 5) {
        // Value 15 is rarely used except during square root operation.
        return;
    }

    if (current_value >= 10) {
        abacus_digits.value[j] = 10 + i;
        return;
    }

    if (current_value >= 5) {
        abacus_digits.value[j] = 5 + i;
        return;
    }

    abacus_digits.value[j] = i;
}
</script>

<style>
table {
font-size:27px;
line-height:1em;
background-color: yellow;
border: solid 10px brown;
}

td {
width:48px;
height:1em;
background:url(../bead.gif) no-repeat center bottom;
margin:0;
padding:0;
}

td.empty {
background-position:center top;
}
td.active {
background-color:blue;
}

tbody tr td {
font-size:12pt;
background-color:brown;
background-image:none;
color:#FFF;
text-align:center;
}
</style>