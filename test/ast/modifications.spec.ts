import {failAll} from './tools';

describe('[AST] Modifiers', () => {

    failAll([
        'entry [<abc#wow{>]',
        'entry [<abc#wow{def}>]',
        'entry [<abc#wow{del}>]',
        'entry [<abc#wow{del hello = }>]',
        'entry [<abc#wow{def hello = }>]',
        'entry [<abc#wow{def hello = "world",}>]',
        'entry [<abc#wow{def hello = ab.}>]',
        'entry [<abc#wow{def hello = ab[2}>]',
        'entry [<abc#wow{def hello = ab[-}>]',
    ]);
});
