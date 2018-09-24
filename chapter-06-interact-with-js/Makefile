# These are all the files that could possibly have been output by
# the build steps:
OUTPUT_FILES = js-with-glue.js js-with-glue.wasm js-without-glue.wasm \
			   js-without-glue.wasm.map js-without-glue.wast

clean:
	rimraf $(OUTPUT_FILES)

js-with-glue: clean
	emcc js-with-glue.c -O3 -s WASM=1 -s MODULARIZE=1 -o js-with-glue.js

js-without-glue: clean
	emcc js-without-glue.cpp -Os -s WASM=1 -s SIDE_MODULE=1 \
	-s BINARYEN_ASYNC_COMPILATION=0 -o js-without-glue.wasm

with-source-maps: clean
	emcc js-without-glue.cpp -O1 -g4 \
	-s WASM=1 -s SIDE_MODULE=1 -s BINARYEN_ASYNC_COMPILATION=0 \
	-o js-without-glue.wasm \
	--source-map-base http://localhost:8080/chapter-06-interact-with-js
