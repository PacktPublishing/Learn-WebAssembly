/*
 * Converted to C code taken from:
 * https://github.com/timhutton/sdl-canvas-wasm
 * Some of the variable names and comments were also
 * slightly updated.
 */
#include <SDL2/SDL.h>
#include <emscripten.h>
#include <stdlib.h>

// This enables us to have a single point of reference
// for the current iteration and renderer, rather than
// have to refer to them separately.
typedef struct Context {
  SDL_Renderer *renderer;
  int iteration;
} Context;

/*
 * Looping function that draws a blue square on a red
 * background and moves it across the <canvas>.
 */
void mainloop(void *arg) {
    Context *ctx = (Context *)arg;
    SDL_Renderer *renderer = ctx->renderer;
    int iteration = ctx->iteration;

    // This sets the background color to red:
    SDL_SetRenderDrawColor(renderer, 255, 0, 0, 255);
    SDL_RenderClear(renderer);

    // This creates the moving blue square, the rect.x
    // and rect.y values update with each iteration to move
    // 1px at a time, so the square will move down and
    // to the right infinitely:
    SDL_Rect rect;
    rect.x = iteration;
    rect.y = iteration;
    rect.w = 50;
    rect.h = 50;
    SDL_SetRenderDrawColor(renderer, 0, 0, 255, 255);
    SDL_RenderFillRect(renderer, &rect);

    SDL_RenderPresent(renderer);

    // This resets the counter to 0 as soon as the iteration
    // hits the maximum canvas dimension (otherwise you'd
    // never see the blue square after it travelled across
    // the canvas once).
    if (iteration == 255) {
        ctx->iteration = 0;
    } else {
        ctx->iteration++;
    }
}

int main() {
    SDL_Init(SDL_INIT_VIDEO);
    SDL_Window *window;
    SDL_Renderer *renderer;

    // The first two 255 values represent the size of the <canvas>
    // element in pixels.
    SDL_CreateWindowAndRenderer(255, 255, 0, &window, &renderer);

    Context ctx;
    ctx.renderer = renderer;
    ctx.iteration = 0;

    // Call the function repeatedly:
    int infinite_loop = 1;

    // Call the function as fast as the browser wants to render
    // (typically 60fps):
    int fps = -1;

    // This is a function from emscripten.h, it sets a C function
    // as the main event loop for the calling thread:
    emscripten_set_main_loop_arg(mainloop, &ctx, fps, infinite_loop);

    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();

    return EXIT_SUCCESS;
}
