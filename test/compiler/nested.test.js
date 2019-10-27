const {compile} = require('../../src');
const {expect} = require('chai');

describe('Nested groups', () => {

    it('Should properly resolve nested group with optional types', () => {
        const parse = compile(`
            entry <abc> = ['A' ['B' | 'C']]+
        `);

        expect(parse('ABACAB')).to.deep.equal(['AB', 'AC', 'AB']);
    });

    it('Should properly resolve an optional group', () => {
        const parse = compile(`
            entry <abc> = ['A' | ['C' 'D']]+
        `);

        expect(parse('AC')).to.deep.equal(['A', 'C']);
        expect(parse('ACD')).to.deep.equal(['A', 'CD']);
        expect(parse('CDACD')).to.deep.equal(['CD', 'A', 'CD']);
        expect(parse('ADC')).to.equal(null);
        expect(parse('DA')).to.equal(null);
    });

    it('Should pay attention to combinators / multipliers', () => {
        const parse = compile(`
            entry <abc> = ['A' ['C' 'D']?]*
        `);

        expect(parse('AC')).to.deep.equal(['AC']);
        expect(parse('ACD')).to.deep.equal(['ACD']);
        expect(parse('A')).to.deep.equal(['A']);
        expect(parse('')).to.deep.equal([]);
    });
});
