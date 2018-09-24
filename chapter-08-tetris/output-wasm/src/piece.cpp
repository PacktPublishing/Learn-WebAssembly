#include "piece.h"

using namespace Constants;

Piece::Piece(Piece::Kind kind) :
    kind_(kind),
    column_(BoardColumns / 2 - PieceSize / 2),
    row_(0),
    angle_(0) {
}

/*
 * Draws the piece that corresponds with the kind specified in the
 * constructor and sets color appropriately.
 */
void Piece::draw(SDL_Renderer *renderer) {
    switch (kind_) {
        case I:
            SDL_SetRenderDrawColor(renderer,
                /* Cyan: */ 45, 254, 254, 255);
            break;
        case J:
            SDL_SetRenderDrawColor(renderer,
                /* Blue: */ 11, 36, 251, 255);
            break;
        case L:
            SDL_SetRenderDrawColor(renderer,
                /* Orange: */ 253, 164, 41, 255);
            break;
        case O:
            SDL_SetRenderDrawColor(renderer,
                /* Yellow: */ 255, 253, 56, 255);
            break;
        case S:
            SDL_SetRenderDrawColor(renderer,
                /* Green: */ 41, 253, 47, 255);
            break;
        case T:
            SDL_SetRenderDrawColor(renderer,
                /* Purple: */ 126, 15, 126, 255);
            break;
        case Z:
            SDL_SetRenderDrawColor(renderer,
                /* Red: */ 252, 13, 28, 255);
            break;
    }

    for (int column = 0; column < PieceSize; ++column) {
        for (int row = 0; row < PieceSize; ++row) {
            if (isBlock(column, row)) {
                SDL_Rect rect{
                    (column + column_) * Offset + 1,
                    (row + row_) * Offset + 1,
                    Offset - 2,
                    Offset - 2
                };
                SDL_RenderFillRect(renderer, &rect);
            }
        }
    }
}

/*
 * Moves the piece a specified number of columns and rows.
 */
void Piece::move(int columnDelta, int rowDelta) {
    column_ += columnDelta;
    row_ += rowDelta;
}

/*
 * Rotates the piece to a different orientation in the Shapes array
 * (in isBlock function).
 */
void Piece::rotate() {
    angle_ += 3;
    angle_ %= 4;
}

/*
 * Returns true if the piece is present in the specified column and row.
 */
bool Piece::isBlock(int column, int row) const {
    static const char *Shapes[][4] = {
        // I
        {
            " *  "
            " *  "
            " *  "
            " *  ",
            "    "
            "****"
            "    "
            "    ",
            " *  "
            " *  "
            " *  "
            " *  ",
            "    "
            "****"
            "    "
            "    ",
        },
        // J
        {
            "  * "
            "  * "
            " ** "
            "    ",
            "    "
            "*   "
            "*** "
            "    ",
            " ** "
            " *  "
            " *  "
            "    ",
            "    "
            "    "
            "*** "
            "  * ",
        },
        // L
        {
            " *  "
            " *  "
            " ** "
            "    ",
            "    "
            "*** "
            "*   "
            "    ",
            " ** "
            "  * "
            "  * "
            "    ",
            "  * "
            "*** "
            "    "
            "    ",
        },
        // O
        {
            "    "
            " ** "
            " ** "
            "    ",
            "    "
            " ** "
            " ** "
            "    ",
            "    "
            " ** "
            " ** "
            "    ",
            "    "
            " ** "
            " ** "
            "    ",
        },
        // S
        {
            " *  "
            " ** "
            "  * "
            "    ",
            "    "
            " ** "
            "**  "
            "    ",
            " *  "
            " ** "
            "  * "
            "    ",
            "    "
            " ** "
            "**  "
            "    ",
        },
        // T
        {
            " *  "
            " ** "
            " *  "
            "    ",
            "    "
            "*** "
            " *  "
            "    ",
            " *  "
            "**  "
            " *  "
            "    ",
            " *  "
            "*** "
            "    "
            "    ",
        },
        // Z
        {
            "  * "
            " ** "
            " *  "
            "    ",
            "    "
            "**  "
            " ** "
            "    ",
            "  * "
            " ** "
            " *  "
            "    ",
            "    "
            "**  "
            " ** "
            "    ",
        },
    };
    return Shapes[kind_][angle_][column + row * PieceSize] == '*';
}

int Piece::getColumn() const {
    return column_;
}

int Piece::getRow() const {
    return row_;
}
