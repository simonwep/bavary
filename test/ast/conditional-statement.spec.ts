import {failAll} from './tools';

describe('[AST] Conditional statement', () => {

    failAll([
        'entry [if]',
        'entry [if #abc',
        'entry [if #abc []',
        'entry [if #abc [] else]',
        'entry [if ()]',
        'entry [if (#abc)]',
        'entry [if (#abc >)]',
        'entry [if (#abc > ()]',
    ]);
});
