#ifndef TETRIS_PIECE_H
#define TETRIS_PIECE_H

#include <SDL2/SDL.h>
#include "constants.h"

class Piece {
 public:
  enum Kind { I = 0, J, L, O, S, T, Z };

  explicit Piece(Kind kind);

  void draw(SDL_Renderer *renderer);
  void move(int columnDelta, int rowDelta);
  void rotate();
  bool isBlock(int column, int row) const;
  int getColumn() const;
  int getRow() const;

 private:
  Kind kind_;
  int column_;
  int row_;
  int angle_;
};

#endif // TETRIS_PIECE_H
