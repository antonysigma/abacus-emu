# Algorithms

## Addition

```{.javascript #plus-algorithm}
function plus(j, d, args) {
    const instruct_view = args.instruct_view;
    const abacus_view = args.abacus_view;
    const show_stroke = args.show_stroke;


    // skip zero digit
    if (d == 0) return;
    var a = abacus_view.getNumber(j);
    var sum = a + d;

    if (show_stroke) {
        if (d < 5) {
            if (sum >= 10)
                instruct_view.append(plus3[d - 1]);
            else if (a < 5 && sum >= 5)
                instruct_view.append(plus2[d - 1]);
            else
                instruct_view.append(plus1[d - 1]);
        } else if (d == 5) {
            if (sum < 10)
                instruct_view.append(plus1[d - 1]);
            else
                instruct_view.append(plus3[d - 1]);
        } else {
            if (sum < 10)
                instruct_view.append(plus1[d - 1]);
            else if (a >= 5 && sum < 15)
                instruct_view.append(plus4[d - 6]);
            else
                instruct_view.append(plus3[d - 1]);
        }
        // add operation to queue
        if (sum >= 10) {
            instruct_view.queue(function() {
                abacus_view.setNumber(j, sum - 10);
                if (j - 1 >= 1) {
                    // Carry-out
                    var new_args = args;
                    args.show_stroke = false;
                    plus(j - 1, 1, args);
                } else {
                    overflow();
                }
                $(this).dequeue();
            });
        } else {
            instruct_view.queue(function() {
                abacus_view.setNumber(j, sum);
                $(this).dequeue();
            });
        }
    }
    // do operation immediately
    else {
        if (sum >= 10) {
            abacus_view.setNumber(j, sum - 10);
            if (j - 1 >= 1)
                plus(j - 1, 1, args);
            else
                overflow();
        } else
            abacus_view.setNumber(j, sum);
    }
}
```

## Subtraction

There are two possible ways to compute subtraction. One way is to use 10's complement to invert the digits of the number.
Another ways is to implement the direct subtraction algorithm. This is equivalent to the rivary between CISC and RISC in computer engineering history.

```{.javascript #minus-algorithm}
function minus(j, d, args) {
    const instruct_view = args.instruct_view;
    const abacus_view = args.abacus_view;
    const show_stroke = args.show_stroke;

    // skip zero digit
    if (d == 0) return;
    var a = abacus_view.getNumber(j);
    var diff = a - d + 10;

    if (show_stroke) {
        if (d < 5) {
            if (diff < 10)
                instruct_view.append(minus3[d - 1]);
            else if (a >= 5 && diff < 15)
                instruct_view.append(minus2[d - 1]);
            else
                instruct_view.append(minus1[d - 1]);
        } else if (d == 5) {
            if (diff >= 10)
                instruct_view.append(minus1[d - 1]);
            else
                instruct_view.append(minus3[d - 1]);
        } else {
            if (diff >= 10)
                instruct_view.append(minus1[d - 1]);
            else if (a < 5 && diff >= 5)
                instruct_view.append(minus4[d - 6]);
            else
                instruct_view.append(minus3[d - 1]);
        }
        // add operation to queue
        if (diff < 10)
            instruct_view.queue(function() {
                abacus_view.setNumber(j, diff);
                if (j - 1 >= 1)
                    minus(j - 1, 1, args);
                else {
                    overflow();
                    // special because the number can be restored
                    abacus_view.minus_flag = true;
                }
                $(this).dequeue();
            });
        else
            instruct_view.queue(function() {
                abacus_view.setNumber(j, diff - 10);
                $(this).dequeue();
            });
    }
    // do operation immediately
    else {
        if (diff < 10) {
            setNumber(j, diff);
            if (j - 1 >= 1)
                minus(j - 1, 1, args);
            else {
                overflow();
                // special because the number can be restored
                abacus_view.minusflag = true;
            }
        } else
            setNumber(j, diff - 10);
    }
}
```

## Overall handler

