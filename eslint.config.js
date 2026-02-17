import globals from 'globals';
import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
    {
        files: ["**/*.js"],
        languageOptions: {
            sourceType: "module",
            globals: {
                ...globals.node,
                ...globals.jest
            }
        }
    },
    pluginJs.configs.recommended,
    eslintConfigPrettier,
    {
        ignores: ["node_modules/", "dist/", "coverage/"]
    }
];
