import {expect}   from 'chai';
import {compile,} from '../../src';

describe('[COM] Arguments', () => {

    it('Should inject arguments as types and use defaults as fallback', () => {
        const parse = compile(`
            <escaped sign=['"'] content> = [object:
                <sign>
                def body = [<content>]
                <sign>
            ]
            
            entry [object: ...<escaped content=[(a - z, A - Z)+]>]
        `);

        expect(parse('"hello"')).to.deep.equal({
            body: 'hello'
        });
    });

    it('Should throw an error if an argument is missing', () => {
        expect(() =>
            compile(`
                <escaped content> = ['A']
                entry [<escaped>]
            `)('A')
        ).to.throw();
    });

    it('Should throw an error if target does not expect any arguments', () => {
        expect(() =>
            compile(`
                <escaped> = ['A']
                entry [<escaped abc=["test"]>]
            `)('A')
        ).to.throw();
    });

    it('Should throw an error if redundant arguments were passed', () => {
        expect(() =>
            compile(`
                <escaped efg=['"']> = ['A']
                entry [<escaped abc=["test"]>]
            `)('A')
        ).to.throw();
    });

    it('Should throw an error if arguments are used on block statements', () => {
        expect(() =>
            compile(`
                <escaped efg=['"']> = {}
                entry ['A']
            `)('A')
        ).to.throw();
    });

    it('Should properly resolve a deep reference inside an argument', () => {
        const parse = compile(`
            <escaped sign=['"'] content> = [object:
                <sign>
                def body = [object: ...<content>]
                <sign>
            ]
            
            <utils> = {
                export <uppercase> = [(A - Z)+]
                export <lowercase> = [(a - z)+]
            }
            
            entry [object:
                ...<escaped content=[object:
                    def up = [<utils:uppercase>]
                    ' '
                    def low = [<utils:lowercase>]
                ]>
            ]
        `);

        expect(parse('"HELLO world"')).to.deep.equal({
            body: {
                up: 'HELLO',
                low: 'world'
            }
        });
    });

    it('Should properly clean-up injected types', () => {
        const parse = compile(`
            <wrap-in-braces content> = [
                void ['\\{']
                <content>
                void ['}']
            ]
        
            entry [object: 
                def item = [<wrap-in-braces content=[(\\w)+]>]
            ]+
        `);

        expect(parse('{abc}{def}')).to.deep.equal([
            {item: 'abc'},
            {item: 'def'}
        ]);
    });
});
