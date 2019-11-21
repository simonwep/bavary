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

    it('Should concat arrays while using multipliers', () => {
        const parse = compile(`
            <num> = [(0 - 9)]
            <cha> = [(a - z)]
            
            entry [
                <num#numma>+
                <cha>+ -> numma
            ]
        `);

        expect(parse('123abc')).to.deep.equal({
            numma: ['1', '2', '3', 'a', 'b', 'c']
        });
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

    it('Sould concat two strings', () => {
        const parse = compile(`
            <str> = [(a - z, A - Z)+]
            <num> = [(0 - 9)+]
        
            entry [
                <str#total>
                <num> -> total
            ]
        `);

        expect(parse('abc123')).to.deep.equal({
            total: 'abc123'
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

        // Array != Array
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

        // Object != Object
        expect(() => compile(`
            <sub-num> = [(0 - 9)]+
            <num> = [<sub-num#sub>]
            <cha> = [(a - z)]+
            
            entry [
                <cha#chars>
                <num> -> chars
            ]
        `)('a1')).to.throw();

        // String != String
        expect(() => compile(`
            <sub-num> = [(0 - 9)]+
            <num> = [<sub-num#sub>]
            <cha> = [(a - z)+]
            
            entry [
                <cha#chars>
                <num> -> chars
            ]
        `)('a1')).to.throw();
    });
});
