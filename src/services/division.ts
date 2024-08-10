import {getNumber, is_overflow, precision, setNumber} from '../models';

import {plus} from './addition';
import {minus} from './subtraction';
import {appendInstruct, queueStep} from './job_queue';
import {default_mode, mode_t} from './utils';

const divide1 = new Array(9);
divide1[0] = ['逢一進一','逢二進二','逢三進三','逢四進四','逢五進五','逢六進六','逢七進七','逢八進八','逢九進九'];
divide1[1] = ['逢二進一','逢四進二','逢六進三','逢八進四'];
divide1[2] = ['逢三進一','逢六進二'];
divide1[3] = ['逢四進一','逢八進二'];
divide1[4] = ['逢五進一'];
divide1[5] = ['逢六進一'];
divide1[6] = ['逢七進一'];
divide1[7] = ['逢八進一'];
divide1[8] = ['逢九進一'];

const divide2 = new Array(9);
divide2[1] = ['二一添作五'];
divide2[2] = ['三一三十一', '三二六十二'];
divide2[3] = ['四一二十二','四二添作五','四三七十二'];
divide2[4] = ['五一添作二','五二添作四','五三添作六','五四添作八'];
divide2[5] = ['六一下加四','六二三十二','六三添作五','六四六十四','六五八十二'];
divide2[6] = ['七一下加七','七二下加六','七三四十二','七四五十五','七五七十一','七六八十二'];
divide2[7] = ['八一下加二','八二下加四','八三下加六','八四添作五','八五六十二','八六七十四','八七八十六'];
divide2[8] = ['九一下加一','九二下加二','九三下加三','九四下加四','九五下加五','九交下加六','九七下加七','九八下加八'];

const divide3 = ['見一無除作九一','見二無除作九二','見三無除作九三','見四無除作九四','見五無除作九五','見六無除作九六','見七無除作九七'];
const divide4 = ['借一還一','借一還二','借一還三','借一還四','借一還五','借一還六','借一還七','借一還八','借一還九'];

function divide_by(
    j: number, a: number, b: number, right_operand_precision: number, mode: mode_t = default_mode) {
    //skip zero digit
    if (a === 0 || b === 0) {
        return;
    }
    if (a >= b)
    {
        return divide_by(j-1,a/10, b, right_operand_precision, mode);
    }

    const digits = precision.value;

    const new_mode= {show_stroke: false, flag_replace: mode.flag_replace};

    // Find the first digits
     const x = Math.floor(a*10);
     const d = Math.floor(b*10);

    // Estimate the quotient
     const quo = Math.floor(x*10/d);

    // Compute the true quotient
    const true_quo = Math.floor(a*10/b);

    if (quo >= 10) {
        // Todo: avoid using true quotient
        const q = Math.floor(quo/10);

        appendInstruct(divide1[d - 1][q - 1]);
        queueStep(function () {
            minus(j, q*d, new_mode);
            plus(j-1, q, new_mode);
        });
    }
    else if (Math.floor(a*10) > 0)
    {
        const reminder = x*10 - quo * d;

        appendInstruct(divide2[d - 1][x - 1]);

        queueStep(function () {
            setNumber(j, quo);
            setNumber(j + 1, reminder + getNumber(j+1));
        });
    }

    const quo_diff = true_quo - quo;
    if (true_quo > quo)
    {
    // Underestimated quotient
        if(quo_diff*d <= 9) {
            appendInstruct(divide1[d - 1][quo_diff - 1]);
        } else {
            appendInstruct(`Repeat "${divide1[d - 1][0]}" by ${quo_diff} times`);
        }

        queueStep(function () {
            minus(j+1, quo_diff*d, new_mode);
            plus(j, quo_diff, new_mode);
        });
    }
    else if (true_quo < quo)
    {
    // Overestimated quotient
        const quo_diff_flipped = quo_diff * -1;
        if (quo_diff_flipped > 1) {
            appendInstruct(`Repeat "${divide4[d - 1]}" by ${quo_diff_flipped} times`);
        } else {
            appendInstruct(divide4[d - 1]);
        }

        queueStep(function () {
            plus(j+1, quo_diff_flipped*d, new_mode);
            minus(j, quo_diff_flipped, new_mode);
        });

    }

    // Long division
    if (true_quo > 0 && Math.log10(b - d/10) > - digits)
    {
        let y = Math.round( (b-d/10) * Math.pow(10, digits) ) / Math.pow(10, digits-1);

        const roundoff_precision = right_operand_precision - 1;
        appendInstruct(`Subtract by ${y.toFixed(roundoff_precision)} * ${true_quo} = ${(y*true_quo).toFixed(roundoff_precision)}`);

        y *= true_quo;
        //for (let k=j+1; k<digits || Math.log10(y)>-digits; k++)
        // BUG: round off error when number = 0.3999999
        for (let k=j+1; k<digits; k++)
        {
            let r = Math.floor(y);
            if (r > 0)
                queueStep(function () {
                    minus(k, r, new_mode);
                });
            y = (y-r) * 10;
        }
    }

    // Recursion
    if (true_quo >= 10)
    {
        // Bug: round off error
        const remainder = a*10-Math.floor(true_quo/10)*10*b;
        if(j+1 < digits) // && reminder * Math.pow(10, digits) > 0)
        {
            divide_by(j+1, remainder, b, right_operand_precision, mode);
        }
    }
    else
    {
        const remainder = a*10-true_quo*b;
        if(j+1 < digits) // && reminder * Math.pow(10, digits) > 0)
        {
            divide_by(j+1, remainder, b, right_operand_precision, mode);
        }
    }
}

export {divide_by};