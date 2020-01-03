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
        const parse = compile('entry [(a - b, b - z except f - j)+]');

        expect(parse('abcde')).to.equal('abcde');
        expect(parse('klm')).to.equal('klm');
        expect(parse('gh')).to.equal(null);
        expect(parse('f')).to.equal(null);
        expect(parse('j')).to.equal(null);
    });

    it('Should work with hex characters points', () => {
        const parse = compile('entry [(. except \\xffa1)+]');

        expect(parse('äüö')).to.equal('äüö');
        expect(parse('xlkjﾡ')).to.equal(null);
    });

    it('Should work with octal character points', () => {
        const parse = compile('entry [(\\141 - \\172)+]');

        expect(parse('abcdefgz')).to.equal('abcdefgz');
        expect(parse('abcDc')).to.equal(null);
    });

    it('Should throw an error on invalid hex values', () => {
        expect(() => compile('entry [(\\xz000)]')).to.throw();
        expect(() => compile('entry [(\\xf00)]')).to.throw();
    });

    it('Should work with multipliers', () => {
        const parse = compile(`
            entry [(A - Z)? (a - z except f - j){3, 5}]
        `);

        expect(parse('abc')).to.equal('abc');
        expect(parse('abcd')).to.equal('abcd');
        expect(parse('abcde')).to.equal('abcde');
        expect(parse('Aabc')).to.equal('Aabc');
        expect(parse('aA')).to.equal(null);
        expect(parse('abcdef')).to.equal(null);
        expect(parse('ab')).to.equal(null);
    });

    it('Should work with the n-infinity multipliers', () => {
        const parse = compile(`
            entry [(a - z){3,}]
        `);

        expect(parse('abc')).to.equal('abc');
        expect(parse('abcdefg')).to.equal('abcdefg');
        expect(parse('ab')).to.equal(null);
    });

    it('Should translate the common token: \\t (tab)', () => {
        const parse = compile(`
            entry [(\\t)+]
        `);

        expect(parse('\t\t\t')).to.equal('\t\t\t');
        expect(parse('\t\n\t')).to.equal(null);
    });

    it('Should translate the common token: \\n (newline)', () => {
        const parse = compile(`
            entry [(\\n)+]
        `);

        expect(parse('\n\n')).to.equal('\n\n');
        expect(parse('\ns\n')).to.equal(null);
    });

    it('Should translate the common token: \\s (whitespace)', () => {
        const parse = compile(`
            entry [(\\s)+]
        `);

        expect(parse('      \t\n')).to.equal('      \t\n');
        expect(parse('    s  \t\n')).to.equal(null);
    });

    it('Should translate the common token: \\d (digit)', () => {
        const parse = compile(`
            entry [(\\d)+]
        `);

        expect(parse('0123456789')).to.equal('0123456789');
        expect(parse('01234 56789')).to.equal(null);
    });

    it('Should translate the common token: \\w (word character)', () => {
        const parse = compile(`
            entry [(\\w)+]
        `);

        expect(parse('HelloWorld_')).to.equal('HelloWorld_');
        expect(parse('Hello World_')).to.equal(null);
    });

    it('Should translate the common token: . (anything)', () => {
        const parse = compile(`
            entry [(. except \\d)+]
        `);

        expect(parse('hello world!')).to.equal('hello world!');
        expect(parse('hello world 2!')).to.equal(null);
    });
});
