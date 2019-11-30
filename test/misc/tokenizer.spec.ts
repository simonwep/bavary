import {expect}   from 'chai';
import {tokenize} from '../../src/core/tokenizer';

describe('Tokenizer', () => {
    it('Should parse "<num-sign> = [ "+" | "-" ]{2,3}"', () => {
        expect(tokenize('<num-sign> = [ "+" | "-" ]{2,3}')).to.deep.equal([
            {type: 'punc', value: '<', start: 0, end: 1},
            {type: 'kw', value: 'num', start: 1, end: 4},
            {type: 'punc', value: '-', start: 4, end: 5},
            {type: 'kw', value: 'sign', start: 5, end: 9},
            {type: 'punc', value: '>', start: 9, end: 10},
            {type: 'punc', value: '=', start: 11, end: 12},
            {type: 'punc', value: '[', start: 13, end: 14},
            {type: 'str', value: '+', start: 15, end: 18},
            {type: 'punc', value: '|', start: 19, end: 20},
            {type: 'str', value: '-', start: 21, end: 24},
            {type: 'punc', value: ']', start: 25, end: 26},
            {type: 'punc', value: '{', start: 26, end: 27},
            {type: 'num', value: 2, start: 27, end: 28},
            {type: 'punc', value: ',', start: 28, end: 29},
            {type: 'num', value: 3, start: 29, end: 30},
            {type: 'punc', value: '}', start: 30, end: 31}
        ]);
    });

    it('Should not allow line-breaks in strings', () => {
        expect(tokenize(`"
        "
        `)).to.deep.equal([
            {type: 'punc', value: '"', start: 0, end: 1},
            {type: 'punc', value: '"', start: 10, end: 11}
        ]);
    });

    it('Should skip comments indicated by two slashes (\\\\)', () => {
        expect(tokenize(`
            abc // another comment
            // wow
            123 // nice
        `)).to.deep.equal([
            {type: 'kw', value: 'abc', start: 13, end: 16},
            {type: 'num', value: 123, start: 67, end: 70}
        ]);
    });
});
