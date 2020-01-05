import compile from './tools';

describe('[EXAMPLE] strings', () => {

    const parse = compile(`
        entry {
            
            /**
             * Match all characters except the quotation character.
             * Match escaped quotation-characters first.
             */ 
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
