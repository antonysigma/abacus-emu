import Backbone from 'backbone';

var digits = 7;

//================== Banners ========================
const OverflowView = Backbone.View.extend({
    el: '#overflow',
    flashMessage() {
        this.$el.show();
        this.$el.fadeOut(3000);
    }
});

const overflow_view = new OverflowView();

function overflow() {
    overflow_view.flashMessage();
}

const InvalidView = Backbone.View.extend({
    el: '#invalid',
    flashMessage() {
        this.$el.show();
        this.$el.fadeOut(3000);
    }
});

const invalid_view = new InvalidView();

function invalid() {
    invalid_view.flashMessage();
}

//================= ABACUS BACKENDS ================

function setNumber(j, d) {
    var k = Math.floor(d / 5);  // thead
    var i = d - 5 * k + 1;      // tfoot

    switch (k) {
        case 3:
            $('#h' + j + '_1').trigger('click');
            $('#f' + j + '_6').trigger('click');
            break;
        case 2:
            $('#h' + j + '_1').trigger('click');
            $('#f' + j + '_' + i).trigger('click');
            break;
        case 1:
            $('#h' + j + '_2').trigger('click');
            $('#f' + j + '_' + i).trigger('click');
            break;
        default:
            $('#h' + j + '_3').trigger('click');
            $('#f' + j + '_' + i).trigger('click');
    }

    if (d > 15) overflow();
}

function getNumber(j) {
    return parseInt($('#b' + j).text());
}

function movebeads() {
    if ($(this).hasClass('empty')) return;  // do nothing if empty
    var id = $(this).attr('id');
    id.match(/^[hf](\d+)_(\d+)$/i);
    var j = parseInt(RegExp.$1);
    var i = parseInt(RegExp.$2);

    var number = parseInt($('#b' + j).text());
    // show all beads and show the current number
    switch (id.charAt(0)) {
        case 'h':
            // thead beads
            // find the index of original empty td
            for (var i1 = 3; i1 >= 1; i1--)
                if ($('#h' + j + '_' + i1).hasClass('empty')) break;
            // update number
            $('#b' + j).text(number - (i - i1) * 5);
            // show this bead
            $('#h' + j + '_' + i1).removeClass('empty');
            // highlight all moved beads
            for (var i2 = Math.min(i1, i); i2 <= Math.max(i1, i); i2++)
                $('#h' + j + '_' + i2).addClass('active');
            break;

        case 'f':
            // tfoot beads
            // find the index of original empty td
            for (var i1 = 1; i1 <= 6; i1++)
                if ($('#f' + j + '_' + i1).hasClass('empty')) break;
            // update number
            $('#b' + j).text(number + i - i1);
            // show this bead
            $('#f' + j + '_' + i1).removeClass('empty');
            // highlight all moved beads
            for (var i2 = Math.min(i1, i); i2 <= Math.max(i1, i); i2++)
                $('#f' + j + '_' + i2).addClass('active');
            break;
            break;
    }

    // this td becomes empty
    $(this).addClass('empty');
}

//============== INSTRUCTION TABLE ============
var step = 3000;  // half a sec

const InstructView = Backbone.View.extend({
    el: 'ol#instruction',
    append(str) {
        this.$el.queue(function() {
            $(this).append($('<li>' + str + '<\/li>').hide());

            $(this).dequeue();
        });
        this.$el.queue(function() {
            $(this).scrollTop($(this)[0].scrollHeight);
            $(this).find('li:last').fadeIn(step, function() {
                // unlabel all beads
                $('thead td, tfoot td').removeClass('active');

                this.$el.dequeue();
            });
        });
    },
    queue(func) {
        this.$el.queue(func);
    },
    reset() {
        this.$el.queue('fx', []);
        this.$el.stop();
        this.$el.html('');
    }
});

var instruct_view = new InstructView();

function addInstruct(str) {
    instruct_view.append(str);
}


