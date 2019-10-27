const {compile} = require('../../src');
const {expect} = require('chai');

describe('Nested types', () => {

    it('Should throw an error if more than one entry-type is defined', () => {
        expect(() => compile(`
            entry <abc> = ['A']
            entry <abcd> = ['A']
        `)).to.throw();
    });

    it('Should throw an error if type-names where used multiple types', () => {
        expect(() => compile(`
            <abc> = ['A']
            entry <abc> = ['A']
        `)).to.throw();
    });

    it('Should handle two types', () => {
        const parse = compile(`
            <1-2-3> = ['1' | '2' | '3']
            <a-b-c> = ['A' | 'B' | 'C']
            entry <abc> = [<1-2-3> <a-b-c>?]*
        `);

        expect(parse('1A')).to.deep.equal(['1A']);
        expect(parse('11')).to.deep.equal(['1', '1']);
        expect(parse('B2')).to.equal(null);
    });

    it('Should allow recursive usage of types', () => {
        const parse = compile(`
            entry <rec> = [['A' | 'B' | 'C']+ <rec>]*
        `);

        expect(parse('AB')).to.deep.equal(['AB']);
        expect(parse('AABB')).to.deep.equal(['AABB']);
    });

    it('Should handle optional types', () => {
        const parse = compile(`
            <sign> = ['+' | '-']
            <num> = ['1' | '2']
            entry <abc> = [<sign>? <num>]
        `);

        expect(parse('1')).to.equal('1');
        expect(parse('-2')).to.deep.equal('-2');
        expect(parse('2-')).to.equal(null);
    });
});
