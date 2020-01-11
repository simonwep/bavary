import {expect}  from 'chai';
import {compile} from '../../src';

describe('[COM] Essentials', () => {

    it('Should throw on invalid entry-statements', () => {

        // Global types used but no entry type defined
        expect(() => compile('<abc> = ["A"] ["B"]')).to.throw();

        // Random, non-valid string
        expect(() => compile('{')).to.throw();
    });

    it('Should throw an error if no entry-type is defined', () => {
        expect(() => compile('<abc> = ["A"]')).to.throw();
    });

    it('Should throw an error for invalid, global declaration variants', () => {

        // Nothing can be globally exported
        expect(() => compile(`
            export <abc> = ["A"]
            entry [<abc>]
        `)).to.throw();

        // There is nothing such as a global "default"
        expect(() => compile(`
            default <abc> = ["A"]
            entry [<abc>]
        `)).to.throw();
    });

    it('Should assume an entry-value if only a group were passed as value', () => {
        const parse = compile('[\'A\' | \'B\']');
        expect(parse('A')).to.equal('A');
    });

    it('Should compile and parse character definitions', () => {
        const parse = compile(`
            entry <abc> = ['A' | 'B']
        `);

        expect(parse('A')).to.equal('A');
        expect(parse('B')).to.equal('B');
        expect(parse('C')).to.equal(null);
    });

    it('Should compile and parse simple multipliers', () => {
        const parse = compile(`
            entry <abc> = ['A' | 'B']+
        `);

        expect(parse('AAAA')).to.deep.equal(['A', 'A', 'A', 'A']);
        expect(parse('BAAB')).to.deep.equal(['B', 'A', 'A', 'B']);
    });

    it('Should compile and parse non-optional, one-infinity sequences', () => {
        const parse = compile(`
            entry <abc> = ['A' 'B']+
        `);

        expect(parse('ABAB')).to.deep.equal(['AB', 'AB']);
        expect(parse('ABBA')).to.deep.equal(null);
    });

    it('Should compile and parse zero-infinity sequences', () => {
        const parse = compile(`
            <spaces> = [(' ')*]
            entry [<spaces> 'a']
        `);

        expect(parse('a')).to.equal('a');
        expect(parse('   a')).to.equal('   a');
    });

    it('Should accept types which may return nothing', () => {
        const parse = compile(`
            entry <abc> = ['A' 'B']*
        `);

        expect(parse('')).to.deep.equal([]);
    });

    it('Should compile and parse range sequences', () => {
        const parse = compile(`
            entry <abc> = ['A' 'B']{2,3}
        `);

        expect(parse('ABAB')).to.deep.equal(['AB', 'AB']);
        expect(parse('ABABAB')).to.deep.equal(['AB', 'AB', 'AB']);
        expect(parse('ABABABAB')).to.deep.equal(null);
        expect(parse('AB')).to.deep.equal(null);
    });
});
