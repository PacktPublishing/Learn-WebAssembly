# This allows you to just run the "make" command without specifying
# arguments:
.DEFAULT_GOAL := build

# Specifies which files to compile as part of the project:
CPP_FILES = $(wildcard src/*.cpp)

# Flags to use for Emscripten emcc compile command:
FLAGS = -std=c++14 -O3 -s WASM=1 -s USE_SDL=2 -s MODULARIZE=1 \
		--bind $(CPP_FILES)

# Name of output (the .wasm file is created automatically):
OUTPUT_FILE = public/index.js

# This is the target that compiles our executable
compile: $(CPP_FILES)
	emcc  $(FLAGS) -o $(OUTPUT_FILE)

# Removes the existing index.js and index.wasm files:
clean:
	rimraf $(OUTPUT_FILE)
	rimraf public/index.wasm

# Removes the existing files and builds the project:
build: clean compile
	@echo "Build Complete!"
