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
                if #num.value ['A']
            ]
        `);

        expect(parse('abc')).to.deep.equal({
            num: null
        });
    });
});
