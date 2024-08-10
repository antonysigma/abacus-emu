import {getNumber, is_overflow, precision, setNumber} from '../models';

import {plus} from './addition';
import {appendInstruct, queueStep} from './job_queue';
import {default_mode, mode_t} from './utils';

const times1 = new Array(9);
times1[0] = ['一一得一 1*1=1'];
times1[1] = ['一二得二 1*2=2', '二二得四 2*2=4'];
times1[2] = ['一三得三 1*3=3', '二三得六 2*3=6', '三三得九 3*3=9'];
times1[3] = ['一四得四 1*4=4', '二四得八 2*4=8', '三四一十二 3*4=12', '四四一十六 4*4=16'];
times1[4] = [
    '一五得五 1*5=5', '二五一十 2*5=10', ' 三五一十五 3*5=15', '四五二十 4*5=20',
    ' 五五二十五 5*5=25'
];
times1[5] = [
    '一六得六 1*6=6', '二六一十二 2*6=12', '三六一十八 3*6=18', '四六二十四 4*6=24',
    '五六三十 5*6=30', ' 六六三十六 6*6=36'
];
times1[6] = [
    '一七得七 1*7=7', '二七一十四 2*7=14', '三七二十一 3*7=21', '四七二十八 4*7=28',
    '五七三十五 5*7=35', '六七四十二 6*7=42', '七七四十九 7*7=49'
];
times1[7] = [
    '一八得八 1*8=8', '二八一十六 2*8=16', '三八二十四 3*8=24', '四八三十二 4*8=32',
    '五八四十 5*8=40', ' 六八四十八 6*8=48', '七八五十六 7*8=56', '八八六十四 8*8=64'
];
times1[8] = [
    '一九得九 1*9=9', '二九一十八 2*8=18', '三九二十七 3*9=27', '四九三十六 4*9=36',
    '五九四十五 5*9=45', '六九五十四 6*9=54', '七九六十三 7*9=63', '八九七十二 8*9=72',
    '九九八十一 9*9=81'
];

function times(j: number, a: number, d: number, mode: mode_t = default_mode) {
    // skip zero digit
    if (d === 0 || a === 0) {
        return;
    }

    const prod = a * d;

    if (mode.show_stroke) {
        if (a > d) {
            appendInstruct(times1[a - 1][d - 1]);
        } else {
            appendInstruct(times1[d - 1][a - 1]);
        }

        // add operation to queue
        const digits = precision.value;
        const new_mode = {show_stroke: false, flag_replace: mode.flag_replace};
        queueStep(() => {
            if (j + 1 <= digits) {
                if (new_mode.flag_replace) {
                    // overwrite the original digit
                    setNumber(j, Math.floor(prod / 10));
                } else {
                    plus(j, Math.floor(prod / 10), new_mode);
                }
                plus(j + 1, prod % 10, new_mode);
            } else {
                is_overflow.value = true;
            }
        });
    }
}

export {times};