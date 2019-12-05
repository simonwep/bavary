import {expect}                from 'chai';
import {compile, compileChunk} from '../../src/core';

describe('[COM] Compile in chunks', () => {

    it('Should accept an array of precompiled chunks', () => {
        const parse = compile(
            [
                ...compileChunk('entry [<abc:foo>]'),
                ...compileChunk('<abc> = {export <foo> = [(A - Z)+ "0"]}')
            ]
        );

        expect(parse('ABCDEFG0')).to.equal('ABCDEFG0');
    });
});
