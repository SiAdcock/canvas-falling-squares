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

            //Helper functions for determining random positions / colours / speeds
            randomHelper = (function () {

                //Determine whether a new square is overlapping an existing square
                var isOverlapping = function (yNew, yExisting) {
                    return !(yNew + size < yExisting - spacing) && !(yNew > yExisting + spacing + size);
                };

                return {

                    randomSpeed: function (maxSpeed, minSpeed) {
                        var speed = (Math.random() * maxSpeed);
                        speed = (speed < minSpeed) ? speed + minSpeed : speed;
                        return speed;
                    },
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
                    randomY: function(column) {
                        var yPos = Math.floor(Math.random() * -canvas.height),
                            randomY = this.randomY.bind(this, column);

                        column.squares.forEach(function (square) {
                            if (isOverlapping(yPos, square.getYPos())) {
                                //if new square overlaps existing square, recursively find a new y position
                                yPos = randomY();
                            }
                        });
                        
                        return yPos;
                    }
                };

            }());



        function buildColumns() {
            var i = 0,
                currPos = xOffset;

            for (; i < numberOfColumns; i += 1) { 
                columns.push(new Column(currPos, randomHelper.randomSpeed(maxSpeed, minSpeed)));
                currPos += size + spacing;
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            resetSquares();
            redraw();
        }

        function resetSquares() {
            var width = (size * numberOfColumns) + (spacing * (numberOfColumns - 1)) + xOffset;
            context.fillStyle = backgroundColour;
            context.fillRect(xOffset - 1, 0, width, canvas.height);
        }

        function redraw() {
            columns.forEach(function (column) {
                column.redraw();
            });
        }



        function Column(x, speed) {

            this.squares = [];
            this.speed = speed;
            this.x = x;

            this.redraw = function () {
                this.squares.forEach(function (square) {
                    square.redraw();
                });
            };

            this.buildSquares = function () {
                var i = 0;
                for (; i < numberOfSquares; i += 1) {
                    this.squares.push(new Square({
                        y: randomHelper.randomY(this),
                        colour: randomHelper.randomColour(), 
                        column: this
                    }));
                }
            };

            //begin column
            this.buildSquares();

        }


        function Square(options) {

            var y = options.y,
                colour = options.colour,
                column = options.column;

            this.getYPos = function () {
                return y;
            };

            this.redraw = function () {
                y += column.speed;

                //fallen off the bottom, randomise new starting position
                if (y > canvas.height) {
                    y = randomHelper.randomY(column);
                }

                context.fillStyle = colour;
                context.strokeStyle = colour;
                context.roundRect(column.x, y, size, size, 1, true, true);
            };
        }

        //begin falling squares!
        buildColumns();

        //start squares animation
        animate();
    }


    return FallingSquares;
}));