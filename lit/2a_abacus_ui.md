# Building the abacus graphical frontend

## Beads on the abacus

The top beads are presented as HTML tables cells, having a CSS class-name of `.h*_*`.
```{.html #top-bead}
<thead>
<% _.forEach(_.range(1, 4), function (i) { %>
    <tr>
<% _.forEach(_.range(1, digits + 1), function (j) { %>
    <td class="h<%= j %>_<%= i %>">&#xFEFF;</td>
<% }) %>
    </tr>
<% }); %>
</thead>
```

The bottom beands take similar shape:
```{.html #bottom-bead}
<tfoot>
<% _.forEach(_.range(1, 7), function (i) { %>
    <tr>
<% _.forEach(_.range(1, digits + 1), function (j) { %>
    <td class="f<%= j %>_<%= i %>">&#xFEFF;</td>
<% }) %>
    </tr>
<% }); %>
</tfoot>
```

The horizontal separator is composed of empty table cells. We utilize the negative space to display the Arabic numerial digits.
```{.html #bead-separator}
<tbody>
    <tr>
<% _.forEach(_.range(1, digits + 1), function (j) { %>
    <td class="b<%= j %>">0</td>
<% }) %>
    </tr>
</tbody>
```

Now, store it as `Underscore.js` template.
```{.html #abacuspad-template}
<script id="abacus-template" type="text/template">
<table class="abacuspad" cellspacing="0">
    <<top-bead>>
    <<bead-separator>>
    <<bottom-bead>>
</table>
</script>
```

## Configure the numerical precision

The numerical precision of the abacus is determined by the number of columns on the abacus.

The precision is modelled by a positive integer `digits`.
```{.javascript #precision-model}
const AbacusModel = Backbone.Model.extend({
    defaults: {
        digits: 7,
    },
});
```

We expose the `digits` model on the graphical frontend. It consists of the dropdown menu having three options, `7`, `13`, and `20`. It also comes with a `Change` button.
```{.html #precision-input-ui}
<div id="precision-bar">
Precision: <select id="precision">
<option>7</option>

<option selected="selected">13</option>

<option>20</option>
</select>
<button>Change</button></div>
```

In the backend, the app listens on the user button click event, then update the `digits` value in the model.
```{.javascript #precision-input-view}
const PrecisionInputView = Backbone.View.extend({
    el: '#precision-bar',
    events: {
        'click button': 'onClick',
    },
    initialize(options) {
        this.model = options.model;
    },
    onClick() {
        var digits = parseInt(this.$el.find('#precision').val());
        this.model.set({digits: digits});
    },
});
```
## Digits on the abacus

```{.javascript #digits-model}
const AbacusDigitModel = Backbone.Model.extend({
    defaults: {
	previous: 0,
	current: 0,
    },
});
```
## Abacus behavior

```{.javascript #abacus-view}
const AbacusView = Backbone.View.extend({
    el: '#abacus_container',
    events: {
        'click td': 'onClick',
    },
    initialize(options) {
        this.template = _.template($('#abacus-template').html());
        this.model = options.model;
        this.model.on('change', this.render, this);
        this.render();
    },
```

A boolean state to indicate whether the value is signed or unsigned (aka 10's complement).
```{.javascript #abacus-view}
    minusflag: false,
```

When the abacus is first rendered, reset everything as zero.
```{.javascript #abacus-view}
    render() {
        this.$el.html(this.template({digits: this.model.get('digits')}));

        // Last row is empty
        this.$el.find('thead tr:last td').addClass('empty');

        // top row is empty
        this.$el.find('tfoot tr:first td').addClass('empty');
        return this;
    },
    reset() { return this.render(); },
```

```{.javascript #abacus-view}
    moveHeadBead(i, j, digit) {
        // find the index of original empty td
        for (var i1 = 3; i1 >= 1; i1--) {
            var this_bead = this.$el.find('.h' + j + '_' + i1);
            if (this_bead.hasClass('empty')) {
                this_bead.removeClass('empty');
                break;
            }
        }

        // update the digit
	const new_digit = digit - (i - i1) * 5;
        this.$el.find('.b' + j).text(new_digit);

        // highlight all moved beads
        for (var i2 = Math.min(i1, i); i2 <= Math.max(i1, i); i2++) {
            this.$el.find('.h' + j + '_' + i2).addClass('active');
        }
    },
    moveFootBead(i, j, digit) {
        // find the index of original empty td
        for (var i1 = 1; i1 <= 6; i1++) {
            if (this.$el.find('.f' + j + '_' + i1).hasClass('empty')) break;
        }

        // update the digit
	const new_digit = digit + i - i1;
        this.$el.find('.b' + j).text(new_digit);

        // show this bead
        this.$el.find('.f' + j + '_' + i1).removeClass('empty');
        // highlight all moved beads
        for (var i2 = Math.min(i1, i); i2 <= Math.max(i1, i); i2++) {
            this.$el.find('.f' + j + '_' + i2).addClass('active');
        }
    },
```

When a bead is clicked, it indicates bead movement.
```{.javascript #abacus-view}
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
    getNumber(j) {
        return parseInt(this.$el.find('.b' + j).text());
    },
    setNumber(j, d) {
        const k = Math.floor(d / 5);  // thead
        const i = d - 5 * k + 1;      // tfoot

    switch (k) {
        case 3:
            this.$el.find('.h' + j + '_1').trigger('click');
            this.$el.find('.f' + j + '_6').trigger('click');
            break;
        case 2:
            this.$el.find('.h' + j + '_1').trigger('click');
            this.$el.find('.f' + j + '_' + i).trigger('click');
            break;
        case 1:
            this.$el.find('.h' + j + '_2').trigger('click');
            this.$el.find('.f' + j + '_' + i).trigger('click');
            break;
        default:
            this.$el.find('.h' + j + '_3').trigger('click');
            this.$el.find('.f' + j + '_' + i).trigger('click');
    }

    if (d > 15) overflow();
    },
});
```
