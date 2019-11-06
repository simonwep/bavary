import {expect} from 'chai';
import {parse}  from './tools';

describe('[AST] Comments', () => {

    it('Should return an empty array if it\'s only a comment', () => {
        expect(parse('// Hi')).to.deep.equal([]);
    });

    it('Should ignore commented-out lines', () => {
        expect(parse(`
            // <ccc> = ['A']
            <brr> = ['A' | 'B'] // Another comment
        `)).to.deep.equal([
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
                                {'type': 'string', 'value': 'A'},
                                {'type': 'string', 'value': 'B'}
                            ]
                        }
                    ]
                }
            }
        ]);
    });
});
