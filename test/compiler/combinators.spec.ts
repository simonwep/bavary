import {expect}  from 'chai';
import {compile} from '../../src';

describe('[COM] Combinators', () => {

    it('Should work without combintor', () => {
        const parse = compile('entry ["a" "b" "c"]');

        expect(parse('abc')).to.equal('abc');
        expect(parse('cba')).to.equal(null);
        expect(parse('ab')).to.equal(null);
    });

    it('Should work with "|"', () => {
        const parse = compile('entry ["a" | "b" | "c"]');

        expect(parse('a')).to.equal('a');
        expect(parse('c')).to.equal('c');
        expect(parse('abc')).to.equal(null);
        expect(parse('ab')).to.equal(null);
    });

    it('Should work with "&"', () => {
        const parse = compile('entry ["a" & "b" & "c"]');

        expect(parse('abc')).to.equal('abc');
        expect(parse('bca')).to.equal('bca');
        expect(parse('cba')).to.equal('cba');
        expect(parse('ab')).to.equal(null);
        expect(parse('abb')).to.equal(null);
    });

    it('Should work with "&&"', () => {
        const parse = compile('entry ["a" && "b" && "c"]');

        expect(parse('ab')).to.equal('ab');
        expect(parse('c')).to.equal('c');
        expect(parse('ca')).to.equal('ca');
        expect(parse('abb')).to.equal(null);
        expect(parse('')).to.equal(null);
    });

    it('Should handle mixed combinators', () => {
        const parse = compile(`
            entry { 
                <num> = [(0 - 9)]
                <abc> = [(a - c)]
                <xyz> = [(x - z)]
            
                default [object:
                    ['a' & 'b' & 'c'] | 
                    [
                        def a = [<num>] && 
                        def b = [<abc>] && 
                        def c = [<xyz>]
                    ] | 
                    ['e' | 'f'] | 
                    ['g' 'h']
                ]
            }
        `);

        expect(parse('0x')).to.deep.equal({a: '0', b: null, c: 'x'});
        expect(parse('z')).to.deep.equal({a: null, b: null, c: 'z'});
        expect(parse('y0b')).to.deep.equal({a: '0', b: 'b', c: 'y'});
        expect(parse('gh')).to.deep.equal({a: null, b: null, c: null});
        expect(parse('cba')).to.deep.equal({a: null, b: null, c: null});
        expect(parse('bac')).to.deep.equal({a: null, b: null, c: null});
        expect(parse('e')).to.deep.equal({a: null, b: null, c: null});
        expect(parse('abbc')).to.equal(null);
        expect(parse('cca')).to.equal(null);
        expect(parse('hg')).to.equal(null);
    });

    it('Should handle weirdly mixed combinators', () => {
        const parse = compile(`
            
            # This is exactly the same as [['a' | ['b' & 'c']] ['e' | ['d' & ['e' | 'f']]]]
            entry ['a' | 'b' & 'c' 'e' | ['d' & 'e' | 'f']]
        `);

        expect(parse('ae')).to.equals('ae');
        expect(parse('cbe')).to.equals('cbe');
        expect(parse('ade')).to.equals('ade');
        expect(parse('adf')).to.equals('adf');
        expect(parse('cbde')).to.equals('cbde');
    });
});
