import {expect}  from 'chai';
import {compile} from '../../src';

describe('[COM] Nested types', () => {

    it('Should throw an error if type cannot be found', () => {
        expect(() => compile(`
            entry [<unknown>]
        `)('A')).to.throw();

        expect(() => compile(`
            <unknown> = {}
            entry [<unknown:abc>]
        `)('A')).to.throw();
    });

    it('Should throw an error if more than one entry-type is defined', () => {
        expect(() => compile(`
            entry <abc> = ['A']
            entry <abcd> = ['A']
        `)).to.throw();
    });

    it('Should throw an error if type-names were used multiple times', () => {
        expect(() => compile(`
            <abc> = ['A']
            entry <abc> = ['A']
        `)).to.throw();
    });

    it('Should throw an error on empty types', () => {
        expect(() => compile(`
            entry <> = ['A']
        `)).to.throw();
    });

    it('Should handle two types', () => {
        const parse = compile(`
            <OTT> = ['1' | '2' | '3']
            <ABC> = ['A' | 'B' | 'C']
            entry <abc> = [<OTT> <ABC>?]*
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

    it('Should make a difference between types in lower- and uppercase', () => {
        const parse = compile(`
            <STRING> = [(A - Z)]
            <string> = [(a - z)]
            
            entry [[<string> | <STRING>]+]
        `);

        expect(parse('abc')).to.equal('abc');
        expect(parse('ABC')).to.equal('ABC');
        expect(parse('abCDef')).to.equal('abCDef');
    });
});
