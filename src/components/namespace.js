import { registerComponent } from 'aframe';

registerComponent('namespace', {
    schema: {
        data: { type: 'string' } // Pass namespace data as a string
    },

    init: function() {
        const namespaceData = JSON.parse(this.data.data); // Parse the passed data
        this.render(namespaceData);
    },
    truncateString: function(str, maxLength) {
        return str.length > maxLength ? str.slice(0, maxLength) : str;
    },
    render: function(namespaceData) {
        // Assuming namespaceData contains properties like `namespace`, `index`, etc.
        this.el.setAttribute('geometry', 'primitive: box; width: 1; height: 2s');
        this.el.setAttribute('material', `color: #FFF; emissive: ${namespaceData.reserved ? `#F00` : `#0F0`}; roughness: 0.1; src: #textured-glass-texture; transparent: true; opacity: 0.9`);
        this.el.setAttribute('scale', '2 2 2');
        this.el.setAttribute('position', `${namespaceData.index * 3} 3 0`);
        this.el.setAttribute('animation', `property: position; to: ${namespaceData.index * 3} 3.2 0; dir: alternate; dur: ${1000 + (namespaceData.index * 100)}; easing: easeInOutSine; loop: true`);
    
        // Create a text entity
        const namespaceText = document.createElement('a-entity');
        namespaceText.setAttribute('text', `value: ${namespaceData.namespace}; color: #FFF; align: center; width: 2.5; font: monoid`);
        namespaceText.setAttribute('position', `0 .6 0.5`); 
        this.el.appendChild(namespaceText);

        const reservedText = document.createElement('a-entity');
        reservedText.setAttribute('text', `value: ${namespaceData.reserved ? `Reserved\n${this.truncateString(namespaceData.requester, 19)}`: "Available"}; color: #FFF; align: center; width: 2.5; font: monoid`);
        reservedText.setAttribute('position', `0 0.3 0.5`); 
        this.el.appendChild(reservedText);

        const poolText = document.createElement('a-entity');
        poolText.setAttribute('text', `value: ${namespaceData.pool_type}; color: #FFF; align: center; width: 2.5; font: monoid`);
        poolText.setAttribute('position', `0 0 0.5`); 
        this.el.appendChild(poolText);
    }
});