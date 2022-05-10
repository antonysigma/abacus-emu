
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
    <<abacuspad-template>>
    <<instruction-list-template>>
</head>

<body>
    <<precision-input-ui>>
</body>
</html>
```