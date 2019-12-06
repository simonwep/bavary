import {expect}  from 'chai';
import {compile} from '../../src';

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

    it('Should throw an error on invalid accessor-paths', () => {

        // Object -> Array conflict
        expect(() => compile(`
            <upper> = [(A - Z)+]
            <up> = [<upper#upper>]
            <chars> = [<up#up>]

            entry [
                <chars#chars{
                    del up[1]
                }>
            ]
        `)('ABC')).to.throw();

        // Array -> Object conflict
        expect(() => compile(`
            <up> = [(A - Z)]+
            <chars> = [<up#up>]

            entry [
                <chars#chars{
                    del up.abc
                }>
            ]
        `)('ABC')).to.throw();

        // Parent isn't an array or object
        expect(() => compile(`
            <up> = [(A - Z)+]
            <chars> = [<up#up>]

            entry [
                <chars#chars{
                    del up[1]
                }>
            ]
        `)('ABC')).to.throw();

        // Parent couldn't be resolve
        expect(() => compile(`
            <high> = [(A - Z)]+
            
            entry [
                <high#noice{
                    del abc.ab
                }>
            ]
        `)('ABC')).to.throw();
    });

    it('Should remove a first-level array entry', () => {
        const parse = compile(`
            <high> = [(A - Z)]+
            
            entry [
                <high#res{
                    del [2]
                }>
            ]
        `);

        expect(parse('ABCC')).to.deep.equal({
            res: [
                'A', 'B', 'C'
            ]
        });
    });

    it('Should remove nested properties and array entries', () => {
        const parse = compile(`
           <low> = [(a - z)+]
           <high> = [(A - Z)]+
           <num> = [(0 - 9)+]
           <high-low> = [<low#low> <high#high>]
           
           <prog> = [
               <num#num>
               <high-low#hl>
           ]
           
           entry [
               <prog#prog{
                   del hl.low,
                   del hl.high[1]
               }>
           ]
        `);

        expect(parse('123abcABC')).to.deep.equal({
            prog: {
                num: '123',
                hl: {
                    high: [
                        'A',
                        'C'
                    ]
                }
            }
        });
    });

    it('Should define properties using nested properties', () => {
        const parse = compile(`
            <num> = [(0 - 9)]+

            <highlow> = {
                <high> = [(A - Z)+]
                <low> = [(a - z)+]

                default [<high#h> <low#low>]
            }

            <puncs> = {
                <punc-a> = ['-']
                <punc-b> = ['+']
                default [<punc-a#a> <punc-b#b>]+
            }

            <type> = [
                <highlow#mix> <num#num> <puncs#punc>
            ]

            entry [
                <type#sup{
                    def simple = mix.h,
                    def numref = num,
                    def num0 = num[0],
                    def num2 = num[2],
                    def num10 = num[10],
                    def puncinv = punc[2].a.b,
                    def puncinv2 = punc.a,
                    def punc2a = punc[2].a,
                    def punc5a = punc[5].a
                }>
            ]
        `);

        expect(parse('ABCabc124-+-+-+')).to.deep.equal({
            sup: {
                mix: {h: 'ABC', low: 'abc'},
                num: ['1', '2', '4'],
                punc: [
                    {a: '-', b: '+'},
                    {a: '-', b: '+'},
                    {a: '-', b: '+'}
                ],
                simple: 'ABC',
                numref: ['1', '2', '4'],
                num0: '1',
                num2: '4',
                num10: null,
                puncinv: null,
                puncinv2: null,
                punc2a: '-',
                punc5a: null
            }
        });
    });
});
