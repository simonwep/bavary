import {expect}  from 'chai';
import {compile} from '../../src/core';

describe('[COM] Position marks', () => {

    it('Should add the __starts and __ends property to an object', () => {
        const parse = compile(`
            <ws> = [' ' | '    ' | '\\\n']*
            <hex-color> = {
                <hex> = [(0 - 9) | (a - f)]
                <hex-pair> = [<hex> <hex>]
                
                default [
                    '#'
                    
                    // RRGGBBAA & RRGGBB
                    [<hex-pair#r> <hex-pair#b> <hex-pair#g> <hex-pair#a>?] |
                    
                    // RGBA & RGB
                    [<hex#r> <hex#b> <hex#g> <hex#a>?]
                ]
            }
            
            entry [
                <ws>
                ...<hex-color>
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
            const {__starts, __ends} = result[i] as {__starts: number; __ends: number};
            expect(__starts).to.equal(starts);
            expect(__ends).to.equal(ends);
        }
    });

    it('Should allow custom location properties', () => {
        const parse = compile(`
            <hex-color> = {
                <hex> = [(0 - 9) | (a - f)]
                <hex-pair> = [<hex> <hex>]
                
                default [
                    '#'
                    
                    // RRGGBBAA & RRGGBB
                    [<hex-pair#r> <hex-pair#b> <hex-pair#g> <hex-pair#a>?] |
                    
                    // RGBA & RGB
                    [<hex#r> <hex#b> <hex#g> <hex#a>?]
                ]
            }
            
            entry ['((' <hex-color#col> '))']
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
