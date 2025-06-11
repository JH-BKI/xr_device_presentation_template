// Browser Mode Component
AFRAME.registerComponent('browser-mode', {
    schema: {
        enabled: {type: 'boolean', default: true}
    },
    init: function() {
        this.onEnabled = this.onEnabled.bind(this);
        this.onDisabled = this.onDisabled.bind(this);
        
        // Initial setup
        if (this.data.enabled) {
            this.onEnabled();
        }
    },
    update: function(oldData) {
        if (oldData.enabled !== this.data.enabled) {
            if (this.data.enabled) {
                this.onEnabled();
            } else {
                this.onDisabled();
            }
        }
    },
    onEnabled: function() {
        // Enable browser-specific features
        this.el.setAttribute('cursor', 'rayOrigin: mouse');
        this.el.setAttribute('wasd-controls', '');
        this.el.setAttribute('look-controls', '');
        console.log('Browser mode enabled');
    },
    onDisabled: function() {
        // Disable browser-specific features
        this.el.removeAttribute('cursor');
        this.el.removeAttribute('wasd-controls');
        this.el.removeAttribute('look-controls');
        console.log('Browser mode disabled');
    }
}); 