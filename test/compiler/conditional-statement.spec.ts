import {expect}  from 'chai';
import {compile} from '../../src';

describe('[COM] Conditional statement', () => {

    it('Should execute the then-branch', () => {
        const parse = compile(`
            <number> = [(0 - 9)+]
            
            entry [object:
                def value = [<number>]?
                
                if ($value != null) ['A'] else ['B']
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
            <w-num> = [object:
                def value = [<number>]
            ]
            
            entry [object:
                def num = [object: ...<w-num>]?
                
                if ($num.value != null) ['A'] else ['B']
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
            
            entry [object:
                [(a - z)+]
                def num = [<number>]?
                if ($num != null) ['A']
            ]
        `);

        expect(parse('abc')).to.deep.equal({
            num: null
        });
    });

    it('Should evaluate a comparison', () => {
        const parse = compile(`
            <upper> = [(A - Z)+]
            entry [object:
                def upp = [<upper>]
                if ($upp == 'ABC') ['0']
            ]
        `);

        expect(parse('ABC0')).to.not.equal(null);
        expect(parse('ABD')).to.not.equal(null);
        expect(parse('ABD0')).to.equal(null);
    });

    it('Should evaluate a larger-than comparison', () => {
        const parse = compile(`
            <upper> = [(A - Z)+]
            entry [object:
                def upp = [<upper>]
                if ($upp > 'CCC') ['0']
            ]
        `);

        expect(parse('CCZ0')).to.not.equal(null);
        expect(parse('AAA')).to.not.equal(null);
        expect(parse('AAA0')).to.equal(null);
    });

    it('Should properly evaluate an or-operator', () => {
        const parse = compile(`
            <upper> = [(A - Z)+]
            entry [object:
                def upp = [<upper>]
                if ($upp == 'A' | $upp == 'Z') ['0']
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
            
            entry [object:
                def upp = [<upper>]
                def low = [<lower>]
                
                if ($upp == 'AA' & $low == 'bb') ['XY']
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
            
            entry [object:
                def upp = [<upper>]
                def low = [<lower>]
                
                if ($upp == 'AA' | $low < 'cc') ['XY']
            ]
        `);

        expect(parse('AAuuXY')).to.not.equal(null);
        expect(parse('XabXY')).to.not.equal(null);
    });

    it('Should return false for nullish / undefd comparison', () => {
        const parse = compile(`
            <upper> = [(A - Z)+]
            <lower> = [(a - z)+]
            
            entry [object:
                def upp = [<upper>]
                def low = [<lower>]
                
                if ($upp.x < 'x' | $low.x > 'y' | $upp == 'A') [
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
            
            entry [object:
                def upp = [<upper>]
                if ($upp.length > 3) ['x']
            ]
        `);

        expect(parse('ABCDx')).to.not.equal(null);
        expect(parse('ABC')).to.not.equal(null);
        expect(parse('ABCx')).to.equal(null);
    });

    it('Should strictly check falsy values', () => {
        const parse = compile(`
            <upper> = [(A - Z)*]
        
            entry [object:
                def upp = [<upper>]
        
                if ($upp.xy | $upp) ["ab"]
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
            
            entry [object:
                def upp = [<upper>]
                def low = [<lower>]
                def num = [<numbe>]
        
                if ($upp == 'A' & ($low == 'a' | $num == '0')) ['!']
            ]
        `);

        expect(parse('Aa1!')).to.not.equal(null);
        expect(parse('Vc0!')).to.equal(null);
        expect(parse('Ac1!')).to.equal(null);
        expect(parse('Aa1')).to.equal(null);
    });

    it('Should work with a not-equal operator', () => {
        const parse = compile(`
            <upper> = [(A - Z)+]
            
            entry [object:
                def upp = [<upper>]
                if ($upp != 'A') ['!']
            ]
        `);

        expect(parse('B!')).to.not.equal(null);
        expect(parse('A!')).to.equal(null);
    });

    it('Should resolve null-comparison', () => {
        const parse = compile(`
            <upper> = [(A - Z)+]
            
            entry [object:
                def upp = [<upper>]?

                if ($upp == null) ['!']
            ]
        `);

        expect(parse('AA')).to.not.equal(null);
        expect(parse('!')).to.not.equal(null);
        expect(parse('A!')).to.equal(null);
    });

    it('Should resolve array-indecies', () => {
        const parse = compile(`
            entry [object:
                def arr = [array:
                    push [(\\w)+]
                    [',' push [(\\w)+]]*
                ]
                
                if ($arr[0] == 'hello') [
                    '!'
                ]
            ]
        `);

        expect(parse('hello,abc,abc')).to.equal(null);
        expect(parse('abc,abc,abc')).to.deep.equal({
            arr: ['abc', 'abc', 'abc']
        });

        expect(parse('hello,abc,abc!')).to.deep.equal({
            arr: ['hello', 'abc', 'abc']
        });
    });

    it('Should handle else-if statements', () => {
        const parse = compile(`
            <string> = [(A - Z, a - z)+]
            
            entry [object:
                def str = [<string>]?

                if ($str == null) [
                    'nothing'
                ] else if ($str == 'Hello') [
                    ' world'
                ] else if ($str == 'Good') [
                    ' bye'
                ]
            ]
        `);

        expect(parse('nothing')).to.not.equal(null);
        expect(parse('Hello world')).to.not.equal(null);
        expect(parse('Good bye')).to.not.equal(null);
        expect(parse('Hello')).to.equal(null);
        expect(parse('Good')).to.equal(null);
        expect(parse('')).to.equal(null);
    });

    it('Should be able to tell the difference between < and <=', () => {
        const parse = compile(`
            <char> = [(a - z)]

            entry [object:
                def a = [<char>]
                def b = [<char>]

                if ($a < $b) ['<'] 
                else if ($a <= $b) ['<=']
            ]
        `);

        expect(parse('ab<')).to.not.equal(null);
        expect(parse('bb<')).to.equal(null);
        expect(parse('bb<=')).to.not.equal(null);
        expect(parse('cb<=')).to.equal(null);
    });

    it('Should be able to tell the difference between > and >=', () => {
        const parse = compile(`
            <char> = [(a - z)]

            entry [object:
                def a = [<char>]
                def b = [<char>]

                if ($a > $b) ['>'] 
                else if ($a >= $b) ['>=']
            ]
        `);

        expect(parse('ab>')).to.equal(null);
        expect(parse('bb>')).to.equal(null);
        expect(parse('bb>=')).to.not.equal(null);
        expect(parse('cb>')).to.not.equal(null);
    });

    it('Should throw an error if a tag is not defd anywhere', () => {
        const parse = compile(`
            entry [
                if ($lol == 0) []
            ]
        `);

        expect(() => parse('A')).to.throw();
    });

    it('Should throw an error if types aren\'t compatible', () => {
        const parse = compile(`
            <upper> = [(A - Z)+]
            
            entry [object:
                def upp = [<upper>]
                if ($upp > 4) []
            ]
        `);

        expect(() => parse('A')).to.throw();
    });

    it('Should throw an error on unknown constants', () => {
        const parse = compile(`
            <upper> = [(A - Z)+]

            entry [object:
                def upp = [<upper>]
                if ($upp != hello) []
            ]
        `);

        expect(() => parse('A')).to.throw();
    });

    it('Should resolve array indecies', () => {
        const parse = compile(`
            entry [array:
                push [(a, b)+]
                push [(c, d)+]
                push [(e, f)+]
                
                if ($[0] == 'ab') [
                    '!'
                ]
            ]
        `);

        expect(parse('abcccee')).to.equal(null);
        expect(parse('abcccee!')).to.deep.equal([
            'ab', 'ccc', 'ee'
        ]);
    });

    it('Should properly return values from within nested if-statements', () => {
        const parse = compile(`
            entry [object:
                use val = [object:
                    def up = [(A - Z)+]
                    def low = [(a - z)+]
                
                    if ($up == 'ABC') [
                        if ($low == 'abc') [
                            ret "The same"
                        ] else if ($low == 'cba')[
                            ret "The same, but reversed"
                        ] else [
                            ret "Okay, low is '{$low}'!"
                        ]
                    ] else if ($low == 'abc') [
                        ret "Okay, low is {$low " and up is " $up}"
                    ]
                    
                    ret "unknown"
                ]?
                
                if ($val == null) [
                    ret 'failed'
                ]
                
                ret '{$val}'
            ]
        `);

        expect(parse('ABCabc')).to.equal('The same');
        expect(parse('ABCcba')).to.equal('The same, but reversed');
        expect(parse('ABCwoho')).to.equal('Okay, low is \'woho\'!');
        expect(parse('OHOabc')).to.equal('Okay, low is abc and up is OHO');
        expect(parse('OACOabvc')).to.equal('unknown');
        expect(parse('')).to.equal('failed');
    });

    it('Shouold properly resolve unary-expressions', () => {
        const parse = compile(`
            entry [object:
                def x = [(A - Z)+]
                
                if (!($x == 'ABC') | $x == 'XX') [
                    ret 'match'
                ]
                
                ret 'nope'
            ]
        `);

        expect(parse('ABC')).to.equal('match');
        expect(parse('XX')).to.equal('match');
        expect(parse('XAX')).to.equal('nope');
    });
});
