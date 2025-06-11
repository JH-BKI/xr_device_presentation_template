AFRAME.registerComponent('device-detection', {

    init: function() {
        if (typeof UAParser === 'undefined') {
            console.error('UAParser is not loaded!');
            return;
        }

        this.deviceInfo = {
            type: 'unknown',
            model: 'unknown',
            os: 'unknown',
            presentationOptions: []
        };
        this.xrTested = { vr: false, ar: false };
        this.uaParser = new UAParser();
        this.updateDeviceInfo();
        this.updateScene();        
    },

    getDeviceType: function() {

        let overriddenType;
        const device = this.uaParser.getDevice();
        console.log("getDeviceType > device: ",device);
        const ua = this.uaParser.getUA();
        console.log("getDeviceType > ua: ",ua);


        // device.type can be 'mobile', 'tablet', 'smarttv', 'wearable', 'embedded', or undefined (desktop)
        if (device.type === 'mobile') return 'mobile';
        if (device.type === 'tablet') return 'tablet';
        if (device.type === 'smarttv' || device.type === 'wearable' || device.type === 'embedded') return device.type;
        // Headset detection: check for known VR/AR brands/models in device/vendor/model/ua
        if (/OculusBrowser|Quest|Pico|Vive|Valve|Windows MR/i.test(ua)) return 'headset';
        return 'desktop';
    },

    updateDeviceInfo: function() {
        // Use UAParser for device and OS
        const device = this.uaParser.getDevice();
        const os = this.uaParser.getOS();
        this.deviceInfo.type = this.getDeviceType();
        this.deviceInfo.os = os.name || 'unknown';
        // Reset presentation options
        this.deviceInfo.presentationOptions = ['fullscreen-support'];
        // // Browser-level XR support
        // if (navigator.xr && navigator.xr.isSessionSupported) {
        //     navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
        //         if (supported && !this.deviceInfo.presentationOptions.includes('vr')) {
        //             this.deviceInfo.presentationOptions.push('vr');
        //             this.updateScene();
        //         }
        //     });
        //     navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
        //         if (supported && !this.deviceInfo.presentationOptions.includes('ar')) {
        //             this.deviceInfo.presentationOptions.push('ar');
        //             this.updateScene();
        //         }
        //     });
        // }


        switch(this.deviceInfo.type){
            case 'mobile':
                this.deviceInfo.presentationOptions.push('ar-support');
                break;
            case 'tablet':
                this.deviceInfo.presentationOptions.push('ar-support');
                break;  
            case 'headset':
                this.deviceInfo.presentationOptions.push('vr-support');
                break;
            default:
                break;
        }
        // Update body class
        document.body.className = `${this.deviceInfo.type} ${this.deviceInfo.os} ${this.deviceInfo.presentationOptions.join(' ')}`;
    },

    updateScene: function() {
        const textEntity = document.querySelector('#device-info-text');
        if (textEntity) {
            // let infoText = `Device: ${this.deviceInfo.type}\nModel: ${this.deviceInfo.model}\nOS: ${this.deviceInfo.os}\nOptions: ${this.deviceInfo.presentationOptions.join(', ')}`;
            let infoText = JSON.stringify(this.uaParser.getResult(), null, 2);
            textEntity.setAttribute('text', {
                value: infoText,
                align: 'center',
                width: 2,
                color: '#FFFFFF'
            });
            console.log("updateScene > infoText",infoText);
        }
    }
}); 