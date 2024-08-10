import globals from "globals";
import js from "@eslint/js";

export default [
    //js.configs.recommended,
    {
    languageOptions: {
        globals: {
            ...globals.browser,
        },
        ecmaVersion: 2017,
        sourceType: "module",
    },
    //rules: {
    //    "comma-dangle": ["error", "only-multiline"],
    //},
}];