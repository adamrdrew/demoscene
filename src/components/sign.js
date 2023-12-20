import { registerComponent } from "aframe";

registerComponent('sign', {
    schema: {
        text: { type: 'string', default: 'Hello World' },
        color: { type: 'string', default: '#08F' },
    },
    init: function () {
        this.render();
    },
    remove: function () {
        this.clearEntities();
    },
    clearEntities: function () {
        // Clear existing text entities to prevent duplication
        while (this.el.firstChild) {
            this.el.removeChild(this.el.firstChild);
        }
    },
    createPointLight: function(color, intensity, distance, position) {
        const light = document.createElement('a-light');
        light.setAttribute('type', 'point');
        light.setAttribute('color', color);
        light.setAttribute('intensity', intensity);
        light.setAttribute('distance', distance);
        light.setAttribute('position', position);
        return light;
    },
    render: function () {
        this.clearEntities();

        // Create Neon Sign (Text or Shape)
        const neonText = document.createElement('a-text');
        neonText.setAttribute('value', this.data.text);
        neonText.setAttribute('color', this.data.color);
        neonText.setAttribute('emissive', this.data.color);
        neonText.setAttribute('position', '0 0 0');
        neonText.setAttribute('width', '10');
        neonText.setAttribute('align', 'center');
        neonText.setAttribute('font', 'monoid');
        this.el.appendChild(neonText);

        // Add Lights for Glow Effect
        this.el.appendChild(this.createPointLight(this.data.color, 1, 5, '0.5 0 0.5'));
        this.el.appendChild(this.createPointLight(this.data.color, 1, 5, '-0.5 0 0.5'));
        this.el.appendChild(this.createPointLight(this.data.color, 1, 5, '1 0 0.5'));
        this.el.appendChild(this.createPointLight(this.data.color, 1, 5, '-1 0 0.5'));
        this.el.appendChild(this.createPointLight(this.data.color, 1, 5, '1.5 0 0.5'));
        this.el.appendChild(this.createPointLight(this.data.color, 1, 5, '-1.5 0 0.5'));
        this.el.appendChild(this.createPointLight(this.data.color, 1, 5, '2 0 0.5'));
        this.el.appendChild(this.createPointLight(this.data.color, 1, 5, '-2 0 0.5'));

        // Add Background Plane (Optional)
        const backgroundPlane = document.createElement('a-plane');
        backgroundPlane.setAttribute('color', '#666');
        backgroundPlane.setAttribute('height', '2');
        backgroundPlane.setAttribute('width', '8');
        backgroundPlane.setAttribute('position', '0 0 -0.1');
        this.el.appendChild(backgroundPlane);
      

    }
});