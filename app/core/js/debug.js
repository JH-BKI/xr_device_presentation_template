// VR Console Component and related debug logic
AFRAME.registerComponent('vr-console', {
  schema: {
    maxLines: {type: 'int', default: 20},
    width: {type: 'number', default: 3},
    color: {type: 'string', default: '#FFF'}
  },
  init: function () {
    console.log('VR Console init');

    // Create background plane
    this.bgEl = document.createElement('a-plane');
    this.bgEl.setAttribute('width', this.data.width + 0.2);
    this.bgEl.setAttribute('height', 1.4);
    this.bgEl.setAttribute('color', '#222');
    this.bgEl.setAttribute('opacity', 0.7);
    this.bgEl.setAttribute('side', 'double');
    this.bgEl.setAttribute('position', '0 0 0');
    this.el.appendChild(this.bgEl);

    // Create a-text child
    this.textEl = document.createElement('a-text');
    this.textEl.setAttribute('width', this.data.width);
    this.textEl.setAttribute('color', this.data.color);
    this.textEl.setAttribute('side', 'double');
    this.textEl.setAttribute('value', 'VR Console Ready');
    this.textEl.setAttribute('align', 'left');
    this.textEl.setAttribute('anchor', 'left');
    this.textEl.setAttribute('wrap-count', '75');
    this.textEl.setAttribute('position', '-1.5 0 0.01');
    this.textEl.setAttribute('scale', '0.85 0.85 0.85');
    this.el.appendChild(this.textEl);

    this.logLines = [];
    const self = this;

    function updateVRConsole() {
      self.textEl.setAttribute('value', self.logLines.join('\n'));
    }

    function pushLine(type, ...args) {
      const msg = args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
      self.logLines.push(`[${type}] ${msg}`);
      if (self.logLines.length > self.data.maxLines) self.logLines.shift();
      updateVRConsole();
    }

    // Patch console methods only once
    if (!console._vrConsolePatched) {
      const orig = {
        log: console.log,
        warn: console.warn,
        error: console.error
      };
      console.log = function(...args) {
        orig.log.apply(console, args);
        pushLine('log', ...args);
      };
      console.warn = function(...args) {
        orig.warn.apply(console, args);
        pushLine('warn', ...args);
      };
      console.error = function(...args) {
        orig.error.apply(console, args);
        pushLine('error', ...args);
      };
      console._vrConsolePatched = true;
      console.log('VR Console Ready');
    }

    // Listen for X/A button presses to toggle visibility
    this.toggleHandler = (evt) => {
      // evt.detail is a GamepadEvent
      // evt.detail.pressed is true when pressed
      // evt.detail.id is the button index
      // X (button 3) on left, A (button 4) on right (Oculus Touch)
      // We'll toggle on either
      if (evt.detail && evt.detail.pressed && (evt.detail.id === 3 || evt.detail.id === 4)) {
        const vrConsole = document.getElementById('vr-console');
        if (vrConsole) {
          vrConsole.setAttribute('visible', !(vrConsole.getAttribute('visible') === true || vrConsole.getAttribute('visible') === 'true'));
        }
      }
    };
    this.el.sceneEl.addEventListener('abuttondown', this.toggleHandler);
    this.el.sceneEl.addEventListener('xbuttondown', this.toggleHandler);

    // Listen for 'p' key to toggle visibility
    this.keyHandler = (evt) => {
      if (evt.key === 'p' || evt.key === 'P') {
        const vrConsole = document.getElementById('vr-console');
        if (vrConsole) {
          vrConsole.setAttribute('visible', !(vrConsole.getAttribute('visible') === true || vrConsole.getAttribute('visible') === 'true'));
        }
      }
    };
    window.addEventListener('keydown', this.keyHandler);
  },
  remove: function () {
    this.el.sceneEl.removeEventListener('abuttondown', this.toggleHandler);
    this.el.sceneEl.removeEventListener('xbuttondown', this.toggleHandler);
    window.removeEventListener('keydown', this.keyHandler);
  }
}); 