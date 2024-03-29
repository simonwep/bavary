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

    it('Should throw an error if evaluated value of variables isn\'t a string or number', () => {
        const parse = compile(`[object:
            def a = [object: def res = [(A - Z)+]]
            def cm = '{$a}'
        ]`);

        expect(() => parse('ABC')).to.throw();
    });

    it('Should ignore nullpointer', () => {
        const parse = compile('[\'abc{$invalid[23].foo}\']');
        expect(parse('abc')).to.equal('abc');
    });

    it('Should allow multiple, nested interpolation', () => {
        const parse = compile(`[object:
            def va = [(A - Z)+]
            def vb = [(a - z)+]
            def cm = '{$va ' - ' $vb}'
        ]`);

        expect(parse('FOObar')).to.deep.equal({
            va: 'FOO',
            vb: 'bar',
            cm: 'FOO - bar'
        });
    });
});
