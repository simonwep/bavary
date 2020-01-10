import {failAll} from './tools';

describe('[AST] Character selection', () => {

    failAll([
        'entry [""]',
        'entry [(',
        'entry [(\\',
        'entry [(\\   )',
        'entry [...(a-z)]',
        'entry [()]',
        'entry [(a - )]',
        'entry [(a - \\a)]',
        'entry [(\\)]',
        'entry [(a - \\"a)]',
        'entry [(\\j)]',
        'entry [(a - \\',
        'entry [(a - ")]',
        'entry [(a - z except)]',
        'entry [(a - z a except b)]',
        'entry [(except a)]',
        'entry [(a - z]',
        'entry [(\\099)]',
        'entry [(\\x123l - z)]',
        'entry [(\\x12322 - z)]'
    ]);
});
