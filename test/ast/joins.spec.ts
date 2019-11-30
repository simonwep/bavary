import {failAll} from './tools';

describe('[AST] Joins', () => {

    failAll([
        'entry [<abc> <efg> -]',
        'entry [<abc> <efg> ->]',
        'entry [<abc> <efg> ->',
        'entry [<abc#super> -> oh]',
        'entry [...<abc> -> oh]'
    ]);
});
