## Instruction list

We visualize the compute instructions as list:
```{.html #instruction-list-template}
<script id="instruction-template" type="text/template">
<% _.forEach(command, function (cmd) { %>
    <li><%= cmd %></li>
<% }) %>
</script>
```

Internally, the list of instruction is presented as the model:
```{.javascript #instruction-model}
const InstructionModel = Backbone.Model.extend({
    default: {
        command: [],
    },
});
```

The instruction list template is loaded into `View` object.
```{.javascript #instruction-list-view}
const InstructView = Backbone.View.extend({
    el: '#instruction',
    initialize(options) {
        this.model = options.model;
        this.template = _.template($('#instruction-template').html());

        this.render();
    },
```

Rendering is provided by Backbone.js by default.
```{.javascript #instruction-list-view}
    render() {
        this.$el.html(this.template(this.model.attributes));
    },
```


```{.javascript #instruction-list-view}
    append(str) {
        this.$el.queue(function() {
            $(this).append($('<li>' + str + '<\/li>').hide());

            $(this).dequeue();
        });
        const self = this.$el;
	const time_delta = this.model.get('speed');
        this.$el.queue(function() {
            $(this).scrollTop($(this)[0].scrollHeight);
            $(this).find('li:last').fadeIn(time_delta, function() {
                // unlabel all beads
                $('thead td, tfoot td').removeClass('active');

                self.dequeue();
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
```
