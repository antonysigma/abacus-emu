---
title: Abacus emulator
author: Antony C Chan
---

# abacus-emu
Chinese emulator to learn computer microprogramming

Demo: https://antonysigma.github.io/_static/abacus-bin/

# How to read this document

This example is written in a style of literate programming (Knuth 1984).
The (Javascript) source code is not presented in one go. Instead, we present the code fragments embed within the main article.

The same article is also hosted on Github at https://github.com/antonysigma/abacus-emu/blob/entangled-bootstrap/lit/ .

The document pre-processor application, `entangled`, will parse a system of code fragment references, known as `noweb` (Ramsey 1994), to assemble the machine-readable source files.
Inside source fragments you may encounter a line with `<<...>>` marks, which is a reference to another code fragment in the article.

Literate programming requires the *machine code* to be scattered throughout the
main article written in plain English, following the *human expert's* train of
thought. This is in stark contrast to the inline comment blocks scattered among
the *machine code* files, following the *machine logic flow*.

# Build instruction

1. Download the [Entangled code generator](https://github.com/entangled/entangled/releases/tag/v1.2.4).

2. Run `path/to/entangled-1.2.4/bin/entangled tangle -a` from the current
   directory to generate the main control script `src/main.js`.

3. (Optional) Generate the one-page documentation by `make site`.

4. Run `make depend` to download all WebGUI dependencies.

5. Run `make build` to compile and bundle all scripts to the output folder `static/`

6. Open the webpage `static/index.html` from the web browser. Enjoy!
