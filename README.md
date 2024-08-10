# abacus-emu

Chinese emulator to learn computer microprogramming

Demo: https://antonysigma.github.io/_static/abacus-bin/

## Build instruction

1. Download the [Entangled code generator](https://github.com/entangled/entangled/releases/tag/v1.2.4).

2. Run `path/to/entangled-1.2.4/bin/entangled tangle -a` from the current
   directory to generate the main control script `src/main.js`.

3. (Optional) Generate the one-page documentation by `make site`.

4. Run `make depend` to download all WebGUI dependencies.

5. Run `make build` to compile and bundle all scripts to the output folder `static/`

6. Open the webpage `static/index.html` from the web browser. Enjoy!
