import {expect}  from 'chai';
import {compile} from '../../src/core';

describe('[COM] Pipe-ing', () => {

    it('Should properly resolve and joint result', () => {
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

    it('Shoudl throw an error if target dosn\'t matches the source scheme', () => {
        const parse = compile(`
            <sub-num> = [(0 - 9)]+
            <num> = [<sub-num#sub>]
            <cha> = [(a - z)]+
            
            entry [
                <cha#chars>
                <num> -> chars
            ]
        `);

        expect(() => parse('a1')).to.throw();
    });
});
