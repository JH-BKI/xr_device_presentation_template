# A-Frame VR/Desktop Demo

This is a simple A-Frame project that works in both desktop browsers and VR headsets. It demonstrates basic 3D interactions and movement controls for both platforms.

## Features

- Interactive 3D objects that change color when clicked/tapped
- Movement controls for both desktop and VR
- Forest environment with proper lighting
- Responsive design that works on both desktop and VR

## How to Run

1. Clone this repository
2. Open `index.html` in a web browser
   - For local development, you can use a simple HTTP server:
     - Python: `python -m http.server`
     - Node.js: `npx serve`
     - VS Code: Use the "Live Server" extension

## Controls

### Desktop
- WASD keys to move around
- Mouse to look around
- Click on objects to change their color

### VR
- Use VR controllers to move around
- Point and click with controllers to interact with objects
- Objects will change color when clicked

## Technologies Used

- [A-Frame](https://aframe.io/) - Web framework for building VR experiences
- [A-Frame Extras](https://github.com/n5ro/aframe-extras) - Additional components for A-Frame
- [A-Frame Environment Component](https://github.com/supermedium/aframe-environment-component) - Environment presets for A-Frame

## Browser Support

This demo works best in modern browsers that support WebVR/WebXR:
- Chrome
- Firefox
- Edge
- Oculus Browser
- Samsung Internet

## VR Headset Support

The demo should work with any WebXR-compatible VR headset:
- Oculus Quest
- Oculus Rift
- HTC Vive
- Windows Mixed Reality
- Valve Index 