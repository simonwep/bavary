import {expect}  from 'chai';
import {compile} from '../../src';

describe('[COM] Position marks', () => {

    it('Should add the __starts and __ends property to an object', () => {
        const parse = compile(`
            <ws> = [(\\s)*]
            <hex-color> = {
                <hex> = [(0 - 9) | (a - f)]
                <hex-pair> = [<hex> <hex>]
                
                default [object:
                    '#'
                    
                    # RRGGBBAA & RRGGBB
                    [
                        def r = [<hex-pair>]
                        def g = [<hex-pair>]
                        def b = [<hex-pair>]
                        def a = [<hex-pair>]?
                    ] | [
                        # RGBA & RGB
                        def r = [<hex>]
                        def g = [<hex>]
                        def b = [<hex>] 
                        def a = [<hex>]?
                    ]
                ]
            }
            
            entry [object:
                <ws>
                def hex = [object: <hex-color>]
                <ws>
            ]+
        `, {
            locationData: true
        });

        const result = parse(`
            #fff   
            #ccc    
                #4f6ccabb   
        `) as Array<unknown>;

        expect(result).to.be.an('array').of.length(3);

        // Test if all tree values are correctly labeled in their position
        const expectedPositions = [
            [13, 16],
            [33, 36],
            [58, 66]
        ];

        for (let i = 0; i < expectedPositions.length; i++) {
            const [starts, ends] = expectedPositions[i];
            const {__starts, __ends} = (result[i] as {hex: object}).hex as {__starts: number; __ends: number};
            expect(__starts).to.equal(starts);
            expect(__ends).to.equal(ends);
        }
    });

    it('Should allow custom location properties', () => {
        const parse = compile(`
            <hex-color> = {
                <hex> = [(0 - 9) | (a - f)]
                <hex-pair> = [<hex> <hex>]
                
                default [object:
                    '#'
                    
                    # RRGGBBAA & RRGGBB
                    [
                        def r = [<hex-pair>]
                        def g = [<hex-pair>]
                        def b = [<hex-pair>]
                        def a = [<hex-pair>]?
                    ] | [
                        # RGBA & RGB
                        def r = [<hex>]
                        def g = [<hex>]
                        def b = [<hex>] 
                        def a = [<hex>]?
                    ]
                ]
            }
            
            entry [object: '((' def col = [object: ...<hex-color>] '))']
        `, {
            locationData: {
                start: 'startsAt',
                end: 'endsAt'
            }
        });

        expect(parse('((#fff))')).to.nested.include({
            'col.startsAt': 2,
            'col.endsAt': 5
        });
    });
});
