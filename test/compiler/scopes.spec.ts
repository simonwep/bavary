import {expect}  from 'chai';
import {compile} from '../../src/core';

describe('[COM] Scopes', () => {

    it('Should throw an error on multiple defaults', () => {
        expect(() => compile(`
            <abc> = {
                default ['A']
                default ['B']
            }
            
            entry [<abc>]
        `)).to.throw();
    });

    it('Should throw an error on re-used names', () => {
        expect(() => compile(`
            <abc> = { default ['A'] }
            <abc> = { default ['B'] }
            
            entry [<abc>]
        `)).to.throw();
    });

    it('Should not throw an error on deeply re-used names', () => {
        expect(() => compile(`
            <abc> = { 
                <abc> = { default ['B'] }
                default ['A'] 
            }
            
            entry [<abc>]
        `)).to.not.throw();
    });

    it('Should throw an error on invalid usage of the entry keyword', () => {
        expect(() => compile(`
            <abc> = { 
                <abc> = { entry ['B'] }
                default ['A'] 
            }
            
            entry [<abc>]
        `)).to.throw();
    });

    it('Should throw an error if a reference points to a "private" type', () => {
        const parse = compile(`
            <abc> = { 
                <private> = ['A']
            }
            
            entry [<abc:private>]
        `);

        expect(() => parse('A')).to.throw();
    });

    it('Should throw an error if a default export is missing', () => {
        const parse = compile(`
            <abc> = {
                <a> = ['A']
            }
            
            entry [<abc>]
        `);

        expect(() => parse('A')).to.throw();
    });

    it('Should throw an error if user tries to resolve a type inside a group', () => {
        const parse = compile(`
            <abc> = {
               export <a> = ['A']
            }
            
            entry [<abc:a:b>]
        `);

        expect(() => parse('A')).to.throw();
    });

    it('Should throw an error if user tries to resolve a undefined type', () => {
        const parse = compile(`
            <abc> = {
               export <a> = ['A']
            }
            
            entry [<abc:c>]
        `);

        expect(() => parse('A')).to.throw();
    });

    it('Should resolve a block as entry type', () => {
        const parse = compile(`
            entry {
                default ['A']
            }
        `);

        expect(parse('A')).to.equal('A');
        expect(parse('B')).to.equal(null);
    });

    it('Should properly scope types', () => {
        const parse = compile(`
            <uppercase> = {
                <val> = [(A - Z)+]
                default [<val>]
            }
            
            <uppercase-lowercase> = {
                <val> = [(a - z)+]
                default [<val> | <uppercase>]
            }
            
            entry [<uppercase-lowercase>]
        `);

        expect(parse('ABACAB')).to.deep.equal('ABACAB');
    });

    it('Should resolveReference scopes with anonym default blocks', () => {
        const parse = compile(`
            <uppercase> = {
                default [(A - Z)+]
            }
            
            <lowercase> = {
                default [(a - z)+]
            }
            
            entry [<lowercase> | <uppercase>]
        `);

        expect(parse('ABACAB')).to.deep.equal('ABACAB');
    });

    it('Should work with nested scopes', () => {
        const parse = compile(`
            <characters> = {
                <uppercase> = {
                    default ['ABC']
                }
            
                <lowercase> = {
                    default ['abc']
                }
                
                default [<uppercase> | <lowercase>]
            }
            
            entry [<characters#result>+]
        `);

        expect(parse('ABCabzABC')).to.equal(null);
        expect(parse('ABCabcABC')).to.deep.equal({'result': ['ABC', 'abc', 'ABC']});
    });

    it('Should properly resolve complex nested scopes', () => {
        const parse = compile(`
            <chars> = {
                <a> = ['A']
                
                export <set> = {
                    default [<a>]
                }
            }
            
            <abc> = {
                <c> = ['C']
                
                export <a> = {
                    default [<chars:set> | <c>]
                }
            }

            entry {
                <b> = ['B']
                
                default {
                    default {
                        default [<b> | <abc:a>]
                    }
                }
            }
        `);

        expect(parse('A')).to.equal('A');
        expect(parse('C')).to.equal('C');
    });

    it('Should work if the entry is a group', () => {
        const parse = compile(`
            <abc> = {
                <a> = ['A']
                default [<a>]
            }
            
            entry [
                <abc>
            ]
        `);

        expect(parse('A')).to.equal('A');
        expect(parse('c')).to.equal(null);
    });

    it('Should revert invalid matches', () => {
        const parse = compile(`
            <abc> = {
                export <a> = ['A']
                export <b> = ['B']
                export <c> = ['C']
                default [<a> | <b> | <c>]
            }
            
            entry [
                [<abc:a> <abc:b>] |
                [<abc>]
            ]
        `);

        expect(parse('A')).to.equal('A');
        expect(parse('C')).to.equal('C');
        expect(parse('AB')).to.equal('AB');
    });
});
