import {expect}  from 'chai';
import {compile} from '../../src/core';

describe('[COM] Modifiers', () => {

    it('Should throw an error if modifiers are used on types which don\'t return an object', () => {
        const parse = compile(`
            <char> = [(0 - 9)+]
            
            entry [
                ...<char{
                    def hello = 'world'
                }>
            ]
        `);

        expect(() => parse('0')).to.throw();
    });

    it('Should throw an error if empty', () => {
        expect(() => compile(`
            entry [['A'] where ()]
        `)).to.throw();
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
                <char#char{
                    def hello = 'world',
                    def whata = 'nice day'
                }>
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
                ...<char{
                    def hello = 'world',
                    def whata = 'nice day'
                }>
            ]
        `);

        expect(parse('A8')).to.deep.equal({
            hello: 'world',
            whata: 'nice day',
            number: '8',
            string: 'A'
        });
    });

    it('Should delete properties with the del command', () => {
        const parse = compile(`
            <chars> = {
                export <uppercase> = [(A - Z)+]
                export <lowercase> = [(a - z)+]
            }
            
            <str> = [<chars:uppercase#upper>? <chars:lowercase#lower>?]
            
            entry [
                ...<str{del upper}>

                <str#res{
                    del lower
                }>
            ]
        `);

        expect(parse('abcABC')).to.deep.equal({
            lower: 'abc',
            res: {
                upper: 'ABC'
            }
        });
    });

    it('Should throw an error if del is used on a non-existing property', () => {
        const parse = compile(`
            <uppercase> = [(A - Z)+]
            <str> = [<uppercase#upper>]
            
            entry [
                <str#res{del lol}>
            ]
        `);

        expect(() => parse('ABC')).to.throw();
    });
});
