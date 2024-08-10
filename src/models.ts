import {ref} from 'vue';

const speed = ref(500);
const precision = ref(7);

const a = ref('355');
const b = ref('113');
const operator = ref('divide by');

const is_overflow = ref(false);
const is_10s_complement = ref(false);
const is_running = ref(false);

const abacus_digits = ref([1, 2, 3, 4, 5, 6, 7]);

const instruction_steps = ref([]);

function getNumber(j: number) {
    if (j >= abacus_digits.value.length) {
        // zero or null?
        return 0;
    }
    return abacus_digits.value[j];
}

function setNumber(j: number, x: number) {
    if (j >= abacus_digits.value.length) {
        return;
    }
    abacus_digits.value[j] = x;
}

function resetNumbers() {
    abacus_digits.value.fill(0);
}

function resetInstruct() {
    instruction_steps.value.length = 0;
}

export {
    speed,
    precision,
    a,
    b,
    operator,
    instruction_steps,
    abacus_digits,
    getNumber,
    setNumber,
    resetNumbers,
    is_overflow,
    is_10s_complement,
    is_running,
    resetInstruct,
};