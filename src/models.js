import {ref} from 'vue';

const speed = ref(500);
const precision = ref(7);

const a = ref(123);
const b = ref(123);
const operator = ref('plus');

const abacus_digits = ref([
    1, 2, 3, 4, 5, 6, 0
])

const instruction_steps = ref([]);

export {speed, precision, a, b, operator, instruction_steps, abacus_digits};