```{.javascript #execute}
function execute(a, b, operator, args) {
    const instruct_view = args.instruct_view;
    const abacus_view = args.abacus_view;
    const precision = args.precision;

    // Reset the abacus
    abacus_view.reset();

    // stage 1 processing
    // align decimal points
    var new_ab = align_decimals(a, b);
    a = new_ab[0];
    b = new_ab[1];

    switch (operator) {
        case 'plus':
        case 'minus':

            if (check_overflow(a, precision) || check_overflow(b, precision)) {
                overflow();
                return false;
            }
            break;
        case 'times':
        case 'divide':
            // trailing zeros are meaningless
            var re3 = new RegExp('^(\\d*[1-9])0*$', 'i');
            a = a.replace(re3, function(x, y) {
                return y;
            });
            b = b.replace(re3, function(x, y) {
                return y;
            });
            // stop operation if number is too long
            if (check_overflow(a, precision) || check_overflow(b, precision)) {
                overflow();
                return false;
            }
    }

    // stage 2
    switch (operator) {
        case 'plus':
            // show a on the right side of abacus
            instruct_view.append('Populate abacus with left operand');
            var no = a.split('').reverse();
            for (var j = precision; j >= 1 && (precision - j) < no.length; j--) {
                var d = no[precision - j] - '0';
                abacus_view.setNumber(j, d);
            }

            var no = b.split('');
            for (var j = precision - b.length + 1; j <= precision; j++) {
                var d = no[j - precision - 1 + b.length] - '0';
                plus(j, d, args);
            }
            break;
        case 'minus':
            // show a on the right side of abacus
            instruct_view.append('Populate abacus with left operand');
            var no = a.split('').reverse();
            for (var j = precision; j >= 1 && (precision - j) < no.length; j--) {
                var d = no[precision - j] - '0';
                abacus_view.setNumber(j, d);
            }

            abacus_view.minusflag = false;
            var no = b.split('');
            for (var j = precision - b.length + 1; j <= precision; j++) {
                var d = no[j - precision - 1 + b.length] - '0';
                minus(j, d, args);
            }
            instruct_view.queue(function() {
                if (!abacus_view.minus_flag) return;
                // negative number
                instruct_view.append('(負數)向左還一 10\'s complement');
                instruct_view.queue(function() {
                    for (var j = 1; j <= precision - 1; j++) abacus_view.setNumber(j, 9 - getNumber(j));
                    abacus_view.setNumber(j, 10 - getNumber(j));
                    $(this).dequeue();
                });
                $(this).dequeue();
            });
            break;
        case 'times':
            // show a on the left side of abacus
            instruct_view.append('Populate abacus with left operand');
            var no = a.split('');
            for (var j = 1; j <= precision && j <= no.length; j++) {
                var d = no[j - 1];
                abacus_view.setNumber(j, d);
            }

            // times b digit by digit
            var no = b.split('').reverse();
            var a_i;
            for (var j = a.length; j >= 1; j--) {
                // take out last digit from a and remove it from the suanpan
                a_i = getNumber(j);
                if (a_i == 0) continue;
                times(j, a_i, b[0], 'show', true);

                for (i = 1; i < b.length; i++) {
                    if (i + j > precision) {
                        overflow();
                        continue;
                    }
                    times(j + i, a_i, b[i], 'show');
                }
            }
            break;
        case 'divide by':
            // show a on the left side of abacus
            instruct_view.append('Populate abacus with left operand');
            var no = a.split('');
            for (var j = 2; j <= precision && j - 1 <= no.length; j++) {
                var d = no[j - 2];
                abacus_view.setNumber(j, d);
            }


            divide_by(2, parseFloat('0.' + a), parseFloat('0.' + b));

            // var x = parseFloat('0.'+a);
            // var d = parseFloae('0,'+b);
            // for(var j = 2; j< precision - 1; j++) {
            //    if (Math.log10(x) < -precision)
            //        break;

            //    divide_by(j,x,d);

            //    var true_quo = x*10 - d;
            //    x = x*10 - true_quo*d;
            //}

    }  // end_switch

    instruct_view.append('End of instructions.');
}
```

## Helper functions

Addition and subtractions prefers a fixed point decimal datatype. Here, we align the decimal places to the operands:
```{.javascript #align-decimal}
function align_decimals(a, b) {
    if (a.indexOf('.') == -1 && b.indexOf('.') == -1) return [a, b];
    var afrac = (a.indexOf('.') == -1) ? 1 : (a.length - a.indexOf('.'));
    var bfrac = (b.indexOf('.') == -1) ? 1 : (b.length - b.indexOf('.'));
    if (afrac < bfrac) {
        // append 0 to a
        for (var i = afrac; i < bfrac; i++) a += '0';
    } else {
        // append 0 to b
        for (var i = bfrac; i < afrac; i++) b += '0';
    }
    var re2 = new RegExp('^0*([1-9]?\\d*)\\.(\\d+)$', 'i');
    a = a.replace(re2, function(x, y, z) {
        return y + z;
    });
    b = b.replace(re2, function(x, y, z) {
        return y + z;
    });
    // remove leading zeros
    var re3 = new RegExp('^0*([1-9]\\d*)$', 'i');
    a = a.replace(re3, function(x, y) {
        return y;
    });
    b = b.replace(re3, function(x, y) {
        return y;
    });
    return [a, b];
}
```

Check whether the entered number is higher than the abacus precision limit.
```{.javascript #check-overflow}
function check_overflow(a, precision) {
    if (a.length > precision) return true;
    return false;
}
```