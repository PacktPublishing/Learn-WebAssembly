#ifndef TETRIS_BOARD_H
#define TETRIS_BOARD_H

#include <emscripten.h>
#include <SDL2/SDL.h>
#include "constants.h"
#include "piece.h"

using namespace Constants;

class Board {
 public:
  Board();
  void draw(SDL_Renderer *renderer);
  bool isCollision(const Piece &piece) const;
  void unite(const Piece &piece);

 private:
  bool isRowFull(int row);
  bool areFullRowsPresent();
  void updateOffsetRow(int fullRow);
  void displayScore(int newScore);

  bool cells_[BoardColumns][BoardRows];
  int currentScore_;
};

#endif // TETRIS_BOARD_H
