# These are all the files that could possibly have been output by
# the build steps:
OUTPUT_FILES = with-glue.html with-glue.js with-glue.wasm \
			   custom-loading.js custom-loading.wasm \
			   try-with-glue.wasm without-glue.wasm

clean:
	rimraf $(OUTPUT_FILES)

with-glue: clean
	emcc with-glue.c -O3 -s WASM=1 -s USE_SDL=2 -o with-glue.html

custom-loading: clean
	emcc with-glue.c -O3 -s WASM=1 -s USE_SDL=2 -s MODULARIZE=1 \
	-o custom-loading.js

try-with-glue: clean
	emcc with-glue.c -Os -s WASM=1 -s USE_SDL=2 \
	-s SIDE_MODULE=1 -s BINARYEN_ASYNC_COMPILATION=0 \
	-o try-with-glue.wasm

without-glue: clean
	emcc without-glue.c -Os -s WASM=1 -s SIDE_MODULE=1 \
	-s BINARYEN_ASYNC_COMPILATION=0 -o without-glue.wasm
