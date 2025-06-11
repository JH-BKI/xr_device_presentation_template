// Global namespace for device information
window.DeviceInfo = {
    device: 'unknown',
    model: 'unknown',
    browser: 'unknown',
    os: 'unknown',
    bestGuess: 'unknown',
    completeUA: 'unknown',
    presentationOptions: [],
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

        console.log("isMobile: ", DeviceInfo.isMobile()); 
        console.log("isTablet: ", DeviceInfo.isTablet());
        console.log("isMobileVR: ", DeviceInfo.isMobileVR());
        console.log("checkHeadsetConnected: ", DeviceInfo.isHeadsetConnected());

        // Update scene with detected modes
        this.updateScene();        
    },

    updateScene: function() {
        const textEntity = document.querySelector('#device-info-text');
        if (textEntity) {
            let infoText = JSON.stringify(DeviceInfo, null, 2);
            textEntity.setAttribute('text', {
                value: infoText,
                align: 'center',
                width: 2,
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