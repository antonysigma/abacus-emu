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
```{.javascript #precision-input}
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
    },
});
```