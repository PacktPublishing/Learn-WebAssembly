/*
 * This file interacts with the canvas through imported functions.
 * It moves a blue rectangle diagonally across the canvas
 * (mimics the SDL example).
 */
#include <emscripten.h>
#include <stdbool.h>

#define BOUNDS 255
#define RECT_SIDE 50
#define BOUNCE_POINT (BOUNDS - RECT_SIDE)

bool isRunning = true;

typedef struct Rect {
  int x;
  int y;
  char direction;
} Rect;

struct Rect rect;

/*
 * Updates the rectangle location by 1px in the x and y in a
 * direction based on its current position.
 */
void updateRectLocation() {
    // Since we want the rectangle to "bump" into the edge of the
    // canvas, we need to determine when the right edge of the
    // rectangle encounters the bounds of the canvas, which is why
    // we're using the canvas width - rectangle width:
    if (rect.x == BOUNCE_POINT) rect.direction = 'L';

    // As soon as the rectangle "bumps" into the left side of the
    // canvas, it should change direction again.
    if (rect.x == 0) rect.direction = 'R';

    // If the direction has changed based on the x and y
    // coordinates, ensure the x and y points update
    // accordingly:
    int incrementer = 1;
    if (rect.direction == 'L') incrementer = -1;
    rect.x = rect.x + incrementer;
    rect.y = rect.y + incrementer;
}

EM_JS(void, js_clear_rect, (), {
    // Clear the rectangle to ensure there's no color where it
    // was before:
    var canvas = document.querySelector('#myCanvas');
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(0, 0, 255, 255);
});

EM_JS(void, js_fill_rect, (int x, int y, int width, int height), {
    // Fill the rectangle with blue in the specified coordinates:
    var canvas = document.querySelector('#myCanvas');
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0000ff';
    ctx.fillRect(x, y, width, height);
});

/*
 * Clear the existing rectangle element from the canvas and draw a
 * new one in the updated location.
 */
EMSCRIPTEN_KEEPALIVE
void moveRect() {
    // Event though the js_clear_rect doesn't have any
    // parameters, we pass 0 in to prevent a compiler warning:
    js_clear_rect(0);
    updateRectLocation();
    js_fill_rect(rect.x, rect.y, RECT_SIDE, RECT_SIDE);
}

EMSCRIPTEN_KEEPALIVE
bool getIsRunning() {
    return isRunning;
}

EMSCRIPTEN_KEEPALIVE
void setIsRunning(bool newIsRunning) {
    isRunning = newIsRunning;
    EM_ASM({
        // isRunning is either 0 or 1, but in JavaScript, 0
        // is "falsy", so we can set the status text based
        // without explicitly checking if the value is 0 or 1:
        var newStatus = $0 ? 'Running' : 'Paused';
        document.querySelector('#runStatus').innerHTML = newStatus;
    }, isRunning);
}

EMSCRIPTEN_KEEPALIVE
void init() {
    emscripten_run_script("console.log('Initializing rectangle...')");
    rect.x = 0;
    rect.y = 0;
    rect.direction = 'R';
    setIsRunning(true);
    emscripten_run_script("console.log('Rectangle should be moving!')");
}
