import { registerComponent } from "aframe";

registerComponent('object-field', {
    schema: {
        minDistance: { type: 'number', default: 300 }, 
        maxDistance: { type: 'number', default: 400 },
        minWidth: { type: 'number', default: 10 },
        minHeight: { type: 'number', default: 30 },
        maxHeight: { type: 'number', default: 90 },
        maxWidth: { type: 'number', default: 30 },
        count: { type: 'number', default: 100 },
    },
    init: function() {
        for (let i = 0; i < this.data.count; i++) {
            const entity = document.createElement('a-box');
            const width = this.data.minWidth + (Math.random() * (this.data.maxWidth - this.data.minWidth));
            const height = this.data.minHeight + (Math.random() * (this.data.maxHeight - this.data.minHeight));
            const x = (Math.random() * (2 * this.data.maxDistance)) - this.data.maxDistance;
            const y = Math.random() * this.data.maxDistance; // Always above 0 (floor level)
            const z = (Math.random() * (2 * this.data.maxDistance)) - this.data.maxDistance;

            entity.setAttribute('position', `${x} ${y} ${z}`);
            entity.setAttribute('geometry', `primitive: box; width: ${width}; height: ${height}; depth: ${width}`);
            const textureId = (i % 2 === 0) ? 'frosted-box-texture-1' : 'frosted-box-texture-2';
            entity.setAttribute('material', `color: white; roughness: 0.5; src: #${textureId}`);
            entity.setAttribute('animation', `property: position; to: ${x} ${y+2.2} ${z}; dir: alternate; dur: ${1000+i*10}; easing: easeInOutSine; loop: true`);

            this.el.appendChild(entity);
        }
    }
});
