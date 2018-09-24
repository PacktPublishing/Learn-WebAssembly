/**
 * This file interacts with the canvas through imported functions.
 * It moves a little alien diagonally across the canvas
 * (mimics the SDL example).
 */
#include <emscripten.h>
#include <stdbool.h>

extern "C" {

// These functions are passed in through the importObj.env object
// and update the rectangle on the <canvas>:
extern int jsClearRect();
extern int jsFillRect(int x, int y, int width, int height);

bool isRunning = true;

typedef struct Bounds {
  int width;
  int height;
} Bounds;

// We're using the term "Rect" to represent the rectangle the
// image occupies:
typedef struct Rect {
  int x;
  int y;
  int width;
  int height;
  // Horizontal direction of travel (L/R):
  char horizDir;
  // Vertical direction of travel (U/D):
  char vertDir;
} Rect;

struct Bounds bounds;
struct Rect rect;

/**
 * Updates the rectangle location by +/- 1px in the x or y based on
 * the current location.
 */
void updateRectLocation() {
    // Determine if the bounding rectangle has "bumped" into either
    // the left/right side or top/bottom side. Depending on which side,
    // flip the direction:
    int xBouncePoint = bounds.width - rect.width;
    if (rect.x == xBouncePoint) rect.horizDir = 'L';
    if (rect.x == 0) rect.horizDir = 'R';

    int yBouncePoint = bounds.height - rect.height;
    if (rect.y == yBouncePoint) rect.vertDir = 'U';
    if (rect.y == 0) rect.vertDir = 'D';

    // If the direction has changed based on the x and y
    // coordinates, ensure the x and y points update
    // accordingly:
    int horizIncrement = 1;
    if (rect.horizDir == 'L') horizIncrement = -1;
    rect.x = rect.x + horizIncrement;

    int vertIncrement = 1;
    if (rect.vertDir == 'U') vertIncrement = -1;
    rect.y = rect.y + vertIncrement;
}

/*
 * We need to add the EMSCRIPTEN_KEEPALIVE statements and wrap the
 * code in an `extern "C"` statement for the cpp-wasm-loader.
 */

/**
 * Clear the existing rectangle element from the canvas and draw a new
 * one in the updated location.
 */
EMSCRIPTEN_KEEPALIVE
void moveRect() {
    jsClearRect();
    updateRectLocation();
    jsFillRect(rect.x, rect.y, rect.width, rect.height);
}

EMSCRIPTEN_KEEPALIVE
bool getIsRunning() {
    return isRunning;
}

EMSCRIPTEN_KEEPALIVE
void setIsRunning(bool newIsRunning) {
     isRunning = newIsRunning;
}

EMSCRIPTEN_KEEPALIVE
void start(int boundsWidth, int boundsHeight, int rectWidth,
           int rectHeight) {
    rect.x = 0;
    rect.y = 0;
    rect.horizDir = 'R';
    rect.vertDir = 'D';
    rect.width = rectWidth;
    rect.height = rectHeight;
    bounds.width = boundsWidth;
    bounds.height = boundsHeight;
    setIsRunning(true);
}
}
