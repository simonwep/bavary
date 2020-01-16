### Example: \<hex-color\>
The following example parses hex-colors.
It supports the 3- and 4-shorthand as well as the written out 4 and 8 character long version.

```
entry {
    <hex> = [(\d, a - f)]
    <hex-pair> = [<hex> <hex>]
    
    default [object:
        '\\#'
        
        # RRGGBBAA & RRGGBB
        [
            def r = [<hex-pair>]
            def g = [<hex-pair>]
            def b = [<hex-pair>]
            def a = [<hex-pair>]?
        ] | [
            # RGBA & RGB
            def r = [<hex>]
            def g = [<hex>]
            def b = [<hex>] 
            def a = [<hex>]?
        ]
    ]
}
```

The definition will return an object with `r`, `g`, `b` and an optional alpha-value (`a`).

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
