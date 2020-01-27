import {expect}  from 'chai';
import {compile} from '../../src';

describe('[COM] Operations', () => {

    it('Should assume a string if no group-type was defined', () => {
        const parse = compile(`
            entry [(\\w)+]
        `);

        expect(parse('Hello')).to.equal('Hello');
    });

    it('Should define properties within objects', () => {
        const parse = compile(`
            entry [object:
                def low = [(a - z)+]
                def up = [(A - Z)+]
            ]
        `);

        expect(parse('helloWORLD')).to.deep.equal({
            low: 'hello',
            up: 'WORLD'
        });
    });

    it('Should define properties using variable-lookups', () => {
        const parse = compile(`
            <foo> = [object:
                def hello = [array:
                    push [object: 
                        def baz = 'bam'
                    ]
                ]
            ]
            
            entry [object:
                'hi'

                def foo = [object: ...<foo>]
                def val = $foo.hello[0].baz
            ]
        `);

        expect(parse('hi')).to.deep.equal({
            foo: {
                hello: [
                    {
                        baz: 'bam'
                    }
                ]
            },
            val: 'bam'
        });
    });

    it('Should push values into arrays', () => {
        const parse = compile(`
            entry [array:
                push "abc"
                push [(a - z)+]
                push [(A - Z)+]
            ]
        `);

        expect(parse('helloWORLD')).to.deep.equal([
            'abc',
            'hello',
            'WORLD'
        ]);
    });

    it('Should work with nested / mixed objects', () => {
        const parse = compile(`
            entry [object:
                def hello = 'world'
                def abcd = [array:
                    push ['A' | 'B']
                    push ['C' | 'D']?
                ]
            ]
        `);

        expect(parse('UC')).to.equal(null);
        expect(parse('AD')).to.deep.equal({
            hello: 'world',
            abcd: ['A', 'D']
        });

        expect(parse('A')).to.deep.equal({
            hello: 'world',
            abcd: ['A']
        });
    });

    it('Should join object via spread-operator', () => {
        const parse = compile(`
            <other-obj> = [object:
                def aha = 'oho'
            ]

            entry [object:
                def hello = [object: ...<other-obj>]
            ]
        `);

        expect(parse('')).to.deep.equal({
            hello: {
                aha: 'oho'
            }
        });
    });

    it('Should ignore a group via void statement', () => {
        const parse = compile(`
            entry [
                void ['hello']?
                'world'
            ]
        `);

        expect(parse('helloworld')).to.equal('world');
        expect(parse('world')).to.equal('world');
        expect(parse('hworld')).to.equal(null);
    });

    it('Should throw an error if rem is used within string', () => {
        const parse = compile(`[
            (A - Z)+
            rem $abc
        ]`);

        expect(() => parse('ABC')).to.throw();
    });

    it('Should properly remove values with the remove statement', () => {
        const parse = compile(`[object:
            def str = 'hello'
            def arr = [array:
                push 'Hello'
                push 'World'
                push '!'
            ]
        
            def sub = [object:
                def bar = 'bam'
                def foo = 'mai'
                
                def deep = [object:
                    def ugh = 'wow'
                ]
                
                def hmhm = [array:
                    push 'bar'
                ]
                
                rem $bar
            ]
            
            rem $sub.deep.ugh
            rem $sub.hmhm
            rem $arr[0]
            rem $str.length # Should do nothin
        ]`);

        expect(parse('')).to.deep.equal({
            str: 'hello',
            arr: ['World', '!'],
            sub: {foo: 'mai', deep: {}}
        });
    });

    it('Should throw an error if operations are used in the wrong placec', () => {

        // Invalid array operators
        expect(() => compile(`
            entry [array: def x = ['a']]
        `)('a')).to.throw();

        // Invalid object operators
        expect(() => compile(`
            entry [object: push ['a']]
        `)('a')).to.throw();

        // Invalid string operators
        expect(() => compile(`
            entry [push ['a']]
        `)('a')).to.throw();

        expect(() => compile(`
            entry [def x = ['a']]
        `)('a')).to.throw();
    });

    it('Should throw an error with with throw-statement', () => {
        const parse = compile(`[object:
            def hi = [(a - z)+]
            
            if ($hi != 'hello') [
                throw 'Expected "hello".'
            ]
        ]`);

        expect(() => parse('helo')).to.throw();
        expect(parse('hello')).to.deep.equal({
            hi: 'hello'
        });
    });

    it('Should be able to resolve properties in the parent scope', () => {
        const parse = compile(`
            entry [object:
                def a = [(A - Z)+]
                
                if ($a == 'ABC') [
                    def con = [object:
                        def b = "Val: {$a}"
                    ]
                ] else [
                    def x = "Unknown: {$a}"
                ]
            ]
        `);

        expect(parse('HELLO')).to.deep.equal({
            a: 'HELLO',
            con: null,
            x: 'Unknown: HELLO'
        });

        expect(parse('ABC')).to.deep.equal({
            a: 'ABC',
            con: {
                b: 'Val: ABC'
            },
            x: null
        });

        expect(parse('')).to.equal(null);
    });

    it('Should ignore null-pointer', () => {
        const parse = compile(`
            entry [object:
                def x = 'Nothin:{$hi.wow[2]}'
            ]
        `);

        expect(parse('')).to.deep.equal({
            x: 'Nothin:'
        });
    });

    it('Should properly resolve elements inside of an array', () => {
        const parse = compile(`
            entry [array:
                push [(A - Z)+]
                push 'First element: {$[0]}'
            ]
        `);

        expect(parse('ABC')).to.deep.equal([
            'ABC',
            'First element: ABC'
        ]);
    });

    it('Should automatically clean up properties set via use', () => {

        // TODO: Extra store for use???
        const parse = compile(`
            entry [object:
                use cmd = [(A - Z)+]
            
                if ($cmd == 'HELLO') [
                    def res = 'WORLD'
                ] else [
                    def res = 'WHAT?'
                ]
            ]
        `);

        expect(parse('HELLO')).to.deep.equal({res: 'WORLD'});
        expect(parse('ABC')).to.deep.equal({res: 'WHAT?'});
    });

    it('Should properly return the value used as return-value', () => {
        const parse = compile(`[object:
            use value = [(.)+]
            ret 'You wrote "{$value}"'
        ]`);

        expect(parse('Hello')).to.equal('You wrote "Hello"');
        expect(parse('')).to.equal(null);
    });
});
