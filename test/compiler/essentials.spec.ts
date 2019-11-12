import {expect}  from 'chai';
import {compile} from '../../src';

describe('[COM] Essentials', () => {

    it('Should throw an error on an invalid statements', () => {

        // Missing punctuations
        expect(() => compile('.')).to.throw();
        expect(() => compile('<abc')).to.throw();
        expect(() => compile('<abc> =')).to.throw();
        expect(() => compile('<abc> = [<de]')).to.throw();
        expect(() => compile('<abc> = [<de')).to.throw();
        expect(() => compile('<abc> = { export <abc> = ["A"]')).to.throw();

        // Missing tag
        expect(() => compile('<abc> = [<de#>]')).to.throw();

        // Invalid tag
        expect(() => compile('<abc> = [<de#">]')).to.throw();

        // Unfinished range multiplier
        expect(() => compile('<abc> = [<de>{2,]')).to.throw();
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
