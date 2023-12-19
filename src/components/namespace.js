import { registerComponent } from 'aframe';

registerComponent('namespace', {
    schema: {
        data: { type: 'string' } // Pass namespace data as a string
    },

    init: function() {
        const namespaceData = JSON.parse(this.data.data); // Parse the passed data
        this.render(namespaceData);
    },

    render: function(namespaceData) {
        // Assuming namespaceData contains properties like `namespace`, `index`, etc.
        this.el.setAttribute('geometry', 'primitive: box; width: 1');
        this.el.setAttribute('material', 'color: white; roughness: 0.5; src: #box-texture');
        this.el.setAttribute('scale', '2 2 2');
        this.el.setAttribute('position', `${namespaceData.index * 3} 0 0`);
        this.el.setAttribute('animation', `property: position; to: ${namespaceData.index * 3} 0.2 0; dir: alternate; dur: ${1000 + (namespaceData.index * 100)}; easing: easeInOutSine; loop: true`);
    
        // Create a text entity
        const textEntity = document.createElement('a-entity');
        textEntity.setAttribute('text', `value: ${namespaceData.namespace}; color: #FFF; align: center; width: 2.5`);
        textEntity.setAttribute('position', `0 0 0.5`); // Position the text above the box

        // Append the text entity to the namespace entity
        this.el.appendChild(textEntity);
    }
});