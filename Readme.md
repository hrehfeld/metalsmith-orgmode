
# metalsmith-orgmode

  A Metalsmith plugin to convert org mode files.

## Installation

    $ npm install metalsmith-orgmode

## CLI Usage

  Install via npm and then add the `metalsmith-orgmode` key to your `metalsmith.json` plugins with any [org](http://npmjs.com/package/org) options you want, like so:

```json
{
  "plugins": {
    "metalsmith-orgmode": {
      "key": "value"
    }
  }
}
```

## Javascript Usage

  Pass `options` to the org mode plugin and pass it to Metalsmith with the `use` method:

```js
var orgmode = require('metalsmith-orgmode');

metalsmith.use(orgmode({
  key: value
}));
```

## License

  MIT
