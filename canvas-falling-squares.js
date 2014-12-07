(function(factory) {

  //AMD
  if (typeof define === 'function' && define.amd) {
    define(function() {
      return factory();
    });

  //Browser global
  } else {
    window.FallingSquares = factory();
  }

}(function() {

    // Rectangle with rounded corners
    // from http://js-bits.blogspot.co.uk/2010/07/canvas-rounded-corner-rectangles.html
    CanvasRenderingContext2D.prototype.roundRect = CanvasRenderingContext2D.prototype.roundRect ||
        function(x, y, width, height, radius, fill, stroke) {

            if (typeof stroke === "undefined" ) {
                stroke = true;
            }

            if (typeof radius === "undefined") {
                radius = 5;
            }

            this.beginPath();
            this.moveTo(x + radius, y);

            this.lineTo(x + width - radius, y);
            this.quadraticCurveTo(x + width, y, x + width, y + radius);
            this.lineTo(x + width, y + height - radius);
            this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            this.lineTo(x + radius, y + height);
            this.quadraticCurveTo(x, y + height, x, y + height - radius);
            this.lineTo(x, y + radius);
            this.quadraticCurveTo(x, y, x + radius, y);

            this.closePath();

            if (stroke) {
                this.stroke();
            }
            if (fill) {
                this.fill();
            }
        };

    // FallingSquares
    // ---------------

    // The main FallingSquares constructor that will be exported.
    // Applies a number of "sensible" defaults for demonstration
    // but you should override these  for your own purposes by
    // passing a configuration object.

    function FallingSquares(options) {

        var canvas = options.canvas,
            context = options.canvas.getContext('2d'),
            colours = options.colours || ['#70A8FF', '#FFBA7A'],
            size = options.size || 10,
            spacing = options.spacing || 5,
            maxSpeed = options.maxSpeed || 2,
            minSpeed = options.minSpeed || 0.5,
            numberOfColumns = options.numberOfColumns || 5,
            numberOfSquares = options.numberOfSquares || 3,
            backgroundColour = options.backgroundColour || '#FFFFFF',
            xOffset = options.xOffset || 10,
            columns = [],

            // Helper functions for determining random positions / colours / speeds
            randomHelper = (function () {

                // Determine whether a new square would be overlapping an existing square
                var isOverlapping = function (yNew, yExisting) {
                    return !(yNew + size < yExisting - spacing) && !(yNew > yExisting + spacing + size);
                };

                return {

                    // Square fall speed, allocated randomly between a maximum and minimum
                    // Assigned when a column is generated, stays constant for the life of
                    // the column
                    randomSpeed: function () {
                        var speed = (Math.random() * maxSpeed);
                        speed = (speed < minSpeed) ? speed + minSpeed : speed;
                        return speed;
                    },

                    // Colours will be assigned randomly, but distributed evenly
                    randomColour: function () {
                        var division = 1 / colours.length,
                            random = Math.random(),
                            i = 0,
                            currDivision = division;

                        for (; i < colours.length; i += 1) {
                            if (currDivision >= random) {
                                return colours[i];
                            }
                            currDivision += division;
                        }

                    },

                    // Randomise the starting position of a square that has reached the bottom.
                    // The square will always restart off-canvas and fall into it from the top.
                    randomY: function(column) {
                        var yPos = Math.floor(Math.random() * -canvas.height),
                            randomY = this.randomY.bind(this, column);

                        column.squares.forEach(function (square) {
                            if (isOverlapping(yPos, square.y)) {
                                // if new square overlaps existing square, recursively find a new y position
                                yPos = randomY();
                            }
                        });
                        
                        return yPos;
                    }
                };

            }());

        // Let's get this started
        function begin() {
            buildColumns();
            animate();
        }

        // Generate the given number of columns, with given size and spacing options
        function buildColumns() {
            var i = 0,
                currPos = xOffset;

            for (; i < numberOfColumns; i += 1) { 
                columns.push(new Column(currPos, randomHelper.randomSpeed()));
                currPos += size + spacing;
            }
        }

        // Every tick, cause animation to happen
        function animate() {
            requestAnimationFrame(animate);
            resetSquares();
            redraw();
        }

        // Fill a blank rectangle over the top of all columns to reset the canvas 
        // for the next animation tick
        function resetSquares() {
            var width = (size * numberOfColumns) + (spacing * (numberOfColumns - 1)) + xOffset;
            context.fillStyle = backgroundColour;
            context.fillRect(xOffset - 1, 0, width, canvas.height);
        }

        // Redraw each column in turn
        function redraw() {
            columns.forEach(function (column) {
                column.redraw();
            });
        }


        // Column
        // ---------------

        // Each column has its own x position and speed, that will remain constant
        // for the life of the column. The column also maintains a reference to its
        // child squares

        function Column(x, speed) {
            this.squares = [];
            this.speed = speed;
            this.x = x;
            this.buildSquares();
        }


        // Redraw each square in turn
        Column.prototype.redraw = function () {
            this.squares.forEach(function (square) {
                square.redraw();
            });
        };

        // Generate the given number of squares, with randomly assigned 
        // colours and starting positions
        Column.prototype.buildSquares = function () {
            var i = 0;
            for (; i < numberOfSquares; i += 1) {
                this.squares.push(new Square({
                    y: randomHelper.randomY(this),
                    colour: randomHelper.randomColour(), 
                    column: this
                }));
            }
        };


        // Square
        // ---------------

        // Each square has its own colour, that will remain constant for the
        // life of the square. The square also maintains a reference back to
        //  its parent column for determining speed, x position and ensuring it
        // doesn't overlap any other squares in this column when it is redrawn
        // at the top of the canvas.

        function Square(options) {
            this.y = options.y;
            this.colour = options.colour,
            this.column = options.column;
        }

        Square.prototype.redraw = function () {
            this.y += this.column.speed;

            //fallen off the bottom, randomise new starting position
            if (this.y > canvas.height) {
                this.y = randomHelper.randomY(this.column);
            }

            context.fillStyle = this.colour;
            context.strokeStyle = this.colour;
            context.roundRect(this.column.x, this.y, size, size, 1, true, true);
        };

        // Start the fun
        begin();

    }

    return FallingSquares;

}));