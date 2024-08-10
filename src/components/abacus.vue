<template>
  <table>
    <thead>
      <tr v-for="i of range(3)" :key="i">
        <td
          v-for="j of abacus_digits.keys()"
          :class="{
            empty:
              abacus_digits[j] >= 10
                ? i === 0
                : abacus_digits[j] >= 5
                  ? i === 1
                  : i === 2,
          }"
          :key="j"
          :id="`h${i}_${j}`"
          @click="
            () => {
              topBeadClicked(i, j);
            }
          "
        >
          &#xFEFF;
        </td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td v-for="j of abacus_digits.keys()" :key="j">
          {{ abacus_digits[j] }}
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr v-for="i of range(6)" :key="i">
        <td
          v-for="j of abacus_digits.keys()"
          :class="{ empty: i === abacus_digits[j] % 5 }"
          :key="j"
          :id="`f${i}_${j}`"
          @click="
            () => {
              bottomBeadClicked(i, j);
            }
          "
        >
          &#xFEFF;
        </td>
      </tr>
    </tfoot>
  </table>
  <button @click="resetNumbers" :disabled="is_running">Reset</button>
</template>

<script setup>
import debounce from 'lodash.debounce';
import {watch} from 'vue';

import {abacus_digits, is_running, precision, resetNumbers} from '../models';

function range(n) {
    return Array(n).keys();
}

watch(precision, (new_precision) => {
    const current_precision = abacus_digits.value.length + 0;
    abacus_digits.value.length = new_precision;

    if (new_precision <= current_precision) {
        return;
    }

    for (let i = current_precision; i < new_precision; i++) {
        abacus_digits.value[i] = 0;
    }
});

// Need to store the previous states due to debounce logic.
let old_digits = [];

// Highlight all moved beads.
watch(
    () => {
        return [...abacus_digits.value];
    },
    debounce(
        (new_digits) => {
            if (old_digits.length === 0) {
                old_digits.length = new_digits.length;
                old_digits.fill(0);
            }

            if (new_digits.length !== old_digits.length) {
                old_digits = new_digits;
                return;
            }

            document.querySelectorAll('td').forEach((element) => {
                element.classList.remove('active');
            });

            for (let j = 0; j < new_digits.length; j++) {
                const a = old_digits[j];
                const b = new_digits[j];

                if (a === b) {
                    continue;
                }

                // Highlight the moved head beads
                {
                    const _a = Math.floor(a / 5);
                    const _b = Math.floor(b / 5);
                    for (let i = 2 - Math.max(_a, _b); i <= 2 - Math.min(_a, _b); i++) {
                        document.querySelector(`#h${i}_${j}`).classList.add('active');
                    }
                }

                // Highlight the moved foot beads
                {
                    const _a = a % 5;
                    const _b = b % 5;
                    for (let i = Math.min(_a, _b); i < Math.max(_a, _b); i++) {
                        document.querySelector(`#f${i}_${j}`).classList.add('active');
                    }
                }
            }

            old_digits = new_digits;
        },
        30),
);

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
  font-size: 27px;
  line-height: 1em;
  border: solid 10px brown;
}

td {
  width: 48px;
  height: 1em;
  background: url(../bead.gif) no-repeat center bottom;
  background-color: yellow;
  margin: 0;
  padding: 0;
}

td.empty {
  background-position: center top;
}
td.active {
  background-color: blue;
}

tbody tr td {
  font-size: 12pt;
  font-family: sans-serif;
  font-weight: bold;
  background-color: brown;
  background-image: none;
  color: #fff;
  text-align: center;
}
</style>