//============== BASIC ARITHMATICS (PLUS) ============
var plus1 = [
    '一上一 add 1', '二上二 add 2', '三上三 add 3', '四上四 add 4', '五上五 add 5', '六上六 add 6',
    '七上七 add 7', '八上八 add 8', '九上九 add 9'
];
var plus2 = [
    '一下五去四 add 5 minus 4', '二下五去三 add 5 minus 3', '三下五去二 add 5 minus 1',
    '四下五去一 add 5 minus 1'
];
var plus3 = [
    '一去九進一 minus 9 carry out 1', '二去八進一 minus 8 carry out 1',
    '三去七進一 minus 7 carry out 1', '四去六進一 minus 6 carry out 1',
    '五去五進一 minus 5 carry out 1', '六去四進一 minus 4 carry out 1',
    '七去三進一 minus 3 carry out 1', '八去二進一 minus 2 carry out 1',
    '九去一進一 minus 1 carry out 1'
];
var plus4 = [
    '六上一去五進一 add 1 minus 5 carry out 1', '七上二去五進一 add 2 minus 5 carry out 1',
    '八上三去五進一 add 3 minus 5 carry out 1', '九上四去五進一 add 4 minus 5 carry out 1'
];

function plus(j, d, type) {
    // skip zero digit
    if (d == 0) return;
    var a = getNumber(j);
    var sum = a + d;

    if (type == 'show') {
        if (d < 5) {
            if (sum >= 10)
                addInstruct(plus3[d - 1]);
            else if (a < 5 && sum >= 5)
                addInstruct(plus2[d - 1]);
            else
                addInstruct(plus1[d - 1]);
        } else if (d == 5) {
            if (sum < 10)
                addInstruct(plus1[d - 1]);
            else
                addInstruct(plus3[d - 1]);
        } else {
            if (sum < 10)
                addInstruct(plus1[d - 1]);
            else if (a >= 5 && sum < 15)
                addInstruct(plus4[d - 6]);
            else
                addInstruct(plus3[d - 1]);
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
//============== BASIC ARITHMATICS (MINUS) ============
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

function minus(j, d, type) {
    // skip zero digit
    if (d == 0) return;
    var a = getNumber(j);
    var diff = a - d + 10;

    if (type == 'show') {
        if (d < 5) {
            if (diff < 10)
                addInstruct(minus3[d - 1]);
            else if (a >= 5 && diff < 15)
                addInstruct(minus2[d - 1]);
            else
                addInstruct(minus1[d - 1]);
        } else if (d == 5) {
            if (diff >= 10)
                addInstruct(minus1[d - 1]);
            else
                addInstruct(minus3[d - 1]);
        } else {
            if (diff >= 10)
                addInstruct(minus1[d - 1]);
            else if (a < 5 && diff >= 5)
                addInstruct(minus4[d - 6]);
            else
                addInstruct(minus3[d - 1]);
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
//============== BASIC ARITHMATICS (TIMES) ============
var times1 = new Array(9)
times1[0] = ['一一得一 1*1=1'];
times1[1] = ['一二得二 1*2=2', '二二得四 2*2=4'];
times1[2] = ['一三得三 1*3=3', '二三得六 2*3=6', '三三得九 3*3=9'];
times1[3] = ['一四得四 1*4=4', '二四得八 2*4=8', '三四一十二 2*6=12', '四四一十六 2*6=12'];
times1[4] = [
    '一五得五 1*5=5', '二五一十 2*5=10', '三五一十五 3*5=15', '四五二十 4*5=20',
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
    '一八得八 1*8=8', '二八一十六 2*8=16', '三八二十四 2*8=24', '四八三十二 4*8=32',
    '五八四十 5*8=40', ' 六八四十八 6*8=48', '七八五十六 7*8=56', '八八六十四 8*8=64'
];
times1[8] = [
    '一九得九 1*9=9', '二九一十八 2*9=18', '三九二十七 2*9=27', '四九三十六 4*9=36',
    '五九四十五 5*9=45', '六九五十四 6*9=54', '七九六十三 7*9=63', '八九七十二 8*9=72',
    '九九八十一 9*9=81'
];

function times(j, a, d, type, flag_replace) {
    // skip zero digit
    if (d == 0 || a == 0) return;
    // var a = getNumber (j);
    var prod = a * d;

    if (type == 'show') {
        if (a > d)
            addInstruct(times1[a - 1][d - 1]);
        else
            addInstruct(times1[d - 1][a - 1]);

        // add operation to queue
        instruct_view.queue(function() {
            if (j + 1 <= digits) {
                if (flag_replace)  // overwrite the original digit
                    setNumber(j, Math.floor(prod / 10));
                else
                    plus(j, Math.floor(prod / 10));
                plus(j + 1, prod % 10);
            } else
                overflow();
            $(this).dequeue();
        });
    }
}

//============== BASIC ARITHMATICS (DIVIDE) ============
var divide1 = new Array(9);
divide1[0] = [
    '逢一進一 1/1=1', '逢二進二 2/2=2', '逢三進三 3/3=3', '逢四進四 4/4=4', '逢五進五 5/5=5',
    '逢六進六 6/6=6', '逢七進七 7/7=7', '逢八進八 8/8=8', '逢九進九 9/9=9'
];
divide1[1] = ['逢二進一', '逢四進二', '逢六進三', '逢八進四'];
divide1[2] = ['逢三進一', '逢六進二'];
divide1[3] = ['逢四進一', '逢八進二'];
divide1[4] = ['逢五進一'];
divide1[5] = ['逢六進一'];
divide1[6] = ['逢七進一'];
divide1[7] = ['逢八進一'];
divide1[8] = ['逢九進一'];

var divide2 = new Array(9);
divide2[1] = ['二一添作五 10/2=5'];
divide2[2] = ['三一三十一 10=3*3+1', '三二六十二 20=3*6+2'];
divide2[3] = ['四一二十二 10=4*2+2', '四二添作五 20=2*5', '四三七十二 30=7*2'];
divide2[4] =
    ['五一添作二 10=5*2', '五二添作四 20=5*4', '五三添作六 30=5*5+6', '五四添作八 40=5*4+8'];
divide2[5] = [
    '六一下加四 10=6*1+4', '六二三十二 20=6*3+2', '六三添作五 30=6*3+5', '六四六十四 40=6*6+4',
    '六五八十二 50=6*8+2'
];
divide2[6] = [
    '七一下加三 10=7*1+3', '七二下加六 20=7*2+6', '七三四十二 30=7*4+2', '七四五十五 40=7*5+5',
    '七五七十一 50=7*7+1', '七六八十二 60=7*8+2'
];
divide2[7] = [
    '八一下加二 10=8*1+2', '八二下加四 20=8*2+4', '八三下加六 30=8*8+6', '八四添作五 40=8*5',
    '八五六十二 50=8*6+2', '八六七十四 60=8*7+4', '八七八十六 70=8*8+6'
];
divide2[8] = [
    '九一下加一 10=4*1+6', '九二下加二 20=9*2+2', '九三下加三 30=9*3+3', '九四下加四 40=9*4+4',
    '九五下加五 50=9*5+5', '九六下加六 60=9*6+6', '九七下加七 70=9*7+7', '九八下加八 80=9*8+8'
];

const divide3 = [
    '見一無除作九一', '見二無除作九二', '見三無除作九三', '見四無除作九四', '見五無除作九五',
    '見六無除作九六', '見七無除作九七'
];
const divide4 = [
    '借一還一', '借一還二', '借一還三', '借一還四', '借一還五', '借一還六', '借一還七', '借一還八',
    '借一還九'
];

function divide_by(j, a, b) {
    // skip zero digit
    if (a == 0 || b == 0) return;
    if (a >= b) {
        divide_by(j - 1, a / 10, b);
        return;
    }

    // Find the first digits
    var x = Math.floor(a * 10);
    var d = Math.floor(b * 10);

    // Estimate the quotient
    var quo = Math.floor(x * 10 / d);

    // Compute the true quotient
    var true_quo = Math.floor(a * 10 / b);

    if (quo >= 10) {
        // Todo: avoid using true quotient
        q = Math.floor(quo / 10);
        addInstruct(divide1[d - 1][q - 1]);
        instruct_view.queue(function() {
            minus(j, q * d);
            plus(j - 1, q);
            $(this).dequeue();
        });
    } else if (Math.floor(a * 10) > 0) {
        var reminder = x * 10 - quo * d;

        addInstruct(divide2[d - 1][x - 1]);

        instruct_view.queue(function() {
            setNumber(j, quo);
            setNumber(j + 1, reminder + getNumber(j + 1));
            $(this).dequeue();
        });
    }

    var quo_diff = true_quo - quo;
    if (true_quo > quo) {
        // Underestimated quotient
        if (quo_diff * d <= 9)
            addInstruct(divide1[d - 1][quo_diff - 1]);
        else
            addInstruct('Repeat "' + divide1[d - 1][0] + '" by ' + quo_diff + ' times');
        instruct_view.queue(function() {
            minus(j + 1, quo_diff * d);
            plus(j, quo_diff);
            $(this).dequeue();
        });
    } else if (true_quo < quo) {
        // Overestimated quotient
        quo_diff *= -1
        if (quo_diff > 1)
        addInstruct('Repeat "' + divide4[d - 1] + '" by ' + quo_diff + ' times');
        else addInstruct(divide4[d - 1]);

        instruct_view.queue(function() {
            plus(j + 1, quo_diff * d);
            minus(j, quo_diff);
            $(this).dequeue();
        });
    }

    // Long division
    if (true_quo > 0 && Math.log10(b - d / 10) > -digits) {
        let y = Math.round((b - d / 10) * Math.pow(10, digits)) / Math.pow(10, digits - 1);
        addInstruct('Subtract by ' + y + ' * ' + true_quo + ' = ' + y * true_quo);

        y *= true_quo;
        // for (let k=j+1; k<digits || Math.log10(y)>-digits; k++)
        // BUG: round off error when number = 0.3999999
        for (let k = j + 1; k < digits; k++) {
            let r = Math.floor(y);
            if (r > 0)
                instruct_view.queue(function() {
                    minus(k, r);
                    $(this).dequeue();
                });
            y = (y - r) * 10;
        }
    }

    // Recursion
    if (true_quo >= 10) {
        // Bug: round off error
        var remainder = a * 10 - Math.floor(true_quo / 10) * 10 * b;
        if (j + 1 < digits)  // && reminder * Math.pow(10, digits) > 0)
            divide_by(j + 1, remainder, b);
    } else {
        var remainder = a * 10 - true_quo * b;
        if (j + 1 < digits)  // && reminder * Math.pow(10, digits) > 0)
            divide_by(j + 1, remainder, b);
    }
}

//================ Integer Functions ================

function check_format(a) {
    var re1 = new RegExp('^([1-9]\\d*)|(\\d+\\.\\d*[1-9])$', 'i');
    if (a.match(re1) == null) return false;
    return true;
}

function check_overflow(a) {
    if (a.length > digits) return true;
    return false;
}

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

//================ FRONTENDS =========================
var minusflag = 0;
// handle demo form when submit

function handleForm() {
    // check format (integer)
    var a = $('form#demo input#a').val();
    var b = $('form#demo input#b').val();
    if (!check_format(a) || !check_format(b)) {
        invalid();
        return false;
    }

    // reset
    $('button:contains("Reset")').trigger('click');

    // stage 1 processing
    // align decimal points
    var new_ab = align_decimals(a, b);
    a = new_ab[0];
    b = new_ab[1];

    switch ($('form#demo select').val()) {
        case 'plus':
        case 'minus':

            if (check_overflow(a) || check_overflow(b)) {
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
            if (check_overflow(a) || check_overflow(b)) {
                overflow();
                return false;
            }
    }

    // stage 2
    switch ($('form#demo select').val()) {
        case 'plus':
            // show a on the right side of abacus
            addInstruct('Populate abacus with left operand');
            var no = a.split('').reverse();
            for (var j = digits; j >= 1 && (digits - j) < no.length; j--) {
                var d = no[digits - j] - '0';
                setNumber(j, d);
            }

            var no = b.split('');
            for (var j = digits - b.length + 1; j <= digits; j++) {
                var d = no[j - digits - 1 + b.length] - '0';
                plus(j, d, 'show');
            }
            break;
        case 'minus':
            // show a on the right side of abacus
            addInstruct('Populate abacus with left operand');
            var no = a.split('').reverse();
            for (var j = digits; j >= 1 && (digits - j) < no.length; j--) {
                var d = no[digits - j] - '0';
                setNumber(j, d);
            }

            minusflag = 0;
            var no = b.split('');
            for (var j = digits - b.length + 1; j <= digits; j++) {
                var d = no[j - digits - 1 + b.length] - '0';
                minus(j, d, 'show');
            }
            instruct_view.queue(function() {
                if (!minusflag) return;
                // negative number
                addInstruct('(負數)向左還一 10\'s complement');
                instruct_view.queue(function() {
                    for (var j = 1; j <= digits - 1; j++) setNumber(j, 9 - getNumber(j));
                    setNumber(j, 10 - getNumber(j));
                    $(this).dequeue();
                });
                $(this).dequeue();
            });
            break;
        case 'times':
            // show a on the left side of abacus
            addInstruct('Populate abacus with left operand');
            var no = a.split('');
            for (var j = 1; j <= digits && j <= no.length; j++) {
                var d = no[j - 1];
                setNumber(j, d);
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
                    if (i + j > digits) {
                        overflow();
                        continue;
                    }
                    times(j + i, a_i, b[i], 'show');
                }
            }
            break;
        case 'divide by':
            // show a on the left side of abacus
            addInstruct('Populate abacus with left operand');
            var no = a.split('');
            for (var j = 2; j <= digits && j - 1 <= no.length; j++) {
                var d = no[j - 2];
                setNumber(j, d);
            }


            divide_by(2, parseFloat('0.' + a), parseFloat('0.' + b));

            // var x = parseFloat('0.'+a);
            // var d = parseFloae('0,'+b);
            // for(var j = 2; j< digits-1; j++) {
            //    if (Math.log10(x) < -digits)
            //        break;

            //    divide_by(j,x,d);

            //    var true_quo = x*10 - d;
            //    x = x*10 - true_quo*d;
            //}

    }  // end_switch

    addInstruct('End of instructions.');
    // prevent restart
    return false;
}

const AbacusModel = Backbone.Model.extend({
    defaults: {
        digits: 7,
    },
});

const ComputeModel = Backbone.Model.extend({
    defaults: {
        speed: 0,
    },
});

// draw abacuspad
const AbacusView = Backbone.View.extend({
    el: '#abacus_container2',
    events: {
        'click td': 'onClick',
    },
    initialize(options) {
        this.template = _.template($('#abacus-template').html());
        this.model = options.model;
        this.model.on('change', this.render, this);
        this.render();
    },
    render() {
        this.$el.html(this.template({digits: this.model.get('digits')}));

        // Last row is empty
        this.$el.find('thead tr:last td').addClass('empty');

        // top row is empty
        this.$el.find('tfoot tr:first td').addClass('empty');
        return this;
    },
    moveHeadBead(i, j, number) {
        // find the index of original empty td
        for (var i1 = 3; i1 >= 1; i1--) {
            var this_bead = this.$el.find('.h' + j + '_' + i1);
            if (this_bead.hasClass('empty')) {
                this_bead.removeClass('empty');
                break;
            }
        }
        // update number
        this.$el.find('.b' + j).text(number - (i - i1) * 5);

        // highlight all moved beads
        for (var i2 = Math.min(i1, i); i2 <= Math.max(i1, i); i2++) {
            this.$el.find('.h' + j + '_' + i2).addClass('active');
        }
    },
    moveFootBead(i, j, number) {
        // find the index of original empty td
        for (var i1 = 1; i1 <= 6; i1++) {
            if (this.$el.find('.f' + j + '_' + i1).hasClass('empty')) break;
        }
        // update number
        this.$el.find('.b' + j).text(number + i - i1);

        // show this bead
        this.$el.find('.f' + j + '_' + i1).removeClass('empty');
        // highlight all moved beads
        for (var i2 = Math.min(i1, i); i2 <= Math.max(i1, i); i2++) {
            this.$el.find('.f' + j + '_' + i2).addClass('active');
        }
    },
    onClick(e) {
        // Identify the bead on the abacus
        const bead = $(e.currentTarget);
        const id = bead.attr('class');

        const matched = id.match(/[hf](\d+)_(\d+)/i);
        if (!matched) {
            return this;
        }

        const j = parseInt(matched.at(1));
        const i = parseInt(matched.at(2));
        const type = id.charAt(0);

        const number = parseInt(this.$el.find('.b' + j).text());

        switch (type) {
            case 'h':
                // thead beads
                this.moveHeadBead(i, j, number);
                break;
            case 'f':
                // tfoot beads
                this.moveFootBead(i, j, number);
                break;
        }
        // this td becomes empty
        bead.addClass('empty');
    },
});

function draw_abacus() {
    var table = $('<table id="abacuspad" cellspacing="0"><\/table>');
    var thead = $('<thead><\/thead>');
    var tbody = $('<tbody><\/tbody>');
    var tfoot = $('<tfoot><\/tfoot>');
    // insert beads into thead
    for (var i = 1; i <= 3; i++) {
        var html = '<tr>';
        for (var j = 1; j <= digits; j++) html += '<td id="h' + j + '_' + i + '">&#xFEFF;<\/td>';
        thead.append(html + '<\/tr>');
    }
    // the last row is empty
    thead.find('tr:last td').addClass('empty');
    // insert numbers into tbody
    var html = '<tr>';
    for (var j = 1; j <= digits; j++) html += '<td id="b' + j + '">0<\/td>';
    tbody.append(html + '<\/tr>');
    // insert beads into tfoot
    for (var i = 1; i <= 6; i++) {
        var html = '<tr>';
        for (var j = 1; j <= digits; j++) html += '<td id="f' + j + '_' + i + '">&#xFEFF;<\/td>';
        tfoot.append(html + '<\/tr>');
    }
    // the top row is empty
    tfoot.find('tr:first td').addClass('empty');
    // add click events
    thead.find('td').click(movebeads);
    tfoot.find('td').click(movebeads);
    // display the table
    $('#abacus_container').append(table.append(thead, tbody, tfoot));
}

// precision setup
const PrecisionInputView = Backbone.View.extend({
    el: '#precision-bar',
    events: {
        'click button': 'onClick',
    },
    initialize(options) {
        this.model = options.model;
    },
    onClick() {
        digits = parseInt(this.$el.find('#precision').val());
        this.model.set({digits: digits});
        $('#abacus_container table').remove();
        draw_abacus();
    },
});

// Speed control
const SpeedView = Backbone.View.extend({
    el: '#speed-bar',
    events: {
        'change': 'onChange',
    },
    initialize(options) {
        this.model = options.model;
        this.onChange();
    },
    onChange() {
        step = parseInt(this.$el.find('input[name="speed"]').val());
        this.model.set({speed: step});
    },
});
// demo button: demonstration
const InputView = Backbone.View.extend({
    el: '#demo',
    events: {
        'submit': 'onSubmit',
        'click button:contains("Reset")': 'onReset',
    },
    onSubmit() {
        return handleForm();
    },
    onReset() {
        instruct_view.reset();
        for (var j = 1; j <= digits; j++)  // from 3nd column to 11th column
            setNumber(j, 0);
    },
});

$(function() {
    const abacus_model = new AbacusModel();
    const precision_view = new PrecisionInputView({model: abacus_model});

    const compute_model = new ComputeModel();
    const speed_view = new SpeedView({model: compute_model});
    const input_view = new InputView();

    const abacus_view = new AbacusView({model: abacus_model});

    draw_abacus();

    // Set 12345 as default
    for (var j = 3; j <= 11; j++)  // from 3nd column to 11th column
        setNumber(j, j - 2);
});
