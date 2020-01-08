import {expect}  from 'chai';
import {compile} from '../../src';

describe('[COM] Spread operator', () => {

    it('Should throw an error if it\'s used on a string', () => {
        const parse = compile(`
            <char> = [(A - Z)+]
           
            entry {
                default [...<char>]
            }
        `);

        expect(() => parse('A')).to.throw();
    });

    it('Should throw an error if it\'s used on an array', () => {
        const parse = compile(`
            <char> = [[(A - Z)]+]
           
            entry {
                default [...<char>]
            }
        `);

        expect(() => parse('A')).to.throw();
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
});
