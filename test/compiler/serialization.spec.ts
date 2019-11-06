import {expect}  from 'chai';
import {compile} from '../../src';

describe('[COM] Type serialization', () => {

    it('Should properly serialize not matched, tagged types', () => {
        const parse = compile(`
            entry {
                <num> = ['0' to '9']
                <abc> = ['a' to 'c']
                <xyz> = ['x' to 'z']
                
                default [
                    [<num#num> <abc#abc>] |
                    [<xyz#xyz>]
                ]
            }
        `);

        expect(parse('x')).to.deep.equal({num: null, abc: null, xyz: 'x'});
        expect(parse('3a')).to.deep.equal({num: '3', abc: 'a', xyz: null});
        expect(parse('3x')).to.deep.equal(null);
    });

    it('Should nullish previously matched groups', () => {
        const parse = compile(`
            entry {
                <num> = ['0' to '9']
                <abc> = ['a' to 'c']
                <xyz> = ['x' to 'z']
                
                default [
                    [<num#a> <abc#b>] |
                    [<num#c> <num#d>]
                ]
            }
        `);

        expect(parse('12')).to.deep.equal({a: null, b: null, c: '1', d: '2'});
        expect(parse('3a')).to.deep.equal({a: '3', b: 'a', c: null, d: null});
        expect(parse('cc')).to.deep.equal(null);
    });

    it('Should properly serialize unmatched combinators', () => {
        const parse = compile(`
            entry {
                <num> = ['0' to '9']
                <abc> = ['a' to 'c']
                <xyz> = ['x' to 'z']
                
                default [
                    [<num#a> <abc#b> | <xyz#c>] |
                    [
                        [<abc#b> <xyz#c> <num#a>] |
                        [<num#a> & <abc#b> & <xyz#c>]
                    ]
                ]
            }
        `);

        expect(parse('1b')).to.deep.equal({a: '1', b: 'b', c: null});
        expect(parse('b0x')).to.deep.equal({a: '0', b: 'b', c: 'x'});
        expect(parse('z8b')).to.deep.equal({a: '8', b: 'b', c: 'z'});
        expect(parse('z88b')).to.deep.equal(null);
    });
});
