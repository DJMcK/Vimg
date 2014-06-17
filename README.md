# Vimg.js

[![Build Status](https://travis-ci.org/ScottishDave/Vimg.png?branch=master)](https://travis-ci.org/ScottishDave/Vimg)

Vimg is a lightweight JavaScript image lazy-loader.

To use Vimg:

```
<img src="blank.gif" data-src="realimage.jpg" class="vimg">

<script src="dist/vimg.min.js"></script>
<script>
new Vimg({
    selector: '.vimg' // note: could be equal to [data-src] or your custom srcAttr
    , interval: 3000  // default: 1000 - how often will be poll for changes
    , offset: 500 // default: 300 - how far below the viewport to load
    , srcAttr: 'data-reallyTheSrc' // default: data-src - attribute containing the src
})
</script>
```

## API

### Load event

Each image will emit an event when it is loaded into the view.

```self.emitEvent(me, 'vimg-loaded');```

### Options

#### selector

Default: `.vimg`

Used in `document.querySelectorAll` to return all nodes from selector. A simpler implementation can be to simply look for `[data-src]` removing the need for a class.

#### srcAttr

Default: `data-src`

The `src` path for your image asset. You could match this with selector to remove any additional effort.

#### interval

Default: `1000`

The period of time between each check for images in viewport.

#### offset

Default: `300`

Pixels below viewport to consider `withinView` when polling images.

## License

MIT license
