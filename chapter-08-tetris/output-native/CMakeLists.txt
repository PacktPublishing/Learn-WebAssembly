cmake_minimum_required(VERSION 3.5)
project(Tetris)

set(CMAKE_CXX_STANDARD 14)

# TODO: Add configuration for Windows
if(WIN32)
    message(FATAL_ERROR "You cannot build on your platform.")
else()
    # This is used to find the SDL_ttf library (CMake can't find it
    # out of the box):
    set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} "${CMAKE_SOURCE_DIR}/cmake/")

    find_package(SDL2 REQUIRED)
    find_package(SDL2_ttf REQUIRED)

    include_directories(
        ${CMAKE_SOURCE_DIR}/include
        ${SDL2_INCLUDE_DIRS}
        ${SDL2_TTF_INCLUDE_DIRS}
    )
endif()

# This is the font used for displaying the score:
file(
    COPY ${CMAKE_CURRENT_SOURCE_DIR}/resources/PressStart2P.ttf
    DESTINATION ${CMAKE_CURRENT_BINARY_DIR}
)

add_executable(
    Tetris
    src/board.cpp
    src/board.h
    src/constants.h
    src/game.cpp
    src/game.h
    src/main.cpp
    src/piece.cpp
    src/piece.h
)

target_link_libraries(Tetris ${SDL2_LIBRARIES} ${SDL2_TTF_LIBRARIES})
