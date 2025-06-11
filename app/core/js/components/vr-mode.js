// VR Mode Component
AFRAME.registerComponent('vr-mode', {
    schema: {
        enabled: {type: 'boolean', default: false}
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
        // Enable VR-specific features
        this.el.setAttribute('xr-mode-ui', 'enabled: true');
        
        // Setup VR controllers if they exist
        const leftHand = this.el.querySelector('#hand-left');
        const rightHand = this.el.querySelector('#hand-right');
        
        if (leftHand) {
            leftHand.setAttribute('oculus-touch-controls', 'hand: left');
            leftHand.setAttribute('laser-controls', 'hand: left');
        }
        
        if (rightHand) {
            rightHand.setAttribute('oculus-touch-controls', 'hand: right');
            rightHand.setAttribute('laser-controls', 'hand: right');
        }
        
        console.log('VR mode enabled');
    },
    onDisabled: function() {
        // Disable VR-specific features
        this.el.setAttribute('xr-mode-ui', 'enabled: false');
        
        // Remove VR controller components
        const leftHand = this.el.querySelector('#hand-left');
        const rightHand = this.el.querySelector('#hand-right');
        
        if (leftHand) {
            leftHand.removeAttribute('oculus-touch-controls');
            leftHand.removeAttribute('laser-controls');
        }
        
        if (rightHand) {
            rightHand.removeAttribute('oculus-touch-controls');
            rightHand.removeAttribute('laser-controls');
        }
        
        console.log('VR mode disabled');
    }
}); 