const {compile} = require('../../src');
const {expect} = require('chai');

describe('Very basic tests', () => {

    it('Should compile and parse character definitions', () => {
        const parse = compile(`
            entry <a-b-c> = [ 'A' | 'B' ]
        `);

        expect(parse('A')).to.equal('A');
        expect(parse('B')).to.equal('B');
        expect(parse('C')).to.equal(null);
    });

    it('Should compile and parse simple multipliers', () => {
        const parse = compile(`
            entry <a-b-c> = [ 'A' | 'B' ]+
        `);

        expect(parse('AAAA')).to.deep.equal(['A', 'A', 'A', 'A']);
        expect(parse('BAAB')).to.deep.equal(['B', 'A', 'A', 'B']);
    });

    it('Should compile and parse non-optional sequences', () => {
        const parse = compile(`
            entry <a-b-c> = [ 'A' 'B' ]+
        `);

        expect(parse('ABAB')).to.deep.equal(['AB', 'AB']);
        expect(parse('ABBA')).to.deep.equal(null);
    });

});
