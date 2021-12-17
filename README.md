# remark-code-github

Populate code blocks from GitHub

Inspired by [remark-code-import](https://github.com/kevin940726/remark-code-import)

## Installation

```sh
# npm
npm install -D remark-code-github

# yarn
yarn add -D remark-code-github
```

## Setup

See [**Using plugins**](https://github.com/remarkjs/remark/blob/main/doc/plugins.md#using-plugins) in the official documentation.

## Usage

Transform:

````md
```js raw_url=https://raw.githubusercontent.com/remarkjs/remark/main/packages/remark/index.js
```
````

into:

````md
```js
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'

export const remark = unified().use(remarkParse).use(remarkStringify).freeze()
```
````

The raw_url is URL of plain text content.

You may also specify specific lines or ranges:

````md
```js file=https://raw.githubusercontent.com/remarkjs/remark/main/packages/remark/index.js#L3
```

```js file=https://raw.githubusercontent.com/remarkjs/remark/main/packages/remark/index.js#L3-L5
```

```js file=https://raw.githubusercontent.com/remarkjs/remark/main/packages/remark/index.js#L3-
```
````

## Options

- `preserveTrailingNewline`: By default, this plugin will trim the trailing newline of the file when importing the code. You can preserve the trailing new line in the code block by setting this option to `true`.

## Testing

After installing dependencies with `npm install`, the tests can be run with: `npm test`

## License

fossamagna
[MIT](LICENSE)