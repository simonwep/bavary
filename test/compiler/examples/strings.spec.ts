import compile from './tools';

describe('[EXAMPLE] strings', () => {

    const parse = compile(`
        entry {
            
            // Allow all characters in the utf-8 range
            <str-body> = [
                ['\\\\"' | (. except \\")]+
            ]
            
            default [
                '"' <str-body#string> '"'
            ]
        }
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
