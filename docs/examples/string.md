### Example: \<string\>
The following example parses strings indicated by double-quotes.
Usage of the double-quote in the string itself is possible by escaping it

```html
entry {
    default [object:
        '"'
        
        # Match all characters except the quotation character.
        # Match escaped quotation-characters first.
        def string = [['\"' | (. except \")]+]
        '"'
    ]
}
```

##### Valid inputs:
| Input | Output |
| ----- | ------ |
| `parse('"Hello World"')` | `{string: 'Hello World'}` |
| `parse('"Say hello with \"Hello World\" !"')` | `{string: 'Say hello with \'Hello World\' !'}` |

##### Invalid inputs:
| Input | Output |
| ----- | ------ |
| `parse('"Ooops')` | `null` (Missing closing quotation-sign) |
| `parse('"Hello " World"')` | `null` (Quotation not escaped) |
