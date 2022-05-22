
# Directory structure

Main script

``` {.javascript file=src/main.js}
import Backbone from 'backbone';
import _ from 'underscore';

<<check-format>>
<<align-decimal>>
<<check-overflow>>

<<exception-model>>
<<instruction-model>>
<<precision-model>>
<<compute-model>>

<<precision-input-view>>
<<input-view>>
<<instruction-list-view>>
<<speed-view>>
<<abacus-view>>

<<plus-commands>>
<<plus-algorithm>>
<<execute>>

<<main>>
```

Main function
```{.javascript #main}
document.addEventListener("DOMContentLoaded", function(event) {
    const abacus_model = new AbacusModel();
    const precision_view = new PrecisionInputView({model: abacus_model});

    const instruction_model = new InstructionModel({command: []});

    const instruct_view = new InstructView({model: instruction_model});

    const compute_model = new ComputeModel();
    const speed_view = new SpeedView({model: compute_model});

    const abacus_view = new AbacusView({model: abacus_model});
    const input_view = new InputView({instruct_view: instruct_view, abacus_view: abacus_view, precision_model: abacus_model});
});
```

Main page
```{.html file=static/index.html}
<html>
<head>
    <title>Abacus Emulator</title>
    <meta charset="utf-8"/>
    <link rel="stylesheet" type="text/css" href="abacus.css" />
    <script type="text/javascript" src="main.js"></script>

    <<abacuspad-template>>
    <<instruction-list-template>>
</head>

<body>
    <<speed-ui>>
    <<precision-input-ui>>

    <div id="abacus_container"></div>
    <<user-input-ui>>

    <div id="instruction"></div>
</body>
</html>
```
