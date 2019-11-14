import compile from './tools';

describe('[EXAMPLE] numbers', () => {

    const parse = compile(`
        entry {
            <raw-num> = [(0 - 9)+]
            <num-sign> = [ '+' | '-' ]
            <scientific-notation> = ['e' <num-sign>? <raw-num>]
            <scientific-num> = [<raw-num> <scientific-notation>?]
            
            default [
            
                // Well that's optional
                <num-sign#sign>?
        
                // Decimal
                [<raw-num#num>? '.' <scientific-num#decimal>] |
            
                // Non-decimal
                [<scientific-num#num>]
            ]
        }
    `);

    parse([
        ['10', {sign: null, num: '10', decimal: null}],
        ['-25', {sign: '-', num: '25', decimal: null}],
        ['14.5', {sign: null, num: '14', decimal: '5'}],
        ['20e+55', {sign: null, num: '20e+55', decimal: null}],
        ['10.5e6', {sign: null, num: '10', decimal: '5e6'}],
        ['-.5e2', {sign: '-', num: null, decimal: '5e2'}],
        ['.23e-232', {sign: null, num: null, decimal: '23e-232'}]
    ]);

    parse([
        '12.',
        '+-12.2',
        '12.1.1',
        '2e2e4',
        '-2e4.2'
    ]);
});
