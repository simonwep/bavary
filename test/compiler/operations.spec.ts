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
});