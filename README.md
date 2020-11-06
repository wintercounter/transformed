<h1 align="center">transformed ⚡</h1>
<p>
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <a href="https://twitter.com/wintercounter2" target="_blank">
    <img alt="Twitter: wintercounter1" src="https://img.shields.io/twitter/follow/wintercounter1.svg?style=social" />
  </a>
</p>

> A lightweight, low-level, performant, customizable object transformer utility.

-   Custom parsers per prop.
-   Custom output transformer.
-   Built-in value map support.
-   Multi-key support.
-   Post-instantiation configuration.

## Install

```sh
npm i transformed
```

## Usage

```js
import transformed from 'transformed'

const myTransformer = transformed()

myTransformer({ foo: 'bar' })
```

By default `transformed` won't do anything with your data, you need to define your rules:

-   `props`: definitions of how to process which prop
-   `outputTransformer`: how to process your output

### Options

-   `autoCamelCase` _(default: false)_: automatically adds support for _camelCase_ versions of the passed prop names.
-   `hasOwnPropertyCheck` _(default: false)_: for a slight performance improvement we're not doing `hasOwnProperty` checks
    by default, but you can enable for cases when not using simple objects as input.

### API

(InputObject): Whatever
registry: Map<string, Definition>
outputTransformer: OutputTransformer
options: Partial<Options>
setOptions(options: Partial<Options>): TransformedFn
setOutputTransformer(outputTransformer: OutputTransformer): TransformedFn
setProps(props: Props): TransformedFn
toValue(prop: string, value: unknown)

#### `transformed()` (default export)

A constructor method to create your transformer instance.

#### `setOptions()`

Set options for your instance.

```js
const myTransformer = transformed()
myTransformer.setOptions({
    autoCamelCase: true,
    foo: 'bar'
})
```

> You may add custom config keys/values. You can access these options inside your property parsers and output transformer.

#### `setOutputTransformer()`

Set `outputTransformer` for your instance.

```js
const myOutputTransformer = ...
const myTransformer = transformed()
myTransformer.setOutputTransformer(myOutputTransformer)
```

> Output transformers always should be set before calling `setProps` because they have the capability to alter prop names when registering them.

#### `setProps()`

Set supported properties for your instance.

Properties defined in "Babel config fashion". Arrays of property descriptors.

```js
// All props
;[
    // Property
    [
        // Property names
        ['p', 'pad', 'padding'],
        // Value map for this property. Use `null` or leave emoty if not needed.
        { large: '30px' },
        // Value parsers
        [input => output]
    ]
]
```

```js
const props = [
    [['p', 'pad', 'padding'], { large: '30px' }],
    [['bg', 'background'], { cars: 'cars.png' }, [(input, prop) => ({ [prop]: `http://mysite.com/images/${input}` })]]
]

const transform = transformed().setProps(props)

transform({
    padding: 'large',
    background: 'cars'
})

// Output: { padding: '30px', background: 'http://mysite.com/images/cars.png' }
```

#### `toValue()`

Sometimes you just want to get a value for a prop/value pair.

```
myTransformer.toValue('padding', 'large')
```

#### Creating Object Transformers

Object transformer is just a single function with static properties that loops through each property and values using
the following API:

-   `myOutputTransformer()`: returns your transformed output, receives the following arguments:
    -   `output`: currently generated output in current iteration (on first iteration it's _defaultOutput_)
    -   `value`: the generated value in the current iteration
    -   `prop`: the prop name for the current iteration
    -   `inputObject`: the original object passed to _transformed_
    -   `transformedFn`: current _transformed_ instance used for this iteration
-   `defaultOutput()`: _mandatory_ function returning the default output
-   `unsupportedHandler()`: _optional_ you may specify a handler for unsupported (not registered) properties; receives
    same arguments as your _outputTransformer_ function
-   `camelCaseReducer`: _optional_ reducer function to alter how generated camelCase keys stored; parameters are the
    same as for a normal `array.reduce` callback (accumulator, currentValue, index)
    `transformed` will simply push it into the existing key list

> See **Complete Example** for details on usage.

#### Creating parsers

Parsers are telling how to process values for a certain property. You can apply as many parser functions as you want,
during generation the next function will get the previous function's output value (pipe).

The parser function receives the following arguments:

-   value: initial value, or the previous parser's output
-   prop: property name,
-   transformedFn: _transformed_ instance
-   inputObject: original input object
-   definition: definition object stored in the property registry for this prop

```js
const alwaysBar = (input, prop) => ({ [prop]: 'bar' })
const myTransformer = transformed().setProps([[['foo'], null, [alwaysBar]]])

myTransformer({ foo: 'baz' })

// Output: { foo: 'bar' }
```

> See **Complete Example** for more advanced details on usage.

### Complete example

Let's see a simple example to build string based CSS output for a Style Object:

```js
const toCSSParser = (value, prop, transformedFn, inputObject, definition) => {
    // Let's always use the last key as CSS key
    const cssProperty = definition.keys[definition.keys.length - 1]
    return `${cssProperty}: ${value};\n`
}
// It'll just simply concat
const cssTransformer = (output, value) => `${output}${value}`
// Default output is just a string we will concat into
cssTransformer.defaultOutput = () => ''

const props = [
    [['p', 'pad', 'padding'], { large: '30px' }, [toCSSParser]],
    [['bg', 'background'], null, [toCSSParser]]
]

const myTransformer = transformed().setOutputTransformer(cssTransformer).setProps(props)

myTransformer({ p: 'large', bg: './cars.png' })

/**
 * Output:
 *
 * padding: 30px;
 * background: './cars.png'
 */
```

## Show your support

Give a ⭐️ if this project helped you!

<a href="https://www.patreon.com/wintercounter">
  <img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160">
</a>

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
