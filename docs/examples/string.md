### Example: \<string\>
The following example parses strings indicated by double-quotes.
Usage of the double-quote in the string itself is possible by escaping it

```html
entry {
    
    // Allow all characters in the utf-8 range
    <str-body> = [
        ['\\\\"' | (\\u0000 - \\uffff except \\")]+
    ]
    
    default [
        '"' <str-body#string> '"'
    ]
}
```

Note that the `<str-body>` type first tries to match a escaped quote (`'\\\\"'`)
and only then tries to match any character inside of it (except the quotation mark itself since it indicates the end of the string).

#### Usage and possible results:

##### Code
```js
const parse = compile(`
    entry {
        
        // Allow all characters in the utf-8 range
        <str-body> = [
            ['\\\\"' | (\\u0000 - \\uffff except \\")]+
        ]
        
        default [
            '"' <str-body#string> '"'
        ]
    }
`);
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
