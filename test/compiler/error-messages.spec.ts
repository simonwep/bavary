import {expect}                from 'chai';
import {compile, ParsingError} from '../../src';

describe('[COM] Properly formatted error messages', () => {

    it('Formatting test no. 1', () => {
        expect(() => compile(``)).to.throw(Error,
            `Couldn't resolve entry type. Use the entry keyword to declare one.`
        );
    });


    it('Formatting test no. 2', () => {
        expect(() => compile(`s`)).to.throw(ParsingError,
            `
01 | s
     ^
Error: Unexpected token`
        );
    });


    it('Formatting test no. 3', () => {
        expect(() => compile(`entry {`)).to.throw(ParsingError,
            `
01 | entry {
           ^
Error: Expected a declaration.`
        );
    });


    it('Formatting test no. 4', () => {
        expect(() => compile(`entry ["hello world]`)).to.throw(ParsingError,
            `
01 | entry ["hello world]
                        ^
Error: String litereal not terminated.`
        );
    });


    it('Formatting test no. 5', () => {
        expect(() => compile(`
<x> = ['hello']
entry [<hello>++]
`)).to.throw(ParsingError,
            `
02 | <x> = ['hello']
03 | entry [<hello>++]
                   ^
Error: Expected a type, group or raw string / character-range.`
        );
    });


    it('Formatting test no. 6', () => {
        expect(() => compile(`
<x> = ['hello']
entry [object
    def x =
]
`)).to.throw(ParsingError,
            `
02 | <x> = ['hello']
03 | entry [object
04 |     def x =
         ^^^
Error: Expected ":" but got "def"`
        );
    });


    it('Formatting test no. 7', () => {
        expect(() => compile(`
<x> = ['hello']
entry [object
    def x = "{$woah} nice {"
]
`)).to.throw(ParsingError,
            `
02 | <x> = ['hello']
03 | entry [object
04 |     def x = "{$woah} nice {"
                                ^
Error: Expected end of string.`
        );
    });


});
