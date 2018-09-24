#include <cstdlib>
#include <iostream>
#include <stdexcept>
#include "game.h"

using namespace std;
using namespace Constants;

Game::Game() :
    // Create a new random piece:
    piece_{ static_cast<Piece::Kind>(rand() % 7) },
    moveTime_(SDL_GetTicks())
{
    if (SDL_Init(SDL_INIT_VIDEO) != 0) {
        throw runtime_error(
            "SDL_Init(SDL_INIT_VIDEO): " + string(SDL_GetError()));
    }
    SDL_CreateWindowAndRenderer(
        BoardWidth,
        ScreenHeight,
        SDL_WINDOW_OPENGL,
        &window_,
        &renderer_);
    SDL_SetWindowPosition(
        window_,
        SDL_WINDOWPOS_CENTERED,
        SDL_WINDOWPOS_CENTERED);
    SDL_SetWindowTitle(window_, "Tetris");

    if (TTF_Init() != 0) {
        throw runtime_error("TTF_Init():" + string(TTF_GetError()));
    }
    font_ = TTF_OpenFont("PressStart2P.ttf", 18);
    if (font_ == nullptr) {
        throw runtime_error("TTF_OpenFont: " + string(TTF_GetError()));
    }
}

Game::~Game() {
    TTF_CloseFont(font_);
    TTF_Quit();
    SDL_DestroyRenderer(renderer_);
    SDL_DestroyWindow(window_);
    SDL_Quit();
}

/*
 * Looping function for running game (updates made every 1 second).
 */
bool Game::loop() {
    SDL_Event event;
    while (SDL_PollEvent(&event)) {
        switch (event.type) {
            case SDL_KEYDOWN:
                handleKeyEvents(event);
                break;
            case SDL_QUIT:
                return false;
            default:
                return true;
        }
    }

    SDL_SetRenderDrawColor(renderer_, /* Dark Gray: */ 58, 58, 58, 255);
    SDL_RenderClear(renderer_);
    board_.draw(renderer_, font_);
    piece_.draw(renderer_);

    if (SDL_GetTicks() > moveTime_) {
        moveTime_ += 1000;
        Piece newPiece = piece_;
        newPiece.move(0, 1);
        checkForCollision(newPiece);
    }
    SDL_RenderPresent(renderer_);
    return true;
}

/*
 * Checks if the specified piece has collided with the bounds of the board.
 * If a collision occurred, the game is over and the board is cleared.
 */
void Game::checkForCollision(const Piece &newPiece) {
    if (board_.isCollision(newPiece)) {
        board_.unite(piece_);
        piece_ = Piece{ static_cast<Piece::Kind>(rand() % 7) };
        if (board_.isCollision(piece_)) board_ = Board();
    } else {
        piece_ = newPiece;
    }
}

/*
 * Moves the piece in the direction that corresponds with the key
 * presses.
 */
void Game::handleKeyEvents(SDL_Event &event) {
    Piece newPiece = piece_;
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
    if (!board_.isCollision(newPiece)) piece_ = newPiece;
}
