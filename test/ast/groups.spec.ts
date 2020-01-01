import {failAll} from './tools';

describe('[AST] Simple group declarations', () => {

    failAll([
        '<vvv',
        'entry [\'A\' | \'B\'|]',
        '<abc.> = ["A"]',
        '<abc> = [/]',
        '<abc> = [//]',
        '<abc> = [/[]]',
        '<abc> = [',
        '<abc> = ["A" | "B" | []',
        '<abc> = [A""]'
    ]);
});
