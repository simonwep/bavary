import compile from './tools';

describe('[EXAMPLE] strings', () => {

    const parse = compile(`

        // Allow all characters in the utf-8 range
        <str-body> = [
            ['\\\\"' | (\\u0000 - \\uffff except \\")]+
        ]
        
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
