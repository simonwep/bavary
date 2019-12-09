import {expect}   from 'chai';
import {compile,} from '../../src';

describe('[COM] Arguments', () => {

    it('Should inject arguments as types and use defaults as fallback', () => {
        const parse = compile(`
            <escaped sign=['"'] content> = [
                <sign>
                <content#body>
                <sign>
            ]
            
            entry [...<escaped content=[(a - z, A - Z)+]>]
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

    it('Should properly resolve a deep reference inside an argument', () => {
        const parse = compile(`
            <escaped sign=['"'] content> = [
                <sign>
                <content#body>
                <sign>
            ]
            
            <utils> = {
                export <uppercase> = [(A - Z)+]
                export <lowercase> = [(a - z)+]
            }
            
            entry [
                ...<escaped content=[
                    <utils:uppercase#up>
                    ' '
                    <utils:lowercase#low>
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
});
