<template>
    <table>
        <thead>
            <tr v-for="i of range(3)" :key="i">
                <td v-for="j of abacus_digits.keys()"
                :class="{empty: (abacus_digits[j] >=5)?(i===1):(i===2)}" :key="j">&#xFEFF;</td>
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
                :class="{empty: i === (abacus_digits[j] % 5)}" :key="j">&#xFEFF;</td>
            </tr>
        </tfoot>
    </table>
    <button>Reset</button>
</template>

<script setup>
import { watch, computed } from 'vue';
import {precision, abacus_digits} from '../models';

function range(n) {
    return Array(n).keys();
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