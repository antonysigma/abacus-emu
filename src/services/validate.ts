import {is_overflow, precision} from '../models';
import {alignDecimals, checkOverflow} from './utils';

function validateOperands(a: string, b: string, operator: string): [boolean, string, string] {
    const precision_value = precision.value;

    // stage 1 processing
    // align decimal points
    [a, b] = alignDecimals(a, b);

    switch (operator) {
        case 'plus':
        case 'minus':

            if (checkOverflow(a, precision_value) || checkOverflow(b, precision_value)) {
                is_overflow.value = true;
                return [false, a, b];
            }
            break;
        case 'times':
        case 'divide by':
            // trailing zeros are meaningless
            const re3 = /^(\\d*[1-9])0*$/i;
            a = a.replace(re3, (x, y) => {
                return y;
            });
            b = b.replace(re3, (x, y) => {
                return y;
            });
            // stop operation if number is too long
            if (checkOverflow(a, precision_value) || checkOverflow(b, precision_value)) {
                is_overflow.value = true;
                return [false, a, b];
            }
    }
    return [true, a, b];
}

export {validateOperands};