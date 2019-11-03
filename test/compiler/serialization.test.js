const {compile} = require('../../src');
const {expect} = require('chai');

describe('[COM] Type serialization', () => {

    it('Should properly serialize not matched, tagged types', () => {
        const parse = compile(`
            entry {
                <num> = ['0' to '9']
                <abc> = ['a' to 'c']
                <xyz> = ['x' to 'z']
                
                default [
                    [<num#num> <abc#abc>] |
                    [<xyz#xyz>]
                ]
            }
        `);

        expect(parse('x')).to.deep.equal({num: null, abc: null, xyz: 'x'});
        expect(parse('3a')).to.deep.equal({num: '3', abc: 'a', xyz: null});
        expect(parse('3x')).to.deep.equal(null);
    });
});
