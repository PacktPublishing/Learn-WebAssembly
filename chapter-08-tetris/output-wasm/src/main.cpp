#include <emscripten/emscripten.h>
#include <SDL2/SDL.h>
#include <stdexcept>
#include "constants.h"
#include "board.h"
#include "piece.h"

using namespace std;
using namespace Constants;

static SDL_Window *window = nullptr;
static SDL_Renderer *renderer = nullptr;
static Piece currentPiece{ static_cast<Piece::Kind>(rand() % 7) };
static Board board;
static int moveTime;

void checkForCollision(const Piece &newPiece) {
    if (board.isCollision(newPiece)) {
        board.unite(currentPiece);
        currentPiece = Piece{ static_cast<Piece::Kind>(rand() % 7) };
        if (board.isCollision(currentPiece)) board = Board();
    } else {
        currentPiece = newPiece;
    }
}

void handleKeyEvents(SDL_Event &event) {
    Piece newPiece = currentPiece;
    switch (event.key.keysym.sym) {
        case SDLK_DOWN:
            newPiece.move(0, 1);
            break;
        case SDLK_RIGHT:
            newPiece.move(1, 0);
            break;
        case SDLK_LEFT:
            newPiece.move(-1, 0);
            break;
        case SDLK_UP:
            newPiece.rotate();
            break;
        default:
            break;
    }
    if (!board.isCollision(newPiece)) currentPiece = newPiece;
}

void loop() {
    SDL_Event event;
    while (SDL_PollEvent(&event)) {
        switch (event.type) {
            case SDL_KEYDOWN:
                handleKeyEvents(event);
                break;
            case SDL_QUIT:
                break;
            default:
                break;
        }
    }

    SDL_SetRenderDrawColor(renderer, /* Dark Gray: */ 58, 58, 58, 255);
    SDL_RenderClear(renderer);
    board.draw(renderer);
    currentPiece.draw(renderer);

    if (SDL_GetTicks() > moveTime) {
        moveTime += 1000;
        Piece newPiece = currentPiece;
        newPiece.move(0, 1);
        checkForCollision(newPiece);
    }
    SDL_RenderPresent(renderer);
}

int main() {
    moveTime = SDL_GetTicks();
    if (SDL_Init(SDL_INIT_VIDEO) != 0) {
        throw std::runtime_error("SDL_Init(SDL_INIT_VIDEO)");
    }
    SDL_CreateWindowAndRenderer(
        BoardWidth,
        BoardHeight,
        SDL_WINDOW_OPENGL,
        &window,
        &renderer);

    emscripten_set_main_loop(loop, 0, 1);

    SDL_DestroyRenderer(renderer);
    renderer = nullptr;
    SDL_DestroyWindow(window);
    window = nullptr;
    SDL_Quit();
    return 0;
}
