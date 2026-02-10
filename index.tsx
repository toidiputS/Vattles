import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      meshStandardMaterial: any;
      meshBasicMaterial: any;
      boxGeometry: any;
      planeGeometry: any;
      cylinderGeometry: any;
      coneGeometry: any;
      sphereGeometry: any;
      circleGeometry: any;
      ringGeometry: any;
      torusGeometry: any;
      ambientLight: any;
      pointLight: any;
      hemisphereLight: any;
      fog: any;
      color: any;
      gridHelper: any;
    }
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);