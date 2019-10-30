const {parse} = require('./tools');
const {expect} = require('chai');

describe('Characters, strings and char-ranges', () => {

    it('Should throw an error on empty strings', () => {
        expect(() => parse(`<brr> = ['']`)).to.throw();
    });

    it('Should resolve simple character sequences', () => {
        expect(parse(`entry <a> = ['A' 'Hello' 'Hello World!']`)).to.deep.equal([
            {
                'type': 'declaration',
                'name': 'a',
                'variant': 'entry',
                'value': {
                    'type': 'group',
                    'multiplier': null,
                    'value': [
                        {
                            'type': 'string',
                            'value': 'A'
                        },
                        {
                            'type': 'string',
                            'value': 'Hello'
                        },
                        {
                            'type': 'string',
                            'value': 'Hello World!'
                        }
                    ]
                }
            }
        ]);
    });

    it('Should allow escaped quotations in strings', () => {
        expect(parse(`<brr> = ['A\\'' | 'B']`)).to.deep.equal([
            {
                'type': 'declaration',
                'name': 'brr',
                'variant': null,
                'value': {
                    'type': 'group',
                    'multiplier': null,
                    'value': [
                        {
                            'type': 'combinator',
                            'sign': '|',
                            'value': [
                                {'type': 'string', 'value': 'A\''},
                                {'type': 'string', 'value': 'B'}
                            ]
                        }
                    ]
                }
            }
        ]);
    });

    it('Should parse character ranges', () => {
        expect(parse(`entry <a> = ['a' to 'z' 'A' to 'Z']`)).to.deep.equal([
            {
                'type': 'declaration',
                'name': 'a',
                'variant': 'entry',
                'value': {
                    'type': 'group',
                    'multiplier': null,
                    'value': [
                        {
                            'type': 'character-range',
                            'value': {'from': 97, 'to': 122}
                        },
                        {
                            'type': 'character-range',
                            'value': {'from': 65, 'to': 90}
                        }
                    ]
                }
            }
        ]);
    });

    it('Should automatically correct switched char-ranges', () => {
        expect(parse(`entry <a> = ['z' to 'a']`)).to.deep.equal([
            {
                'type': 'declaration',
                'name': 'a',
                'variant': 'entry',
                'value': {
                    'type': 'group',
                    'multiplier': null,
                    'value': [
                        {
                            'type': 'character-range',
                            'value': {
                                'from': 97,
                                'to': 122
                            }
                        }
                    ]
                }
            }
        ]);
    });

    it('Should allow unicode-escaped ranges', () => {
        expect(parse(`entry <a> = [\\u2000 to \\u3300]`)).to.deep.equal([
            {
                'type': 'declaration',
                'name': 'a',
                'variant': 'entry',
                'value': {
                    'type': 'group',
                    'multiplier': null,
                    'value': [
                        {
                            'type': 'character-range',
                            'value': {
                                'from': 8192,
                                'to': 13056
                            }
                        }
                    ]
                }
            }
        ]);
    });
});
