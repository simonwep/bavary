import {expect}  from 'chai';
import {compile} from '../../src';

describe('[COM] Scopes', () => {

    it('Should properly scope types', () => {
        const parse = compile(`
            <uppercase> = {
                <val> = [['A' to 'Z']+]
                default [<val>]
            }
            
            <uppercase-lowercase> = {
                <val> = [['a' to 'z']+]
                default [<val> | <uppercase>]
            }
            
            entry [<uppercase-lowercase>]
        `);

        expect(parse('ABACAB')).to.deep.equal('ABACAB');
    });

    it('Should resolveScope scopes with anonym default blocks', () => {
        const parse = compile(`
            <uppercase> = {
                default [['A' to 'Z']+]
            }
            
            <lowercase> = {
                default [['a' to 'z']+]
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
                export <a> = {
                    default [<chars:set>]
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
        expect(parse('c')).to.equal(null);
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

    it('Should revert invalid matches', ()=>{
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
    })
});
