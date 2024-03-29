import {expect}  from 'chai';
import {compile} from '../../src';

describe('[COM] Nested groups', () => {

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

        expect(parse('CD')).to.deep.equal(['CD']);
        expect(parse('ACD')).to.deep.equal(['A', 'CD']);
        expect(parse('CDACD')).to.deep.equal(['CD', 'A', 'CD']);
        expect(parse('ADC')).to.equal(null);
        expect(parse('DA')).to.equal(null);
    });

    it('Should pay attention to combinators / multipliers', () => {
        const parse = compile(`
            entry <abc> = ['A' ['C' 'D']?]*
        `);

        expect(parse('ACD')).to.deep.equal(['ACD']);
        expect(parse('A')).to.deep.equal(['A']);
        expect(parse('')).to.deep.equal([]);
        expect(parse('AC')).to.deep.equal(null);
    });

    it('Should leave out not-matching group-types', () => {
        const parse = compile(`[
           (A - Z)+
           
           # This will be ignored, but still a requiredment to succeed
           [object: def x = [(a - z)+]]
        ]`);

        expect(parse('ABCabc')).to.equal('ABC');
        expect(parse('ABC')).to.equal(null);
        expect(parse('ab')).to.equal(null);
    });
});
