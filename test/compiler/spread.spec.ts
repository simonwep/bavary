import {expect}  from 'chai';
import {compile} from '../../src';

describe('[COM] Spread operator', () => {

    it('Should throw an error if it\'s used on a string', () => {
        const parse = compile(`
            <char> = [array: push [(\\w)+]]
           
            entry {
                default [...<char>]
            }
        `);

        expect(() => parse('A')).to.throw();
    });

    it('Should throw an error if it\'s used on an array', () => {
        const parse = compile(`
            <char> = [object: def x = [(A - Z)+]]
           
            entry {
                default [array: ...<char>]
            }
        `);

        expect(() => parse('A')).to.throw();
    });

    it('Should throw an error if the spread-source is a string', () => {
        const parse = compile(`
            <char> = [(A - Z)+]
           
            entry [array:
                ...<char>
            ]
        `);

        expect(() => parse('A')).to.throw();
    });

    it('Should work with groups', () => {
        const parse = compile(`
            entry [object:
                ...[object:
                    def innr = 'Hello'
                ]
                
                def arr = [array:
                    ...[array:
                        push 'World'
                    ]
                ]
            ]
        `);

        expect(parse('')).to.deep.equal({
            innr: 'Hello',
            arr: [
                'World'
            ]
        });
    });


    it('Should properly assign nested object properties to the parent', () => {
        const parse = compile(`
            <char> = {
                <uppercase> = [(A - Z)+]
                <lowercase> = [(a - z)+]
                
                default [object:
                    [
                        def up = [<uppercase>] 
                        def low = [<lowercase>]
                    ] | [
                        def up = [<uppercase>] | 
                        def low = [<lowercase>]
                    ]
                ]
            }
            
            entry {
                default [object:
                    ...<char> 
                    def num = [(0 - 9)+]
                ]
            }
        `);

        expect(parse('A2')).to.deep.equal({up: 'A', low: null, num: '2'});
        expect(parse('ABC2')).to.deep.equal({up: 'ABC', low: null, num: '2'});
        expect(parse('aa2')).to.deep.equal({up: null, low: 'aa', num: '2'});
        expect(parse('AAaa123')).to.deep.equal({up: 'AA', low: 'aa', num: '123'});
        expect(parse('abc')).to.equal(null);
    });

    it('Should work with arrays', () => {
        const parse = compile(`
            <abcd> = [array:
                push [(a, b)+]
                push [(c, d)+]
            ]
        
            <efgh> = [array:
                push [(e, f)+]
                push [(g, h)+]
            ]
            
            entry [array:
                ...<abcd>
                ...<efgh>
            ]
        `);

        expect(parse('aaccehh')).to.deep.equal([
            'aa', 'cc', 'e', 'hh'
        ]);
    });
});
