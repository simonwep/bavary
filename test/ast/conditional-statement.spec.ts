import {failAll} from './tools';

describe('[AST] Conditional statement', () => {

    failAll([
        'entry [if]',
        'entry [if ($abc != null)',
        'entry [if ($ab.) []',
        'entry [if ($ab[) []',
        'entry [if ($ab[ab]) []',
        'entry [if ($abc != null) [] else]',
        'entry [if ()]',
        'entry [if ($abc)]',
        'entry [if ($a == 5) [object:]]',
        'entry [if ($abc >) else ]',
        'entry [if ($abc > ()]',
        'entry [if ($abc ! ()]',
    ]);
});
