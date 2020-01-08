import compile from './tools';

describe('[EXAMPLE] strings', () => {

    const parse = compile(`
        entry {
            default [object:
                '"'
                /**
                   * Match all characters except the quotation character.
                   * Match escaped quotation-characters first.
                   */ 
                def string = [['\\"' | (. except \\")]+]
                '"'
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
