# Canvas Falling Squares
 
A quick, configurable way of getting squares to fall down your canvas. Sometimes, you just want falling squares.
 
## Installation
 
In your HTML:

```html
<script src="canvas-falling-squares.js"></script>
```

In an AMD loader:

```js
require(['canvas-falling-squares'], function(FallingSquares) {/*…*/});
```

Or using Bower:

```bash
bower install canvas-falling-squares
```
 
## Usage

### Simple

    var canvas = document.getElementById('my-canvas');
    var FallingSquares = new FallingSquares( { canvas: canvas } );

### Fully Configured


    var canvas = document.getElementById('canvas');
    canvas.height = 500;
    canvas.width = 500;

    new FallingSquares({ 
        canvas: canvas,
        colours: ['#70A8FF', '#FFBA7A'],
        size: 10,
        spacing: 5,
        maxSpeed: 2,
        minSpeed: 0.5,
        numberOfColumns: 5,
        numberOfSquares: 3,
        backgroundColour: '#FFFFFF',
        xOffset: 10
    });

## Configuration

The following options may be passed as a hash to the `FallingSquares()` constructor. Only the `canvas` property is mandatory. The rest revert to defaults, which you can (and should!) override. Some of the configuration is random, so you only have the option to specify boundaries (e.g. for speed), or a choice of possibilities (e.g. for colours).

### canvas (mandatory)

A reference to your canvas element.

    options.canvas = document.getElementById('my-canvas');

### colours

An array of hex colours that are randomly assigned to your falling squares. For now, the colour distribution is always even.

    options.colours = ['#70A8FF', '#FFBA7A'];

### size

The size in pixels of your squares

    options.size = 10;

### spacing

The horizontal spacing between columns in pixels. This is also the minimum vertical spacing between squares in the same column.

    options.spacing = 5;

### maxSpeed

The maximum possible speed (in pixels per tick) of squares in a column. All squares in a column fall at the same speed. The speed is assigned randomly.

    options.maxSpeed = 2;

### minSpeed

The minimum possible speed (in pixels per tick) of squares in a column. 

    options.minSpeed = 0.5;

### numberOfColumns

The number of columns of falling squares that will be generated.

    options.numberOfColumns = 5;

### numberOfSquares

The maximum number of falling squares that will appear in any one column.

    options.numberOfSquares = 3;

### backgroundColour

The hex background colour of the canvas. This will be applied to the area of falling squares every tick, to refresh the canvas for the next tick.

    options.backgroundColour = '#FFFFFF';

### xOffset

The horizontal offset in pixels from the left edge of canvas to the position at which you want the first column to appear.

    options.xOffset = 10;


## Contributing
 
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D
 