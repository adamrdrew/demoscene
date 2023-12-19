import { registerShader} from "aframe";

registerShader('grid', {
    schema: {
        color: {type: 'vec3', default: '0.2 0 0.2', is: 'uniform'},
        lineWidth: {type: 'number', default: 0.02, is: 'uniform'},
        gridSize: {type: 'vec2', default: { x: 100, y: 100 }, is: 'uniform'},
        time: {type: 'time', is: 'uniform'}
    },

    vertexShader: `
        varying vec2 vUv;

        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,

    fragmentShader: `
    precision mediump float;
    uniform vec3 color;
    uniform float lineWidth;
    uniform vec2 gridSize;
    uniform float time;
    varying vec2 vUv;
    
    void main() {
        // Normalize UV coordinates to grid size
        vec2 gridUV = fract(vUv * gridSize);
    
        // Calculate grid lines
        vec2 grid = smoothstep(lineWidth, lineWidth + 0.01, gridUV) *
                    smoothstep(lineWidth, lineWidth + 0.01, vec2(1.0) - gridUV);
    
        
        float outAlpha = 1.0;
        vec3 outColor = color;

        // If not on the line, discard the fragment
        if (grid.x * grid.y != 0.0) {
            discard;
        }
    
        // Strobe effect based on time
        float strobe = max(0.9, sin(time * 0.0005) * 0.5 + 0.5);
    
        // Calculate distance to the nearest grid line
        float distanceToLine = min(gridUV.x, gridUV.y);
        float glow = smoothstep(0.0, lineWidth * 0.8, distanceToLine);
        
        // Combine strobe and glow effects
        gl_FragColor = vec4(outColor, outAlpha);
    }
    
    `
});