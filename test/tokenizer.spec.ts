import {expect}   from 'chai';
import {tokenize} from '../src/tokenizer';

describe('Tokenizer', () => {

    it('Should properly tokenize different kind of numbers', () => {
        expect(tokenize('-1.32,123,+2.2,2.2.2-22.3')).to.deep.equal([
            {type: 'num', value: -1.32, start: 0, end: 5},
            {type: 'punc', value: ',', start: 5, end: 6},
            {type: 'num', value: 123, start: 6, end: 9},
            {type: 'punc', value: ',', start: 9, end: 10},
            {type: 'num', value: 2.2, start: 10, end: 14},
            {type: 'punc', value: ',', start: 14, end: 15},
            {type: 'num', value: 2.2, start: 15, end: 18},
            {type: 'num', value: 0.2, start: 18, end: 20},
            {type: 'num', value: -22.3, start: 20, end: 25}
        ]);
    });

    it('Should throw an error on unclosed interpolation', () => {
        expect(() => tokenize('"hello {"')).to.throw();
        expect(() => tokenize('"hello {')).to.throw();
    });

    it('Should throw an error unexpected end of string', () => {
        expect(() => tokenize('"hello')).to.throw();
    });
});
