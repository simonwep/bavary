const {compile} = require('../../src');
const {expect} = require('chai');

describe('[COM] Exports', () => {

    it('Should throw an error if export is used in the global space', () => {
        expect(() => compile(`export <abc> = ['A']`)).to.throw();
    });

    it('Should resolve simple exports', () => {
        const parse = compile(`
            <chars> = {
                export <lowercase-letters> = ['a' to 'z']
            }
    
            entry [<chars:lowercase-letters>+]
        `);

        expect(parse('a')).to.equal('a');
        expect(parse('abc')).to.equal('abc');
        expect(parse('4')).to.equal(null);
    });

    it('Should work in combination with default exports', () => {
        const parse = compile(`
            <chars> = {
                export <lowercase-letters> = ['a' to 'z']
                export <uppercase-letters> = ['A' to 'Z']
                default [<lowercase-letters> <uppercase-letters>]
            }
    
            entry [<chars#chars>]
        `);

        expect(parse('aB')).to.deep.equal({chars: 'aB'});
        expect(parse('zC')).to.deep.equal({chars: 'zC'});
        expect(parse('4')).to.equal(null);
    });

    it('Should properly resolve nested exports and usage', () => {
        const parse = compile(`
            <chars> = {
                export <numbers> = ['0' to '9']
                export <string-stuff> = {
                    export <lowercase-letters> = ['a' to 'z']
                    export <uppercase-letters> = ['A' to 'Z']
                    default [<lowercase-letters> | <uppercase-letters>]+
                }
                
                default [<numbers> | <string-stuff>]
            }
            
            entry [<chars:string-stuff:lowercase-letters#deep> | <chars:string-stuff#mixed> | <chars:numbers>]
        `);


        expect(parse('a')).to.deep.equal({deep: 'a'});
        expect(parse('ABb')).to.deep.equal({mixed: ['A', 'B', 'b']});
        expect(parse('4')).to.equal('4');
    });
});
