/*
 * This file interacts with the canvas through imported functions.
 * It moves a circle diagonally across the canvas.
 */
#define BOUNDS 255
#define CIRCLE_RADIUS 50
#define BOUNCE_POINT (BOUNDS - CIRCLE_RADIUS)

bool isRunning = true;

typedef struct Circle {
  int x;
  int y;
  char direction;
} Circle;

struct Circle circle;

/*
 * Updates the circle location by 1px in the x and y in a
 * direction based on its current position.
 */
void updateCircleLocation() {
    // Since we want the circle to "bump" into the edge of the canvas,
    // we need to determine when the right edge of the circle
    // encounters the bounds of the canvas, which is why we're using
    // the canvas width - circle width:
    if (circle.x == BOUNCE_POINT) circle.direction = 'L';

    // As soon as the circle "bumps" into the left side of the
    // canvas, it should change direction again.
    if (circle.x == CIRCLE_RADIUS) circle.direction = 'R';

    // If the direction has changed based on the x and y
    // coordinates, ensure the x and y points update accordingly:
    int incrementer = 1;
    if (circle.direction == 'L') incrementer = -1;
    circle.x = circle.x + incrementer;
    circle.y = circle.y - incrementer;
}

// We need to wrap any imported or exported functions in an
// extern block, otherwise the function names will be mangled.
extern "C" {
// These functions are passed in through the importObj.env object
// and update the circle on the <canvas>:
extern int jsClearCircle();
extern int jsFillCircle(int x, int y, int radius);

/*
 * Clear the existing circle element from the canvas and draw a
 * new one in the updated location.
 */
void moveCircle() {
    jsClearCircle();
    updateCircleLocation();
    jsFillCircle(circle.x, circle.y, CIRCLE_RADIUS);
}

bool getIsRunning() {
    return isRunning;
}

void setIsRunning(bool newIsRunning) {
    isRunning = newIsRunning;
}

void init() {
    circle.x = 0;
    circle.y = 255;
    circle.direction = 'R';
    setIsRunning(true);
}
}
