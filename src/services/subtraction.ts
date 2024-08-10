import {getNumber, is_overflow, setNumber, is_10s_complement} from '../models';

import {appendInstruct, queueStep} from './job_queue';
import {default_mode, mode_t} from './utils';

const minus1 = [
    '一去一 minus 1', '二去二 minus 2', '三去三 minus 3', '四去四 minus 4', '五去五 minus 5',
    '六去六 minus 6', '七去七 minus 1', '八去八 minus 8', '九去九 minus 9'
];
const minus2 = [
    '一上四去五 add 4 minus 5', '二上三去五 add 3 minus 5', '三上二去五 add 2 minus 5',
    '四上一去五 add 1 minus 5'
];
const minus3 = [
    '一借一還九 minus 10 add 9', '二借一還八 minus 10 add 8', '三借一還七 minus 10 add 7',
    '四借一還六 minus 10 add 6', '五借一還五 minus 10 add 5', '六借一還四 minus 10 add 4',
    '七借一還三 minus 10 add 3', '八借一還二 minus 10 add 2', '九借一還一 minus 10 add 1'
];
const minus4 = [
    '六借一還五去一 minus 10 add 5 minus 1', '七借一還五去二 minus 10 add 5 minus 2',
    '八借一還五去三 minus 10 add 5 minus 3', '九借一還五去四 minus 10 add 5 minus 4'
];

function minus(j: number, d: number, mode: mode_t = default_mode) {
    // skip zero digit
    if (d === 0) return;
    const a = getNumber(j);
    const diff = a - d + 10;

    if (mode.show_stroke) {
        if (d < 5) {
            if (diff < 10)
                appendInstruct(minus3[d - 1]);
            else if (a >= 5 && diff < 15)
                appendInstruct(minus2[d - 1]);
            else
                appendInstruct(minus1[d - 1]);
        } else if (d === 5) {
            if (diff >= 10)
                appendInstruct(minus1[d - 1]);
            else
                appendInstruct(minus3[d - 1]);
        } else {
            if (diff >= 10)
                appendInstruct(minus1[d - 1]);
            else if (a < 5 && diff >= 5)
                appendInstruct(minus4[d - 6]);
            else
                appendInstruct(minus3[d - 1]);
        }
        // add operation to queue
        if (diff < 10) {
            queueStep(function() {
                setNumber(j, diff);
                if (j - 1 >= 0)
                    minus(j - 1, 1, {show_stroke:false, flag_replace:mode.flag_replace});
                else {
                    is_overflow.value = true;
                    // special because the number can be restored
                    is_10s_complement.value = true;
                    return;
                }
            });
        } else {
            queueStep(function() {
                setNumber(j, diff - 10);
            });
        }
    }

    // Else, do operation immediately
    const new_mode = {show_stroke: false, flag_replace: mode.flag_replace};
    if (diff < 10) {
        setNumber(j, diff);
        if (j - 1 >= 0) {
            minus(j - 1, 1, new_mode);
        } else {
            is_overflow.value = true;
            // special because the number can be restored
            is_10s_complement.value = true;
            return;
        }
    } else {
        setNumber(j, diff - 10);
    }
}

export {minus};