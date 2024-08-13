import {appendInstruct, getNumber, is_overflow, precision, resetInstruct, resetNumbers, setNumber} from '../models';

import {plus} from './addition';
import {queueStep} from './job_queue';
import {default_mode, mode_t} from './utils';
import {validateOperands} from './validate';

function minus(a: number, b: number, minus_flag: boolean, mode: mode_t = default_mode): boolean {
    return false;
}
function times(j: number, ai: number, b: number, mode: mode_t = default_mode) {}
function divide_by(
    j: number, a: number, b: number, right_operand_precision: number, mode: mode_t = default_mode) {
}

function initNumber(a: string, precision_value:number, pad_left: boolean) {
    const ascii_zero = '0'.charCodeAt(0);

    appendInstruct('Populate abacus with left operand');
    for (let j = 0; j < precision_value && j < a.length; j++) {
        const d = a.charCodeAt(j) - ascii_zero;
        setNumber(pad_left ? j : (j + precision_value - a.length), d);
    }
}

function dispatchCalculation(a: string, b: string, operator: string) {
    let is_valid = false;
    [is_valid, a, b] = validateOperands(a, b, operator);
    if (!is_valid) return;

    const precision_value = precision.value;
    const ascii_zero = '0'.charCodeAt(0);

    resetInstruct();
    is_overflow.value = false;
    resetNumbers();

    switch (operator) {
        case 'plus':
            // show a on the right side of abacus
            initNumber(a, precision_value, false);

            for (let j = precision_value - b.length; j < precision_value; j++) {
                const d = b.charCodeAt(j - precision_value + b.length) - ascii_zero;
                plus(j, d);
            }
            break;
        case 'minus':
            // show a on the right side of abacus
            initNumber(a, precision_value, false)

            let minus_flag = false;
            for (let j = precision_value - b.length; j < precision_value; j++) {
                const d = b.charCodeAt(j - precision_value - 1 + b.length) - ascii_zero;
                minus_flag = minus(j, d, minus_flag);
            }
            queueStep(function() {
                if (!minus_flag) {
                    return;
                }
                // negative number
                appendInstruct('(負數)向左還一 10\'s complement');
                queueStep(function() {
                    let j = 0;
                    for (; j < precision_value - 1; j++) {
                        setNumber(j, 9 - getNumber(j));
                    }
                    setNumber(j, 10 - getNumber(j));
                    $(this).dequeue();
                });
                $(this).dequeue();
            });
            break;
        case 'times':
            // show a on the left side of abacus
            initNumber(a, precision_value, true);

            // times b digit by digit
            {
                for (let j = a.length - 1; j >= 0; j--) {
                    // take out last digit from a and remove it from the suanpan
                    const a_i = getNumber(j);
                    if (a_i === 0) {
                        continue;
                    }
                    times(j, a_i, b.charCodeAt(0) - ascii_zero, {
                        show_stroke: true,
                        flag_replace: true,
                    });

                    for (let i = 1; i < b.length; i++) {
                        if (i + j > precision_value) {
                            is_overflow.value = true;
                            continue;
                        }
                        times(j + i, a_i, b.charCodeAt(i) - ascii_zero, {
                            show_stroke: true,
                            flag_replace: false,
                        });
                    }
                }
            }
            break;
        case 'divide by':
            // show a on the left side of abacus
            initNumber(a, precision_value, true);

            divide_by(2, parseFloat('0.' + a), parseFloat('0.' + b), b.length, {
                show_stroke: true,
                flag_replace: false,
            });
    }  // end_switch

    appendInstruct('End of instructions.');
}

export {dispatchCalculation};