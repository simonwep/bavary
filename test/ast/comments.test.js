const {parse} = require('./tools');
const {expect} = require('chai');

describe('Comments', () => {

    it('Should return an empty array if it\'s only a comment', () => {
        expect(parse(`// Hi`)).to.deep.equal([]);
    });

    it('Should ignore commented-out lines', () => {
        expect(parse(`
            // <ccc> = ['A']
            <brr> = ['A' | 'B'] // Another comment
        `))
            .to.deep.equal([
            {
                'type': 'declaration',
                'name': {
                    'type': 'type',
                    'multiplier': null,
                    'value': 'brr'
                },
                'value': {
                    'type': 'group',
                    'multiplier': null,
                    'value': [
                        {'type': 'string', 'value': 'A'},
                        {'type': 'combinator', 'value': '|'},
                        {'type': 'string', 'value': 'B'}
                    ]
                }
            }
        ]);
    });

    it('Should allow escaped quotations in strings', () => {
        expect(parse(`<brr> = ['A\\'' | 'B']`)).to.deep.equal([
            {
                'type': 'declaration',
                'name': {
                    'type': 'type',
                    'multiplier': null,
                    'value': 'brr'
                },
                'value': {
                    'type': 'group',
                    'multiplier': null,
                    'value': [
                        {'type': 'string', 'value': 'A\''},
                        {'type': 'combinator', 'value': '|'},
                        {'type': 'string', 'value': 'B'}
                    ]
                }
            }
        ]);
    });
});
