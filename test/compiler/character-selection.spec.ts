import {expect}  from 'chai';
import {compile} from '../../src';

describe('[COM] Character selection', () => {

    it('Should match characters in simple ranges', () => {
        const parse = compile('entry [(a - z)]');

        expect(parse('a')).to.equal('a');
        expect(parse('b')).to.equal('b');
        expect(parse('4')).to.equal(null);
    });

    it('Should recognize a lowercase/uppercase difference', () => {
        const parse = compile('entry [(A - Z)]');

        expect(parse('A')).to.equal('A');
        expect(parse('b')).to.equal(null);
        expect(parse('4')).to.equal(null);
    });

    it('Should return null for excludet character', () => {
        const parse = compile('entry [(a - z except f - j)+]');

        expect(parse('abcde')).to.equal('abcde');
        expect(parse('klm')).to.equal('klm');
        expect(parse('gh')).to.equal(null);
        expect(parse('f')).to.equal(null);
        expect(parse('j')).to.equal(null);
    });

    it('Should work with unicode escapes', () => {
        const parse = compile('entry [[(\\u0000 - \\uffff except \\uffa1)]+]');

        expect(parse('äüö')).to.equal('äüö');
        expect(parse('xlkjﾡ')).to.equal(null);
    });

    it('Should work with multipliers', () => {
        const parse = compile(`
            entry [(A - Z)? (a - z except f - j){3,5}]
        `);

        expect(parse('abc')).to.equal('abc');
        expect(parse('abcd')).to.equal('abcd');
        expect(parse('abcde')).to.equal('abcde');
        expect(parse('Aabc')).to.equal('Aabc');
        expect(parse('aA')).to.equal(null);
        expect(parse('abcdef')).to.equal(null);
        expect(parse('ab')).to.equal(null);
    });
});
