import compile from './tools';

describe('[EXAMPLE] hex-color', () => {
    const parse = compile(`
        entry {
            <hex> = [(\\d, a - f)]
            <hex-pair> = [<hex> <hex>]
            
            default [object:
                '#'
                
                // RRGGBBAA & RRGGBB
                [
                    def r = [<hex-pair>]
                    def g = [<hex-pair>]
                    def b = [<hex-pair>]
                    def a = [<hex-pair>]?
                ] | [
                    // RGBA & RGB
                    def r = [<hex>]
                    def g = [<hex>]
                    def b = [<hex>] 
                    def a = [<hex>]?
                ]
            ]
        }
    `);

    parse([
        ['#b5d', {r: 'b', g: '5', b: 'd', a: null}],
        ['#cf5c', {r: 'c', g: 'f', b: '5', a: 'c'}],
        ['#4eaecc', {r: '4e', g: 'ae', b: 'cc', a: null}],
        ['#328fffcc', {r: '32', g: '8f', b: 'ff', a: 'cc'}]
    ]);

    parse([
        'fff',
        '#c2g',
        '#cc'
    ]);
});
