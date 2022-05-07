## Exception handling

### Integer / fixed-point decimal overflow

Exception during numerical computation can be modelled as:
```{.javascript #exception-model}
const ExceptionModel = Backbone.Model.extend({
    default: {
        overflow: 0,
        invalid: 0,
    },
});
```
Whenever we hit numerical overflow, the warning message is flashed once:
```{.javascript #overflow-view}
const OverflowView = Backbone.View.extend({
    el: '#overflow',
    flashMessage() {
        this.$el.show();
        this.$el.fadeOut(3000);
    }
});
```

The banner is in turn visualized as red colored text:
```{.html #overflow-gui}
<span id="overflow">Integer / fixed-point decimal overflow</span>
```

### Invalid input

We check the user-provided left/right operands with inputs
```{.javascript #invalid-view}
const InvalidView = Backbone.View.extend({
    el: '#invalid',
    flashMessage() {
        this.$el.show();
        this.$el.fadeOut(3000);
    }
});
```

The banner is also visualized as red colored text:
```{.html #invalid-gui}
<span id="invalid">The number is invalid.</span>
```