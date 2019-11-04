const {compile} = require('../../src');
const {expect} = require('chai');

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

    it('Should handle mixed combinators', () => {
        const parse = compile(`
            entry {
                <num> = ['0' to '9']
                <abc> = ['a' to 'c']
                <xyz> = ['x' to 'z']
            
                default [
                    [<num#a> && <abc#b> && <xyz#c>] | 
                    ['a' & 'b' & 'c'] | 
                    ['e' | 'f'] | 
                    ['g' 'h']
                ]
            }
        `);

        expect(parse('0x')).to.deep.equal({a: '0', b: null, c: 'x'});
        expect(parse('z')).to.deep.equal({a: null, b: null, c: 'z'});
        expect(parse('y0b')).to.deep.equal({a: '0', b: 'b', c: 'y'});
        expect(parse('gh')).to.equal('gh');
        expect(parse('e')).to.equal('e');
        expect(parse('abbc')).to.equal(null);
        expect(parse('cca')).to.equal(null);
        expect(parse('hg')).to.equal(null);
    });
});
