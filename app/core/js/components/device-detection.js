// Global namespace for device information
window.DeviceInfo = {
    device: 'unknown',
    model: 'unknown',
    browser: 'unknown',
    os: 'unknown',
    bestGuess: 'unknown',
    completeUA: 'unknown',
    presentationOptions: [],
	random: '---',
	jsnavigator:'---',
    isMobile: function() { return AFRAME.utils.device.isMobile(); },
    isTablet: function() { return AFRAME.utils.device.isTablet(); },
    isMobileVR: function() { return AFRAME.utils.device.isMobileVR(); },
    isHeadsetConnected: function() { return AFRAME.utils.device.checkHeadsetConnected(); }
};

// Presentation Options Component
AFRAME.registerComponent('presentation-options', {
    schema: {
        options: {type: 'array', default: []}
    },
    init: function() {
        // Add each option as a component to the scene and class to body
        this.data.options.forEach(option => {
            this.el.setAttribute(option, 'enabled: true');
            document.body.classList.add(option);
            console.log(`Added presentation option: ${option}`);
        });
    }
});

// Device Detection Component
AFRAME.registerComponent('device-detection', {
    init: function() {
        if (typeof UAParser === 'undefined') {
            console.error('UAParser is not loaded!');
            return;
        }

        this.uaParser = new UAParser();
        this.updateDeviceInfo();
        this.setupKeyHandler();
        this.setupInfoButton();
    },

    setupInfoButton: function() {
        // Create info button
        this.infoButton = document.createElement('button');
        this.infoButton.innerHTML = 'Device Info';
        this.infoButton.style.position = 'fixed';
        this.infoButton.style.bottom = '20px';
        this.infoButton.style.left = '20px';
        this.infoButton.style.zIndex = '999';
        this.infoButton.style.padding = '10px 20px';
        this.infoButton.style.background = 'rgba(0, 0, 0, 0.5)';
        this.infoButton.style.color = 'white';
        this.infoButton.style.border = 'none';
        this.infoButton.style.borderRadius = '5px';
        this.infoButton.style.cursor = 'pointer';
        this.infoButton.style.fontFamily = 'Arial, sans-serif';
        this.infoButton.style.fontSize = '14px';
        this.infoButton.style.transition = 'background 0.3s ease';

        // Add hover effect
        this.infoButton.onmouseover = () => {
            this.infoButton.style.background = 'rgba(0, 0, 0, 0.7)';
        };
        this.infoButton.onmouseout = () => {
            this.infoButton.style.background = 'rgba(0, 0, 0, 0.5)';
        };

        // Add click handler
        this.infoButton.onclick = () => this.showDeviceInfoDialog();

        // Add to document
        document.body.appendChild(this.infoButton);
    },

    setupKeyHandler: function() {
        // Create dialog element
        this.dialog = document.createElement('dialog');
        this.dialog.style.padding = '20px';
        this.dialog.style.borderRadius = '8px';
        this.dialog.style.border = '1px solid #ccc';
        this.dialog.style.maxWidth = '80%';
        this.dialog.style.maxHeight = '80%';
        this.dialog.style.overflow = 'auto';
        document.body.appendChild(this.dialog);

        // Add close button
        const closeButton = document.createElement('button');
        closeButton.innerHTML = 'Close';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.style.padding = '5px 10px';
        closeButton.style.background = 'rgba(0, 0, 0, 0.5)';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '3px';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = () => this.dialog.close();
        this.dialog.appendChild(closeButton);

        // Add keypress handler
        document.addEventListener('keydown', (event) => {
            if (event.key.toLowerCase() === 'l') {
                this.showDeviceInfoDialog();
            }
        });
    },

    showDeviceInfoDialog: function() {
        // Create formatted content
        const content = document.createElement('pre');
        content.style.margin = '0';
        content.style.padding = '20px';
        content.style.fontFamily = 'monospace';
        content.style.whiteSpace = 'pre-wrap';
        content.style.wordBreak = 'break-word';
        content.textContent = JSON.stringify(DeviceInfo, null, 2);

        // Clear previous content and add new content
        while (this.dialog.children.length > 1) {
            this.dialog.removeChild(this.dialog.lastChild);
        }
        this.dialog.appendChild(content);

        // Show dialog
        this.dialog.showModal();
    },
    
    updateDeviceInfo: function() {
        // Get browser info
        function getBrowserInfo(uaData) {         
            const { name, version} = uaData;
            return `${name}|v:${version}`;
        }
        // Get device info
        function getDeviceInfo(uaData) {         
            const { type, vendor} = uaData;
            return `${type || 'unknown'}|${vendor || 'unknown'}`;
        }
        // Get model info
        function getModelInfo(uaData) {         
            const { model} = uaData;
            return `${model || 'unknown'}`;
        }
        // Get os info
        function getOSInfo(uaData) {         
            const { name, version} = uaData;
            return `${name || 'unknown'}|v:${version || 'unknown'}`;
        }

        // Get best guess with proper context
        const getBestGuess = (uaData) => {         
            let device = uaData.device.split('|')[0];
            let vendor = uaData.device.split('|')[1];
            let model = uaData.model;

            DeviceInfo.presentationOptions = ['browser-mode'];
            console.log("getBestGuess > os: ",uaData.os);
            
            if (device === 'mobile' || device === 'tablet') {
                DeviceInfo.presentationOptions.push('ar-mode');
            }
            else if (device === 'xr') {
                DeviceInfo.presentationOptions.push('vr-mode');
            }
            else if (!device || device === 'unknown') {
                device = 'desktop-laptop';
                if (model === 'unknown') {
                    switch (uaData.os.split('|')[0]) {
                        case 'Windows':
                            model = 'PC';
                            break;
                        case 'Macintosh':
                            model = 'Mac';
                            break;
                        case 'Linux':
                            model = 'Linux';
                            break;
                        default:
                            model = 'unknown';
                            break;
                    }
                }
                DeviceInfo.device = device+'|'+vendor;
            }

            return `Device: ${device}|Model: ${model}|OS: ${uaData.os}|Vendor: ${vendor}|Browser: ${uaData.browser}`;
        };

        // Update global device info
        DeviceInfo.device = getDeviceInfo(this.uaParser.getDevice());  
        DeviceInfo.model = getModelInfo(this.uaParser.getDevice()); 
        DeviceInfo.browser = getBrowserInfo(this.uaParser.getBrowser());
        DeviceInfo.os = getOSInfo(this.uaParser.getOS());
        DeviceInfo.bestGuess = getBestGuess(DeviceInfo);
        DeviceInfo.completeUA = this.uaParser.getResult();
		DeviceInfo.random = `isMobile(): ${DeviceInfo.isMobile()} | isTablet(): ${DeviceInfo.isTablet()} | isMobileVR(): ${DeviceInfo.isMobileVR()} | isHeadsetConnected(): ${DeviceInfo.isHeadsetConnected()}`;
		DeviceInfo.jsnavigator = `navigator.appName(): ${navigator.appName} | navigator.appVersion(): ${navigator.appVersion} | navigator.appCodeName(): ${navigator.appCodeName} | navigator.platform(): ${navigator.platform}`;
        // Update scene with detected modes
        this.updateScene();        
    },

    updateScene: function() {
        const textEntity = document.querySelector('#device-info-text');
        if (textEntity) {
            let infoText = JSON.stringify(DeviceInfo, null, 2);
            textEntity.setAttribute('text', {
                value: infoText,
                align: 'left',
                color: '#FFFFFF'
            });
            console.log("updateScene > infoText",infoText);
        }

        // Initialize presentation options component with detected modes
        this.el.sceneEl.setAttribute('presentation-options', {
            options: DeviceInfo.presentationOptions
        });

        // Enable appropriate modes based on device capabilities
        if (DeviceInfo.presentationOptions.includes('browser-mode')) {
            this.el.sceneEl.setAttribute('browser-mode', 'enabled: true');
        }
        if (DeviceInfo.presentationOptions.includes('vr-mode')) {
            this.el.sceneEl.setAttribute('vr-mode', 'enabled: true');
        }
        if (DeviceInfo.presentationOptions.includes('ar-mode')) {
            this.el.sceneEl.setAttribute('ar-mode', 'enabled: true');
        }
    }
}); 
