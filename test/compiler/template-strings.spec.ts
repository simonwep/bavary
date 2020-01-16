import {expect}  from 'chai';
import {compile} from '../../src';

describe('[COM] Template strings', () => {

    it('Should interpolate a simple value', () => {
        const parse = compile(`[object:
            def val = 'abc'
            '{$val}'
        ]`);

        expect(parse('ab')).to.equal(null);
        expect(parse('abc')).to.deep.equal({
            val: 'abc'
        });
    });

    it('Should throw an error if a template-string is used within a character-selection', () => {
        expect(() =>
            compile(`[object:
                def first = ['A']
                ('A {$first}')+
            ]`)
        ).to.throw();
    });

    it('Should ignore nullpointer', () => {
        const parse = compile('[\'abc{$invalid[23].foo}\']');
        expect(parse('abc')).to.equal('abc');
    });
});
