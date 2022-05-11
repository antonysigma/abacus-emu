
# Directory structure

Main script

``` {.javascript file=src/main.js}
import Backbone from 'backbone';
import _ from 'underscore';

<<exception-model>>
<<instruction-model>>
```

Main page
```{.html file=src/main.html}
<html>
<head>
    <title>Abacus Emulator</title>
    <link rel="stylesheet" type="text/css" href="abacus.css" />
    <script type="text/javascript" src="main.js"></script>

    <<abacuspad-template>>
    <<instruction-list-template>>
</head>

<body>
    <<precision-input-ui>>

    <div id="abacus_container"></div>
</body>
</html>
```