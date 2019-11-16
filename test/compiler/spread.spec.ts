import {expect}  from 'chai';
import {compile} from '../../src/core';

describe('[COM] Spread operator', () => {

    it('Should properly assign nested object properties to the parent', () => {
        const parse = compile(`
            <char> = {
                <uppercase> = [(A - Z)+]
                <lowercase> = [(a - z)+]
                default [
                    [<uppercase#up> <lowercase#low>] |
                    [<uppercase#up> | <lowercase#low>]
                ]
            }
            
            <num> = [(0 - 9)+]
            
            entry {
                default [...<char> <num#num>]
            }
        `);

        expect(parse('A2')).to.deep.equal({up: 'A', low: null, num: '2'});
        expect(parse('ABC2')).to.deep.equal({up: 'ABC', low: null, num: '2'});
        expect(parse('aa2')).to.deep.equal({up: null, low: 'aa', num: '2'});
        expect(parse('AAaa123')).to.deep.equal({up: 'AA', low: 'aa', num: '123'});
        expect(parse('abc')).to.equal(null);
    });

    it('Should throw an error if it\'s used on a type which returns a string', () => {
        const parse = compile(`
            <char> = [(A - Z)+]
           
            entry {
                default [...<char>]
            }
        `);

        expect(() => parse('A')).to.throw();
    });

    it('Should throw an error if it\'s used on a type which returns an array', () => {
        const parse = compile(`
            <char> = [[(A - Z)]+]
           
            entry {
                default [...<char>]
            }
        `);

        expect(() => parse('A')).to.throw();
    });
});