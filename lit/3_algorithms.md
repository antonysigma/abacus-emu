# Algorithms

## Addition

```{.javascript #plus-commands}
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
```

```{.javascript #plus-algorithm}
function plus(j, d, type, instruct_view) {
    // skip zero digit
    if (d == 0) return;
    var a = getNumber(j);
    var sum = a + d;

    if (type == 'show') {
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
        if (sum >= 10)
            instruct_view.queue(function() {
                setNumber(j, sum - 10);
                if (j - 1 >= 1)
                    plus(j - 1, 1);
                else
                    overflow();
                $(this).dequeue();
            });
        else
            instruct_view.queue(function() {
                setNumber(j, sum);
                $(this).dequeue();
            });
    }
    // do operation immediately
    else {
        if (sum >= 10) {
            setNumber(j, sum - 10);
            if (j - 1 >= 1)
                plus(j - 1, 1);
            else
                overflow();
        } else
            setNumber(j, sum);
    }
}
```

## Subtraction

There are two possible ways to compute subtraction. One way is to use 10's complement to invert the digits of the number.
Another ways is to implement the direct subtraction algorithm. This is equivalent to the rivary between CISC and RISC in computer engineering history.

```{.javascript #minus-command}
var minus1 = [
    '一去一 minus 1', '二去二 minus 2', '三去三 minus 3', '四去四 minus 4', '五去五 minus 5',
    '六去六 minus 6', '七去七 minus 1', '八去八 minus 8', '九去九 minus 9'
];
var minus2 = [
    '一上四去五 add 4 minus 5', '二上三去五 add 3 minus 5', '三上二去五 add 2 minus 5',
    '四上一去五 add 1 minus 5'
];
var minus3 = [
    '一借一還九 minus 10 add 9', '二借一還八 minus 10 add 8', '三借一還七 minus 10 add 7',
    '四借一還六 minus 10 add 6', '五借一還五 minus 10 add 5', '六借一還四 minus 10 add 4',
    '七借一還三 minus 10 add 3', '八借一還二 minus 10 add 2', '九借一還一 minus 10 add 1'
];
var minus4 = [
    '六借一還五去一 minus 10 add 5 minus 1', '七借一還五去二 minus 10 add 5 minus 2',
    '八借一還五去三 minus 10 add 5 minus 3', '九借一還五去四 minus 10 add 5 minus 4'
];

```

```{.javascript #minus-algorithm}
function minus(j, d, type) {
    // skip zero digit
    if (d == 0) return;
    var a = getNumber(j);
    var diff = a - d + 10;

    if (type == 'show') {
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
                setNumber(j, diff);
                if (j - 1 >= 1)
                    minus(j - 1, 1);
                else {
                    overflow();
                    // special because the number can be restored
                    minusflag = 1;
                }
                $(this).dequeue();
            });
        else
            instruct_view.queue(function() {
                setNumber(j, diff - 10);
                $(this).dequeue();
            });
    }
    // do operation immediately
    else {
        if (diff < 10) {
            setNumber(j, diff);
            if (j - 1 >= 1)
                minus(j - 1, 1);
            else {
                overflow();
                // special because the number can be restored
                minusflag = 1;
            }
        } else
            setNumber(j, diff - 10);
    }
}
```
