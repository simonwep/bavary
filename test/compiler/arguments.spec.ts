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

        expect(parse('"supernice"')).to.deep.equal({
            body: 'supernice'
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
                entry [<escaped wow=["test"]>]
            `)('A')
        ).to.throw();
    });
});
