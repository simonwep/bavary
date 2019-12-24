import {expect}  from 'chai';
import {compile} from '../../src';

describe('[COM] Conditional statement', () => {

    it('Should execute the then-branch', () => {
        const parse = compile(`
            <number> = [(0 - 9)+]
            
            entry [
                <number#value>?
                
                if #value ['A'] else ['B']
            ]
        `);

        expect(parse('0')).to.equal(null);
        expect(parse('0A')).to.deep.equal({value: '0'});
        expect(parse('0B')).to.deep.equal(null);
        expect(parse('B')).to.deep.equal({value: null});
    });

    it('Should resolve deep accessors', () => {
        const parse = compile(`
            <number> = [(0 - 9)+]
            <w-num> = [<number#value>]
            
            entry [
                <w-num#num>?
                
                if #num.value ['A'] else ['B']
            ]
        `);

        expect(parse('0')).to.equal(null);
        expect(parse('0A')).to.deep.equal({
            num: {
                value: '0'
            }
        });

        expect(parse('0B')).to.equal(null);
        expect(parse('B')).to.deep.equal({num: null});
    });

    it('Should ignore the else branch if none is defined', () => {
        const parse = compile(`
            <number> = [(0 - 9)+]
            
            entry [
                [(a - z)+]
                <number#num>?
                if #num ['A']
            ]
        `);

        expect(parse('abc')).to.deep.equal({
            num: null
        });
    });

    it('Should nagate the condition if the not-keyword is used', () => {
        const parse = compile(`
            <number> = [(0 - 9)+]
            entry [
                <number#num>?
                if not #num ['A']
            ]
        `);

        expect(parse('A')).to.deep.equal({
            num: null
        });
    });

    it('Should evaluate a comparison', () => {
        const parse = compile(`
            <upper> = [(A - Z)+]
            entry [
                <upper#upp>
                if (#upp = 'ABC') ['0']
            ]
        `);

        expect(parse('ABC0')).to.not.equal(null);
        expect(parse('ABD')).to.not.equal(null);
        expect(parse('ABD0')).to.equal(null);
    });

    it('Should evaluate a larger-than comparison', () => {
        const parse = compile(`
            <upper> = [(A - Z)+]
            entry [
                <upper#upp>
                if (#upp > 'CCC') ['0']
            ]
        `);

        expect(parse('CCZ0')).to.not.equal(null);
        expect(parse('AAA')).to.not.equal(null);
        expect(parse('AAA0')).to.equal(null);
    });

    it('Should properly evaluate an or-operator', () => {
        const parse = compile(`
            <upper> = [(A - Z)+]
            entry [
                <upper#upp>
                if (#upp = 'A' | #upp = 'Z') ['0']
            ]
        `);

        expect(parse('A0')).to.not.equal(null);
        expect(parse('Z0')).to.not.equal(null);
        expect(parse('C')).to.not.equal(null);
        expect(parse('A')).to.equal(null);
    });

    it('Should properly evaluate an and-operator', () => {
        const parse = compile(`
            <upper> = [(A - Z)+]
            <lower> = [(a - z)+]
            
            entry [
                <upper#upp>
                <lower#low>
                
                if (#upp = 'AA' & #low = 'bb') ['XY']
            ]
        `);

        expect(parse('AAbbXY')).to.not.equal(null);
        expect(parse('Ab')).to.not.equal(null);
        expect(parse('AAbb')).to.equal(null);
    });

    it('Should evaluate a nested condition', () => {
        const parse = compile(`
            <upper> = [(A - Z)+]
            <lower> = [(a - z)+]
            
            entry [
                <upper#upp>
                <lower#low>
                
                if (#upp = 'AA' | #low < 'cc') ['XY']
            ]
        `);

        expect(parse('AAuuXY')).to.not.equal(null);
        expect(parse('XabXY')).to.not.equal(null);
    });

    it('Should return false for nullish / undefined comparison', () => {
        const parse = compile(`
            <upper> = [(A - Z)+]
            <lower> = [(a - z)+]
            
            entry [
                <upper#upp>
                <lower#low>
                
                if (#upp.x < 'x' | #low.x > 'y' | #upp = 'A') [
                    'XY'
                ]
            ]
        `);

        expect(parse('AuXY')).to.not.equal(null);
        expect(parse('Au')).to.equal(null);
    });

    it('Should compare the length of a string', () => {
        const parse = compile(`
            <upper> = [(A - Z)+]
            
            entry [
                <upper#upp>
                if (#upp.length > 3) ['x']
            ]
        `);

        expect(parse('ABCDx')).to.not.equal(null);
        expect(parse('ABC')).to.not.equal(null);
        expect(parse('ABCx')).to.equal(null);
    });

    it('Should strictly check falsy values', () => {
        const parse = compile(`
            <upper> = [(A - Z)*]
        
            entry [
                <upper#upp>
        
                if (#upp.xy | #upp) ["ab"]
            ]
        `);

        expect(parse('ab')).to.not.equal(null);
        expect(parse('ABab')).to.not.equal(null);
        expect(parse('AB')).to.equal(null);
    });

    it('Should allow bypassing precedence rules and allow parentheses', () => {
        const parse = compile(`
            <upper> = [(A - Z)+]
            <lower> = [(a - z)+]
            <numbe> = [(0 - 9)+]
            
            entry [
                <upper#upp>
                <lower#low>
                <numbe#num>
        
                if (#upp = 'A' & (#low = 'a' | #num = '0')) ['!']
            ]
        `);

        expect(parse('Aa1!')).to.not.equal(null);
        expect(parse('Vc0!')).to.equal(null);
        expect(parse('Ac1!')).to.equal(null);
        expect(parse('Aa1')).to.equal(null);
    });
});
