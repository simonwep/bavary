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
});
