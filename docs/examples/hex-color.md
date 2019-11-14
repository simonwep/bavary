### Example: \<hex-color\>
The following example parses hex-colors.
It supports the 3- and 4-shorthand as well as the written out 4 and 8 character long version.

```html
entry {
    <hex> = [(0 - 9) | (a - f)]
    <hex-pair> = [<hex> <hex>]
    
    default [
        '#'
        
        // RRGGBBAA & RRGGBB
        [<hex-pair#r> <hex-pair#b> <hex-pair#g> <hex-pair#a>?] |
        
        // RGBA & RGB
        [<hex#r> <hex#b> <hex#g> <hex#a>?]
    ]
}
```

The definition will return an object with `r`, `g`, `b` and an optional alpha-value (`a`).

#### Usage and possible results:

##### Code
```js
const parse = compile(`
    entry {
        <hex> = ['0' to '9' | 'a' to 'f']
        <hex-pair> = [<hex> <hex>]
        
        default [
            '#'
            [<hex-pair#r> <hex-pair#b> <hex-pair#g> <hex-pair#a>?] |
            [<hex#r> <hex#b> <hex#g> <hex#a>?]
        ]
    }
`);
```

##### Valid inputs:
| Input | Output |
| ----- | ------ |
| `parse('#b5d')` | `{r: 'b', b: '5', g: 'd', a: null}` |
| `parse('#cf5c')` | `{r: 'c', b: 'f', g: '5', a: 'c'}` |
| `parse('#4eaecc')` | `{r: '4e', b: 'ae', g: 'cc', a: null}` |
| `parse('#328fffcc')` | `{r: '32', b: '8f', g: 'ff', a: 'cc'}` |

##### Invalid inputs:
| Input | Output |
| ----- | ------ |
| `parse('fff')` | `null` (missing `#` prefix) |
| `parse('#c2')` | `null` (invalid length) |
| `parse('#c2g')` | `null` (invalid characters) |