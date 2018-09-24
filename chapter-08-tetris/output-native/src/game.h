#ifndef TETRIS_GAME_H
#define TETRIS_GAME_H

#include <SDL2/SDL.h>
#include <SDL2/SDL_ttf.h>
#include "constants.h"
#include "board.h"
#include "piece.h"

class Game {
 public:
  Game();
  ~Game();
  bool loop();

 private:
  Game(const Game &);
  Game &operator=(const Game &);

  void checkForCollision(const Piece &newPiece);
  void handleKeyEvents(SDL_Event &event);

  SDL_Window *window_;
  SDL_Renderer *renderer_;
  TTF_Font *font_;
  Board board_;
  Piece piece_;
  uint32_t moveTime_;
};

#endif // TETRIS_GAME_H
