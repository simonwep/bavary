import {expect}  from 'chai';
import {compile} from '../../src/core';

describe('[COM] Containers', () => {

    it('Should properly resolve a reference', () => {
        const parse = compile(`
            <vals> = {
               export <high> = [(A - Z)+]
               export <low> = [(a - z)+]
            }
            
            entry [
                <vals:high#high>
                <vals:low#low>
            ]
        `);

        expect(parse('abcABC')).to.equal(null);
        expect(parse('ABCabc')).to.deep.equal({
            high: 'ABC',
            low: 'abc'
        });
    });

    it('Should properly work with ab inlined group', () => {
        const parse = compile(`
            entry [
                <[(A - Z)+]#high>
                <[(a - z)+]#low>
            ]
        `);

        expect(parse('abcABC')).to.equal(null);
        expect(parse('ABCabc')).to.deep.equal({
            high: 'ABC',
            low: 'abc'
        });
    });
});
