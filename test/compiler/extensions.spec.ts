import {expect}  from 'chai';
import {compile} from '../../src/core';

describe('[COM] Extensions', () => {

    it('Should throw an error if extensions are used on types which don\'t return an object', () => {
        const parse = compile(`
            <char> = [(0 - 9)+]
            
            entry [
                ...<char> with (
                    hello = 'world'
                )
            ]
        `);

        expect(() => parse('0')).to.throw();
    });

    it('Should properly work stand-alone', () => {
        const parse = compile(`
            <char> = {
                <num> = [(0 - 9)+]
                <cha> = [[(a - z) | (A - Z)]+]
                default [
                    <num#number>
                    <cha#string>
                ]
            }
            
            entry [
                <char#char> with (
                    hello = 'world',
                    whata = 'nice day'
                )
            ]
        `);

        expect(parse('8A')).to.deep.equal({
            char: {
                hello: 'world',
                whata: 'nice day',
                number: '8',
                string: 'A'
            }
        });
    });

    it('Should properly work with the spread operator', () => {
        const parse = compile(`
            <char> = {
                <num> = [(0 - 9)+]
                default [ <num#number>]
            }
            
            <cha> = [[(a - z) | (A - Z)]+]
            
            entry [
                <cha#string>
                ...<char> with (
                    hello = 'world',
                    whata = 'nice day'
                )
            ]
        `);

        expect(parse('A8')).to.deep.equal({
            hello: 'world',
            whata: 'nice day',
            number: '8',
            string: 'A'
        });
    });

    it('Should work on groups', () => {
        const parse = compile(`
            entry [
                [(0 - 9)+] with (hello = 'world')
            ]
        `);

        expect(parse('10')).to.deep.equal({
            hello: 'world'
        });
    });
});
