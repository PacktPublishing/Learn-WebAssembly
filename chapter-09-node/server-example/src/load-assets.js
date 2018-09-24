const fs = require('fs');
const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const assetsPath = path.resolve(__dirname, 'assets');

/**
 * Returns a buffer with the contents of the specified Wasm file.
 * @param fileName Name of the Wasm file to load into a typed array.
 */
const getBufferSource = fileName => {
  const filePath = path.resolve(assetsPath, fileName);
  return fs.readFileSync(filePath);
};

/**
 * Instantiates the required Wasm modules and returns a Promise that
 * resolves with the instance of assets/main.wasm.
 */
const loadWasm = async () => {
  const wasmMemory = new WebAssembly.Memory({ initial: 1024 });
  const memoryBuffer = getBufferSource('memory.wasm');
  const memoryInstance = await WebAssembly.instantiate(memoryBuffer, {
    env: {
      memory: wasmMemory
    }
  });

  const mainBuffer = getBufferSource('main.wasm');
  const results = await WebAssembly.instantiate(mainBuffer, {
    env: {
      memoryBase: 0,
      tableBase: 0,
      memory: wasmMemory,
      table: new WebAssembly.Table({ initial: 16, element: 'anyfunc' }),
      abort: console.log,
      _malloc: memoryInstance.instance.exports.malloc,
      _free: memoryInstance.instance.exports.free
    }
  });
  return results.instance.exports;
};

/**
 * Returns a lowdb mock database instance to read and manipulate
 * data in assets/db.json.
 */
const loadDb = () => {
  const dbPath = path.resolve(assetsPath, 'db.json');
  const adapter = new FileSync(dbPath);
  return low(adapter);
};

module.exports = async function loadAssets() {
  const db = loadDb();
  const wasmInstance = await loadWasm();
  return {
    db,
    wasmInstance
  };
};
