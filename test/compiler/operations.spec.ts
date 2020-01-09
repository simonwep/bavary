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

    it('Should push values into arrays', () => {
        const parse = compile(`
            entry [array:
                push [(a - z)+]
                push [(A - Z)+]
            ]
        `);

        expect(parse('helloWORLD')).to.deep.equal([
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
                    push ['C' | 'D']
                ]
            ]
        `);

        expect(parse('AU')).to.equal(null);
        expect(parse('AD')).to.deep.equal({
            hello: 'world',
            abcd: ['A', 'D']
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
});
