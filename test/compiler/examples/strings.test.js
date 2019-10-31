const compile = require('./tools');

describe('Example: strings', () => {

    const parse = compile(`

        // Allow all characters in the utf-8 range
        <str-body> = [['\\\\"' | \\u0000 to \\u0021 | \\u0023 to \\uffff]+]
        
        entry <str> = [
            '"' <str-body#string> '"'
        ]
    `);

    parse([
        ['"Hello World!"', {string: 'Hello World!'}],
        ['"Hello \\" World!"', {string: 'Hello \\" World!'}]
    ]);

    parse([
        '"Hello "World!"',
        '"hello'
    ]);
});
