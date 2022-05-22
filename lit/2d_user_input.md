## User input

We start with the graphical user interface with a reset button and submit button.
```{.html #user-input-ui}
<form action="#" id="demo" name="demo">
  <button>Reset</button>
  <p>
    <<left-operand>>
    <<operator>>
    <<right-operand>>
    <input value="demo" type="submit" />
  </p>
</form>
```

### Arithmetics

Any binary operation starts with a left operand:
```{.html #left-operand}
<input maxlength="13" id="a" value="123"/>
```

Following the operator
```{.html #operator}
<select>
  <option>plus</option>
  <option>minus</option>
  <option>times</option>
  <option>divide by</option>
</select>
```

And the right operand.
```{.html #right-operand}
<input maxlength="13" id="b" value="321"/>
```

The corresponding model is given as
```{.javascript #compute-model}
const ComputeModel = Backbone.Model.extend({
    defaults: {
        left_operand: 0,
        operator: 'plus',
        right_operand: 1,
        speed: 0,
    },
});
```

```{.javascript #input-view}
const InputView = Backbone.View.extend({
    el: '#demo',
    events: {
        'submit': 'onSubmit',
        'click button:contains("Reset")': 'onReset',
    },
    initialize(options) {
        this.instruct_view = options.instruct_view;
        this.abacus_view = options.abacus_view;
	this.precision_model = options.precision_model;
    },
    onSubmit() {
        const model = this.handleForm();
        if(model) {
            execute(model.a, model.b, model.operator, {
                instruct_view: this.instruct_view,
		abacus_view: this.abacus_view,
                precision: this.precision_model.get('digits'),
                show_stroke: true,
            });
        }
        return false;
    },
    handleForm() {
        // check format (integer)
        const a = this.$el.find('input#a').val();
        const b = this.$el.find('input#b').val();
        if (!check_format(a) || !check_format(b)) {
            invalid();
            return null;
        }

        return {a: a, b: b, operator: this.$el.find('select').val()};
    },
    onReset() {
        this.instruct_view.reset();
	this.abacus_view.render();
	return false;
    },
});
```

```{.javascript #check-format}
function check_format(a) {
    var re1 = new RegExp('^([1-9]\\d*)|(\\d+\\.\\d*[1-9])$', 'i');
    if (a.match(re1) == null) return false;
    return true;
}
```

### Compute speed input

We have three sets of speed options: slow, medium, and fast.
```{.html #speed-ui}
<div id="speed-bar">
  <input type="radio" name="speed" id="slow" value="3000" />
  <label for="slow">Slow</label>
  <input type="radio" id="fast" name="speed" value="500" />
  <label for="fast">Fast</label>
  <input type="radio" id="insane" name="speed" value="70" checked="checked" />
  <label for="fast">Insane</label>
</div>
```

```{.javascript #speed-view}
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
        var speed = parseInt(this.$el.find('input[name="speed"]').val());
        this.model.set({speed: speed});
    },
});
```

