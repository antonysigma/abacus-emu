# Instruction set

Just like the Harvard architecture of a typical digital computer, we store and
parse the instruction sets in a fast memory (the brain), separated from data
(the abacus).

We started with the additions. It can be as straight forward as encoding
`1+1=2`, except that the "finger stroke" is explicited taught to students at an
early age.

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
The instruction set for subtraction, in contrast, is not very common in modern
computers. It is more efficient on ASIC to convert the minus operation `2 - 1`
into an addition operation `2 + (-1)` with signed integer datatype with 10's complement.

Here, for the sake of preserving the ancient Chinese instruction set, I implemented the direct subtraction table here. Similar to the addition table, explicit "finger strokes" are taught to students.

```{.javascript #minus-commands}
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

```

Multiplication table, unlike others, are taught in both eastern and western
cultures. Unlike the addition and subtraction instruction set, the
multiplication table doesn't require an abacus to function.

```{.javascript #multiply-commands}
const times1 = new Array(9)
times1[0] = ['一一得一 1*1=1'];
times1[1] = ['一二得二 1*2=2', '二二得四 2*2=4'];
times1[2] = ['一三得三 1*3=3', '二三得六 2*3=6', '三三得九 3*3=9'];
times1[3] = ['一四得四 1*4=4', '二四得八 2*4=8', '三四一十二 3*4=12', '四四一十六 4*4=16'];
times1[4] = ['一五得五 1*5=5', '二五一十 2*5=10', ' 三五一十五 3*5=15', '四五二十 4*5=20', ' 五五二十五 5*5=25'];
times1[5] = ['一六得六 1*6=6', '二六一十二 2*6=12', '三六一十八 3*6=18', '四六二十四 4*6=24', '五六三十 5*6=30', ' 六六三十六 6*6=36'];
times1[6] = ['一七得七 1*7=7', '二七一十四 2*7=14', '三七二十一 3*7=21', '四七二十八 4*7=28', '五七三十五 5*7=35', '六七四十二 6*7=42', '七七四十九 7*7=49'];
times1[7] = ['一八得八 1*8=8', '二八一十六 2*8=16', '三八二十四 3*8=24', '四八三十二 4*8=32', '五八四十 5*8=40', ' 六八四十八 6*8=48', '七八五十六 7*8=56', '八八六十四 8*8=64'];
times1[8] = ['一九得九 1*9=9', '二九一十八 2*8=18', '三九二十七 3*9=27', '四九三十六 4*9=36', '五九四十五 5*9=45', '六九五十四 6*9=54', '七九六十三 7*9=63', '八九七十二 8*9=72', '九九八十一 9*9=81'];
```

Division table

```{.javascript #division-commands}
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

divide3 = ['見一無除作九一','見二無除作九二','見三無除作九三','見四無除作九四','見五無除作九五','見六無除作九六','見七無除作九七'];
divide4 = ['借一還一','借一還二','借一還三','借一還四','借一還五','借一還六','借一還七','借一還八','借一還九'];
```
