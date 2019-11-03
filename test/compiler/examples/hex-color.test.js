const compile = require('./tools');

describe('[EXAMPLE] hex-color', () => {

    const parse = compile(`
        entry {
            <hex> = ['0' to '9' | 'a' to 'f']
            <hex-pair> = [<hex> <hex>]
            
            default [
                '#'
                
                // RRGGBBAA & RRGGBB
                [<hex-pair#r> <hex-pair#b> <hex-pair#g> <hex-pair#a>?] |
                
                // RGBA & RGB
                [<hex#r> <hex#b> <hex#g> <hex#a>?]
            ]
        }
    `);

    parse([
        ['#b5d', {r: 'b', b: '5', g: 'd', a: null}],
        ['#cf5c', {r: 'c', b: 'f', g: '5', a: 'c'}],
        ['#4eaecc', {r: '4e', b: 'ae', g: 'cc', a: null}],
        ['#328fffcc', {r: '32', b: '8f', g: 'ff', a: 'cc'}]
    ]);

    parse([
        'fff',
        '#c2g',
        '#cc'
    ]);
});
