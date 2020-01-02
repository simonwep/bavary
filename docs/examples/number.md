### Example: \<number\>
The following example parses floating-point numbers and integers. 
In both the scientific notation can be used.

```html
entry {
    <raw-num> = [(\d)+]
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
```

The definition contains three tags:
1. `num` contains the preceding number. 
2. `decimal` contains the decimal-place.
3. `sign` contains (an optional) preceding sign (`+` or `-`).

#### Usage and possible results:

##### Code
```js
const parse = compile(`
    entry {
        <raw-num> = [(\\d)+]
        <num-sign> = [ '+' | '-' ]
        <scientific-notation> = ['e' <num-sign>? <raw-num>]
        <scientific-num> = [<raw-num> <scientific-notation>?]
        
        default [
            <num-sign#sign>?
            [<raw-num#num>? '.' <scientific-num#decimal>] |
            [<scientific-num#num>]
        ]
    }
`);
```

##### Valid inputs:
| Input | Output |
| ----- | ------ |
| `parse('10')` | `{sign: null, num: '10', decimal: null}` |
| `parse('-25')` | `{sign: '-', num: '25', decimal: null}` |
| `parse('14.5')` | `{sign: null, num: '14', decimal: '5'}` |
| `parse('20e+55')` | `{sign: null, num: '20e+55', decimal: null}` |
| `parse('10.5e6')` | `{sign: null, num: '10', decimal: '5e6'}` |
| `parse('-.5e2')` | `{sign: '-', num: null, decimal: '5e2'}` |
| `parse('.23e-232')` | `{sign: null, num: null, decimal: '23e-232'}` |

##### Invalid inputs:
| Input | Output |
| ----- | ------ |
| `parse(g)` | `null` (not a number) |
| `parse(.35.34)` | `null` (number cannot contain two decimal places) |
| `parse(2e5.3e5)` | `null` (scientific notation cannot be used in both places) |
| `parse(-+5)` | `null` (two preceding signs are not allowed) |
