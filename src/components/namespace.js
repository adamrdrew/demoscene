import { registerComponent } from 'aframe';
import { stateManager } from "../stateManager/stateManager";

registerComponent('namespace', {
    schema: {
        data: { type: 'string' }, // Pass namespace data as a string
        isWaiting: { type: 'boolean', default: false },
        pointerHover: { type: 'boolean', default: false },
    },
    getColor: function() {
        // Gray if waiting
        if ( this.data.isWaiting === true ) {
            return "#AAA";
        }
        // Yellow if hovered
        if ( this.data.pointerHover === true ) {
            return "#FF0";
        }
        // Blue if reserved by you
        if ( this.namespaceData.reserved && this.namespaceData.requester === stateManager.state.username ) {
            return "#00F";
        }
        // Red if reserved by someone else
        if ( this.namespaceData.reserved && this.namespaceData.requester !== stateManager.state.username ) {
            return "#F00";
        }
        // Green if available
        return "#0F0";
    },
    events: {
        click: function(evt) {
            // if its not reserved bail
            if ( !this.namespaceData.reserved) {
                return
            }
            // if its reserved by someone else bail
            if ( this.namespaceData.requester !== stateManager.state.username ) {
                return;
            }
            // if We're already waiting bail
            if ( this.data.isWaiting === true ) {
                return;
            }
            this.el.setAttribute('namespace',"isWaiting", true);
            this.render();
            if (this.namespaceData.reserved && this.namespaceData.requester === stateManager.state.username) {
                this.releaseNamespace();
                return;
            }
        },
        mouseenter: function(evt) {
            this.el.setAttribute('namespace', 'pointerHover', true);
            this.render(JSON.parse(this.data.data));
        },
        mouseleave: function(evt) {
            this.el.setAttribute('namespace', 'pointerHover', false);
            this.render(JSON.parse(this.data.data));
        },
        namespaceReleased: function(evt) {
            if ( this.namespaceData.namespace === evt.detail ) {
                this.el.setAttribute('namespace', 'isWaiting', false);
                this.stateManager.fetchNamespaces();
                this.render();
            }
        }
    },
    init: function() {
        this.namespaceData = JSON.parse(this.data.data); // Parse the passed data
        this.render();
    },
    releaseNamespace: function() {


    },
    reserveNamespace: function() {

    },
    truncateString: function(str, maxLength) {
        return str.length > maxLength ? str.slice(0, maxLength) : str;
    },
    render: function() {
        // Clear existing text entities to prevent duplication
        while (this.el.firstChild) {
            this.el.removeChild(this.el.firstChild);
        }

        const namespaceBox = document.createElement('a-entity');
        // Assuming namespaceData contains properties like `namespace`, `index`, etc.
        namespaceBox.setAttribute('id', this.namespaceData.namespace);
        namespaceBox.setAttribute(`click-handler`);
        namespaceBox.setAttribute('class', 'clickable');
        namespaceBox.setAttribute('geometry', 'primitive: box; width: 1; height: 2s');
        namespaceBox.setAttribute('material', `color: #FFF; emissive: ${this.getColor()}; roughness: 0.1; src: #textured-glass-texture; transparent: true; opacity: 0.9`);
        namespaceBox.setAttribute('scale', '2 2 2');
        namespaceBox.setAttribute('position', `0 3 0`);
        namespaceBox.setAttribute('animation', `property: position; to: 0 3.2 0; dir: alternate; dur: ${1000 + (this.namespaceData.index * 100)}; easing: easeInOutSine; loop: true`);
        this.el.appendChild(namespaceBox);
        // Create a text entity
        const namespaceText = document.createElement('a-entity');
        namespaceText.setAttribute('id', `${this.namespaceData.namespace}-text`);
        namespaceText.setAttribute('text', `value: ${this.namespaceData.namespace}; color: #FFF; align: center; width: 2.5; font: monoid`);
        namespaceText.setAttribute('position', `0 0 0.6`); 
        namespaceBox.appendChild(namespaceText);

        const reservedText = document.createElement('a-entity');
        reservedText.setAttribute('text', `value: ${this.namespaceData.reserved ? `Reserved\n${this.truncateString(this.namespaceData.requester, 19)}`: "Available"}; color: #FFF; align: center; width: 2.5; font: monoid`);
        reservedText.setAttribute('position', `0 0.3 0.6`); 
        namespaceBox.appendChild(reservedText);

        const poolText = document.createElement('a-entity');
        poolText.setAttribute('text', `value: ${this.namespaceData.pool_type}; color: #FFF; align: center; width: 2.5; font: monoid`);
        poolText.setAttribute('position', `0 0.6 0.6`); 
        namespaceBox.appendChild(poolText);

        if ( this.data.isWaiting === false) {
            return
        }
        const fetchBox = document.createElement('a-entity');
        fetchBox.setAttribute('release-box', `title: Releasing...`);
        fetchBox.setAttribute('position', `0 0.9 0.5w`); 
        namespaceBox.appendChild(fetchBox);
    }
});