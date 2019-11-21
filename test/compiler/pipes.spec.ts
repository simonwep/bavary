import {expect}  from 'chai';
import {compile} from '../../src/core';

describe('[COM] Pipe-ing', () => {

    it('Should properly resolve and join an array', () => {
        const parse = compile(`
            <num> = [(0 - 9)]+
            <cha> = [(a - z)]+
            
            entry [
                <cha#chars>
                <num> -> chars
            ]
        `);

        expect(parse('abc123')).to.deep.equal({chars: ['a', 'b', 'c', '1', '2', '3']});
    });

    it('Should join an object', () => {
        const parse = compile(`
            <num> = [(0 - 9)]+
            <cha> = [(a - z)]+
            <nums> = [<num#numbers>]
            <chas> = [<cha#characters>]
            
            entry [
                <nums#numma>
                <chas> -> numma
            ]
        `);

        expect(parse('123abc')).to.deep.equal({
            numma: {
                numbers: ['1', '2', '3'],
                characters: ['a', 'b', 'c']
            }
        });
    });

    it('Should throw an error if the target isn\'t defined yet', () => {
        const parse = compile(`
            <num> = [(0 - 9)]+
            <cha> = [(a - z)]+
            
            entry [
                <num> -> chars
                <cha#chars>
            ]
        `);

        expect(() => parse('1a')).to.throw();
    });

    it('Should throw an error if target dosn\'t matches the source scheme', () => {

        // Array != object
        expect(() => compile(`
            <num> = [(0 - 9)]+
            <cha> = [(a - z)]+
            <nums> = [<num#numbers>]
            <chas> = [<cha#characters>]
            
            entry [
                <nums#numma>
                <cha> -> numma
            ]
        `)('4a')).to.throw();

        // Object != Array
        expect(() => compile(`
            <sub-num> = [(0 - 9)]+
            <num> = [<sub-num#sub>]
            <cha> = [(a - z)]+
            
            entry [
                <cha#chars>
                <num> -> chars
            ]
        `)('a1')).to.throw();
    });
});
