import {expect}  from 'chai';
import {compile} from '../../src';

describe('[COM] Exports', () => {

    it('Should throw an error if export is used in the global space', () => {
        expect(() => compile('export <abc> = ["A"]')).to.throw();
    });

    it('Should resolve simple exports', () => {
        const parse = compile(`
            <chars> = {
                export <LowercaseLetters> = [(a - z)]
            }
    
            entry [<chars:LowercaseLetters>+]
        `);

        expect(parse('a')).to.equal('a');
        expect(parse('abc')).to.equal('abc');
        expect(parse('4')).to.equal(null);
    });

    it('Should work in combination with default exports', () => {
        const parse = compile(`
            <chars> = {
                export <LowercaseLetters> = [(a - z)+]
                export <UppercaseLetters> = [(A - Z)+]
                default [<LowercaseLetters> <UppercaseLetters>]
            }
    
            entry [object: def chars = [<chars>]]
        `);

        expect(parse('aB')).to.deep.equal({chars: 'aB'});
        expect(parse('zC')).to.deep.equal({chars: 'zC'});
        expect(parse('4')).to.equal(null);
    });

    it('Should properly resolve nested exports and usage', () => {
        const parse = compile(`
            <chars> = {
                export <numbers> = [(0 - 9)]
                export <StringStuff> = {
                    export <LowercaseLetters> = [(a - z)]
                    export <UppercaseLetters> = [(A - Z)]
                    default [<LowercaseLetters> | <UppercaseLetters>]+
                }
                
                default [<numbers> | <StringStuff>]
            }
            
            entry [object:
                def deep = [<chars:StringStuff>] | 
                def mixed = [array: <chars:StringStuff>] | 
                <chars:numbers>
            ]
        `);


        expect(parse('a')).to.deep.equal({deep: 'a', mixed: null});
        expect(parse('ABb')).to.deep.equal({deep: 'ABb', mixed: null});
        expect(parse('4')).to.deep.equal({deep: null, mixed: null});
    });

    it('Should throw an error if a name is used more than once', () => {
        expect(() =>
            compile(`
                <abc> = [
                    export <sup> </sup>
                ]
                
                entry [<abc>]
            `)
        ).to.throw();
    });

    it('Should throw an error if path does not point to a block', () => {
        expect(() => compile(`
            <escaped> = ["A"]
            entry [<escaped:abc>]
        `)('A')).to.throw();

        expect(() => compile(`
            <escaped> = {
                export <abc> = {}
            }
            
            entry [<escaped:abc:aha:deep>]
        `)('A')).to.throw();
    });

    it('Should allow named default exports', () => {
        const parse = compile(`
            <utils> = {
                <lowercase> = [(a - z)+]
                default <uppercase> = [(A - Z)+]
                export <both> = [<lowercase> <uppercase>]
            }
            
            entry [<utils:both>]
        `);

        expect(parse('abcABC')).to.equal('abcABC');
    });
});
