import { registerShader } from "aframe";

AFRAME.registerShader('dynamic-circuit', {
    schema: {
        timeMsec: {type: 'time', is: 'uniform'},
        src: {type: 'map', is: 'uniform'},
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
        uniform float timeMsec;
        uniform sampler2D src;
        varying vec2 vUv;

        // Perlin noise function
        float perlinNoise(vec2 p){
            vec2 i = floor(p);
            vec2 f = fract(p);
            f = f*f*(3.0-2.0*f);
        
            float n = dot(i, vec2(37.0, 17.0)) + 41.0;
            vec2 v0 = vec2(fract(sin(n) * 43758.5453),
                           fract(cos(n) * 43758.5453));
            n += 1.0;
            vec2 v1 = vec2(fract(sin(n) * 43758.5453),
                           fract(cos(n) * 43758.5453));
            n += 37.0;
            vec2 v2 = vec2(fract(sin(n) * 43758.5453),
                           fract(cos(n) * 43758.5453));
            n += 17.0;
            vec2 v3 = vec2(fract(sin(n) * 43758.5453),
                           fract(cos(n) * 43758.5453));
        
            return mix(mix(dot(v0, f), dot(v1, vec2(1.0-f.x, f.y)), f.x),
                       mix(dot(v2, vec2(f.x, 1.0-f.y)), dot(v3, vec2(1.0-f.x, 1.0-f.y)), f.x), f.y);
        }
        

        void main() {
            float repeatFactor = 5.0;
            float time = timeMsec * 0.001;

            vec2 repeatUv = mod(vUv * 100.0 / repeatFactor, 1.0);

            vec4 texColor = texture2D(src, repeatUv);
            
            // Define teal and amber colors
            vec3 tealColor = vec3(0.0, 0.501, 0.501);
            vec3 amberColor = vec3(1.0, 0.749, 0.0);
            // Define hot pink and neon blue colors
            vec3 hotPinkColor = vec3(1.0, 0.0, 0.5);
            vec3 neonBlueColor = vec3(0.0, 0.5, 1.0);
        
            // Use Perlin noise to create a dynamic pattern
            float noiseValue = perlinNoise(vUv * 25.0 + time); // Scale UVs and shift by time
        
            // Combine Perlin noise with other patterns
            float pattern1 = sin(vUv.x * 50.0 + time) * cos(vUv.y * 12.9 + time);
            float pattern2 = sin(vUv.x * 15.5 + vUv.y * 15.0 - time);
            float angularPattern = step(0.5, abs(sin(vUv.x + time)) * abs(cos(vUv.y + time)));
            float combinedPattern = pattern1 * pattern2 * noiseValue * 5.0; // Incorporate noise

        
            // Apply the moving pattern to the lighting effect
            float lightEffect = smoothstep(-0.3, 0.3, combinedPattern); // Softer edges
            //vec3 dynamicColor = mix(tealColor, amberColor, lightEffect);
            vec3 dynamicColor = mix(hotPinkColor, neonBlueColor, lightEffect);
        
            // Apply the lighting effect to the circuit lines
            if (texColor.r > 0.3 && lightEffect < 0.45) {
                gl_FragColor = vec4(dynamicColor * texColor.rgb, 1.0);
            } else {
                gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); // Keep other areas black
            }
        }
        
    `
});
