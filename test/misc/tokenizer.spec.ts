import {expect}   from 'chai';
import {tokenize} from '../../src/tokenizer';

describe('Tokenizer', () => {
    it('Should parse "<num-sign> = [ "+" | "-" ]{2,3}"', () => {
        expect(tokenize('<num-sign> = [ "+" | "-" ]{2,3}')).to.deep.equal([
            {type: 'punc', value: '<', start: 0, end: 1},
            {type: 'kw', value: 'num', start: 1, end: 4},
            {type: 'punc', value: '-', start: 4, end: 5},
            {type: 'kw', value: 'sign', start: 5, end: 9},
            {type: 'punc', value: '>', start: 9, end: 10},
            {type: 'ws', value: ' ', start: 10, end: 11},
            {type: 'punc', value: '=', start: 11, end: 12},
            {type: 'ws', value: ' ', start: 12, end: 13},
            {type: 'punc', value: '[', start: 13, end: 14},
            {type: 'ws', value: ' ', start: 14, end: 15},
            {type: 'str', value: '+', start: 15, end: 18},
            {type: 'ws', value: ' ', start: 18, end: 19},
            {type: 'punc', value: '|', start: 19, end: 20},
            {type: 'ws', value: ' ', start: 20, end: 21},
            {type: 'str', value: '-', start: 21, end: 24},
            {type: 'ws', value: ' ', start: 24, end: 25},
            {type: 'punc', value: ']', start: 25, end: 26},
            {type: 'punc', value: '{', start: 26, end: 27},
            {type: 'num', value: 2, start: 27, end: 28},
            {type: 'punc', value: ',', start: 28, end: 29},
            {type: 'num', value: 3, start: 29, end: 30},
            {type: 'punc', value: '}', start: 30, end: 31}
        ]);
    });

    it('Should skip single-line comments indicated by two slashes (\\\\)', () => {
        expect(tokenize(`
            abc // another comment
            // wow
            123 // nice
        `)).to.deep.equal([
            {type: 'ws', value: '\n            ', start: 0, end: 13},
            {type: 'kw', value: 'abc', start: 13, end: 16},
            {type: 'ws', value: ' \n            \n            ', start: 16, end: 67},
            {type: 'num', value: 123, start: 67, end: 70},
            {type: 'ws', value: ' \n        ', start: 70, end: 87}
        ]);
    });

    it('Should skip multi-line comments wrapped in /**/', () => {
        expect(tokenize(`
            abc 
            /*oooh
             My comment
             over multiple 
             
            lines!*/
            123 // nice
        `)).to.deep.equal([
            {type: 'ws', value: '\n            ', start: 0, end: 13},
            {type: 'kw', value: 'abc', start: 13, end: 16},
            {type: 'ws', value: ' \n            \n            ', start: 16, end: 136},
            {type: 'num', value: 123, start: 136, end: 139},
            {type: 'ws', value: ' \n        ', start: 139, end: 156}
        ]);
    });

    it('Should properly include escaped-characters', () => {
        expect(tokenize(`['\\'']`)).to.deep.equal([
            {type: 'punc', value: '[', start: 0, end: 1},
            {type: 'str', value: '\'', start: 1, end: 5},
            {type: 'punc', value: ']', start: 5, end: 6}
        ]);

        expect(tokenize(`'\\abc'`)).to.deep.equal([
            {type: 'str', value: '\\abc', start: 0, end: 6}
        ]);
    });
});
