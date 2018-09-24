// This is loaded using the css-loader dependency:
import './styles.css';

// This is loaded using the cpp-wasm-loader dependency:
import wasm from './main.c';

// These are loaded using the file-loader dependency:
import backgroundImage from './assets/background.jpg';
import spaceshipImage from './assets/spaceship.svg';

export default {
  data() {
    return {
      instance: null,
      bounds: { width: 800, height: 592 },
      rect: { width: 200, height: 120 },
      speed: 5
    };
  },
  methods: {
    // Create a new Image instance to pass into the drawImage function
    // for the <canvas> element's context:
    loadImage(imageSrc) {
      const loadedImage = new Image();
      loadedImage.src = imageSrc;
      return new Promise((resolve, reject) => {
        loadedImage.onload = () => resolve(loadedImage);
        loadedImage.onerror = () => reject();
      });
    },

    // Compile/load the contents of main.c and assign the resulting
    // Wasm module instance to the components this.instance property:
    async initializeWasm() {
      const ctx = this.$refs.canvas.getContext('2d');

      // Create Image instances of the background and spaceship.
      // These are required to pass into the ctx.drawImage() function:
      const [bouncer, background] = await Promise.all([
        this.loadImage(spaceshipImage),
        this.loadImage(backgroundImage)
      ]);

      // Compile the C code to Wasm and assign the resulting
      // module.exports to this.instance:
      const { width, height } = this.bounds;
      return wasm
        .init(imports => ({
          ...imports,
          _jsFillRect(x, y, w, h) {
            ctx.drawImage(bouncer, x, y, w, h);
          },
          _jsClearRect() {
            ctx.drawImage(background, 0, 0, width, height);
          }
        }))
        .then(module => {
          this.instance = module.exports;
          return Promise.resolve();
        });
    },

    // Looping function to move the spaceship across the canvas.
    loopRectMotion() {
      setTimeout(() => {
        this.instance.moveRect();
        if (this.instance.getIsRunning()) this.loopRectMotion();
      }, 15 - this.speed);
    },

    // Pauses/resumes the spaceship's movement when the button is
    // clicked:
    onActionClick(event) {
      const newIsRunning = !this.instance.getIsRunning();
      this.instance.setIsRunning(newIsRunning);
      event.target.innerHTML = newIsRunning ? 'Pause' : 'Resume';
      if (newIsRunning) this.loopRectMotion();
    }
  },
  mounted() {
    this.initializeWasm().then(() => {
      this.instance.start(
        this.bounds.width,
        this.bounds.height,
        this.rect.width,
        this.rect.height
      );
      this.loopRectMotion();
    });
  },
  template: `
    <div class="flex column">
      <h1>SPACE WASM!</h1>
      <canvas
        ref="canvas"
        :height="bounds.height"
        :width="bounds.width">
      </canvas>
      <div class="flex controls">
        <div>
          <button class="defaultText" @click="onActionClick">
            Pause
          </button>
        </div>
        <div class="flex column">
          <label class="defaultText" for="speed">Speed: {{speed}}</label>
          <input
            v-model="speed"
            id="speed"
            type="range"
            min="1"
            max="10"
            step="1">
        </div>
      </div>
    </div>
  `
};
