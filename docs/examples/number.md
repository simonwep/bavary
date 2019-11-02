### Example: \<number\>
The following example parses floating-point numbers and integers. 
In both the scientific notation can be used.

```html
entry {
    <raw-num> = [['0' to '9']+]
    <num-sign> = [ '+' | '-' ]
    <scientific-notation> = ['e' <num-sign>? <raw-num>]
    <scientific-num> = [<raw-num> <scientific-notation>?]
    
    default [
    
        // Any number could have a '-' or '+' as prefix but it's completly optional.
        <num-sign#sign>?
    
        // It could be a floating-point number (see raw-num above) followed by a
        // (optional) scientific number sequence (e.g. e6, e-5)
        [<raw-num#num>? '.' <scientific-num#decimal>] |
    
        // Or its a non-floating-point number
        [<scientific-num#num>]
    ]
}
```

The definition contains three tags:
1. `num` contains the preceding number. 
2. `decimal` contains the decimal-place.
3. `sign` contains (an optional) preceding sign (`+` or `-`).

#### Usage results:

```js
const parse = compile(`
    entry {
        <raw-num> = [['0' to '9']+]
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
| `parse(10)` | `{num: '10'}` |
| `parse(-25)` | `{sign: '-', num: '25'}` |
| `parse(14.5)` | `{num: '14', decimal: '5'}` |
| `parse(20e+55)` | `{num: '20e+55'}` |
| `parse(10.5e6)` | `{num: '10', decimal: '5e6'}` |
| `parse(-.5e2)` | `{sign: '-', decimal: '5e2'}` |
| `parse(.23e-232)` | `{decimal: '23e-232'}` |

##### Invalid inputs:
| Input | Output |
| ----- | ------ |
| `parse(g)` | `null` (not a number) |
| `parse(.35.34)` | `null` (number cannot contain two decimal places) |
| `parse(2e5.3e5)` | `null` (scientific notation cannot be used in both places) |
| `parse(-+5)` | `null` (two preceding signs are not allowed) |
