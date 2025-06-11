// AR Mode Component
AFRAME.registerComponent('ar-mode', {
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
        // Enable AR-specific features
        this.el.setAttribute('ar-mode', '');
        this.el.setAttribute('ar-hit-test', '');
        
        // Setup AR-specific UI
        const arButton = document.createElement('button');
        arButton.id = 'ar-button';
        arButton.innerHTML = 'Start AR';
        arButton.style.position = 'fixed';
        arButton.style.bottom = '20px';
        arButton.style.left = '20px';
        arButton.style.zIndex = '999';
        document.body.appendChild(arButton);
        
        console.log('AR mode enabled');
    },
    onDisabled: function() {
        // Disable AR-specific features
        this.el.removeAttribute('ar-mode');
        this.el.removeAttribute('ar-hit-test');
        
        // Remove AR-specific UI
        const arButton = document.getElementById('ar-button');
        if (arButton) {
            arButton.remove();
        }
        
        console.log('AR mode disabled');
    }
}); 