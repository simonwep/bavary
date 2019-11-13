import {expect} from 'chai';
import {parse}  from './tools';

describe('[AST] Character selection', () => {

    it('Should parse simple ranges without exceptions', () => {
        expect(parse('entry [(a - z)]')).to.deep.equal([
            {
                'type': 'declaration',
                'name': null,
                'variant': 'entry',
                'value': {
                    'type': 'group',
                    'multiplier': null,
                    'value': [
                        {
                            'type': 'character-selection',
                            'included': [
                                {'type': 'range', 'from': 97, 'to': 122}
                            ],
                            'excluded': []
                        }
                    ]
                }
            }
        ]);
    });

    it('Should parse simple ranges with exceptions', () => {
        expect(parse('entry [(a - z except g)]')).to.deep.equal([
            {
                'type': 'declaration',
                'name': null,
                'variant': 'entry',
                'value': {
                    'type': 'group',
                    'multiplier': null,
                    'value': [
                        {
                            'type': 'character-selection',
                            'included': [
                                {'type': 'range', 'from': 97, 'to': 122}
                            ],
                            'excluded': [
                                {'type': 'character', 'value': 103}
                            ]
                        }
                    ]
                }
            }
        ]);
    });

    it('Should parse long, chained ranges with exceptions', () => {
        expect(parse('entry [(a-z 5 6 7 except h-g)]')).to.deep.equal([
            {
                'type': 'declaration',
                'name': null,
                'variant': 'entry',
                'value': {
                    'type': 'group',
                    'multiplier': null,
                    'value': [
                        {
                            'type': 'character-selection',
                            'included': [
                                {'type': 'range', 'from': 97, 'to': 122},
                                {'type': 'character', 'value': 53},
                                {'type': 'character', 'value': 54},
                                {'type': 'character', 'value': 55}
                            ],
                            'excluded': [
                                {'type': 'range', 'from': 103, 'to': 104}
                            ]
                        }
                    ]
                }
            }
        ]);
    });

    it('Should accept escaped punctuation characters', () => {
        expect(parse('entry [(a-z \\" \\--\\+ except h-g)]')).to.deep.equal([
            {
                'type': 'declaration',
                'name': null,
                'variant': 'entry',
                'value': {
                    'type': 'group',
                    'multiplier': null,
                    'value': [
                        {
                            'type': 'character-selection',
                            'included': [
                                {'type': 'range', 'from': 97, 'to': 122},
                                {'type': 'character', 'value': 92},
                                {'type': 'range', 'from': 92, 'to': 92}
                            ],
                            'excluded': [
                                {'type': 'range', 'from': 103, 'to': 104}
                            ]
                        }
                    ]
                }
            }
        ]);
    });

    it('Should accept unicode escapes', () => {
        expect(parse('entry [(\\u0001 - z except h - g \\u0003 - \\u00a2)]')).to.deep.equal([
            {
                'type': 'declaration',
                'name': null,
                'variant': 'entry',
                'value': {
                    'type': 'group',
                    'multiplier': null,
                    'value': [
                        {
                            'type': 'character-selection',
                            'included': [
                                {'type': 'range', 'from': 1, 'to': 122}
                            ],
                            'excluded': [
                                {'type': 'range', 'from': 103, 'to': 104},
                                {'type': 'range', 'from': 3, 'to': 162}
                            ]
                        }
                    ]
                }
            }
        ]);
    });

    it('Should throw an error for invalid character-selections', () => {
        expect(() => parse('entry [(a - )]')).to.throw();
        expect(() => parse('entry [(a - ")]')).to.throw();
        expect(() => parse('entry [(a - z except)]')).to.throw();
        expect(() => parse('entry [(a - z]')).to.throw();
    });
});
