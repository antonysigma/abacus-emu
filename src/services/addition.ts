import {getNumber, is_overflow, setNumber} from '../models';
import {default_mode, mode_t} from './utils';
import { queueStep, appendInstruct } from './job_queue';

const plus1 = [
    '一上一 add 1', '二上二 add 2', '三上三 add 3', '四上四 add 4', '五上五 add 5', '六上六 add 6',
    '七上七 add 7', '八上八 add 8', '九上九 add 9'
];
const plus2 = [
    '一下五去四 add 5 minus 4', '二下五去三 add 5 minus 3', '三下五去二 add 5 minus 1',
    '四下五去一 add 5 minus 1'
];
const plus3 = [
    '一去九進一 minus 9 carry out 1', '二去八進一 minus 8 carry out 1',
    '三去七進一 minus 7 carry out 1', '四去六進一 minus 6 carry out 1',
    '五去五進一 minus 5 carry out 1', '六去四進一 minus 4 carry out 1',
    '七去三進一 minus 3 carry out 1', '八去二進一 minus 2 carry out 1',
    '九去一進一 minus 1 carry out 1'
];
const plus4 = [
    '六上一去五進一 add 1 minus 5 carry out 1', '七上二去五進一 add 2 minus 5 carry out 1',
    '八上三去五進一 add 3 minus 5 carry out 1', '九上四去五進一 add 4 minus 5 carry out 1'
];

function plus(j: number, d: number, mode: mode_t = default_mode) {
    // skip zero digit
    if (d === 0) return;
    const a = getNumber(j);
    const sum = a + d;

    if (!mode.show_stroke) {
        // do operation immediately
        if (sum >= 10) {
            setNumber(j, sum - 10);
            if (j - 1 >= 1)
                plus(j - 1, 1, mode);
            else
                is_overflow.value = true;
        } else
            setNumber(j, sum);
        return;
    }

    // show_stroke == True
    if (d < 5) {
        if (sum >= 10)
            appendInstruct(plus3[d - 1]);
        else if (a < 5 && sum >= 5)
            appendInstruct(plus2[d - 1]);
        else
            appendInstruct(plus1[d - 1]);
    } else if (d === 5) {
        if (sum < 10)
            appendInstruct(plus1[d - 1]);
        else
            appendInstruct(plus3[d - 1]);
    } else {
        if (sum < 10)
            appendInstruct(plus1[d - 1]);
        else if (a >= 5 && sum < 15)
            appendInstruct(plus4[d - 6]);
        else
            appendInstruct(plus3[d - 1]);
    }
    // add operation to queue
    if (sum >= 10) {
        queueStep(() => {
            setNumber(j, sum - 10);
            if (j >= 1) {
                // Carry-out
                plus(j - 1, 1, {show_stroke: false, flag_replace: mode.flag_replace});
            } else {
                is_overflow.value = true;
            }
        });
    } else {
        queueStep(() => {
            setNumber(j, sum);
        });
    }
}

export {plus};