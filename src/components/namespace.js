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
            this.el.setAttribute('namespace',{isWaiting: true});
            this.render();
            this.releaseNamespace();
            return;
        },
        mouseenter: function(evt) {
            this.mouseOver = true;
            this.el.setAttribute('namespace', 'pointerHover', true);
            this.render(JSON.parse(this.data.data));
        },
        mouseleave: function(evt) {
            this.mouseOver = false;
            this.el.setAttribute('namespace', 'pointerHover', false);
            this.render(JSON.parse(this.data.data));
        },

    },
    init: function() {
        this.description = ""
        this.mouseOver = false;
        this.showDescription = false;
        this.falling = false;
        this.namespaceData = JSON.parse(this.data.data); // Parse the passed data
        stateManager.addEventListener('namespaceReleased', (event) => {
            this.namespaceReleased(event)
        });
        stateManager.addEventListener('descriptionFetched', (event) => {
            if ( this.namespaceData.namespace !== event.detail.namespace ) {
                return;
            }
            console.log("descriptionFetched", event.detail.message);
            this.description = event.detail.message;
            this.showDescription = true;
            this.render();
        })
        // Listen at the scene level for the A button to be pressed
        // This is a workaround for the fact that button events are weird
        this.el.sceneEl.addEventListener('abuttondown', (evt) => {
            if ( this.mouseOver === false ) {
                return;
            }
            this.showDescription = !this.showDescription;
            if ( this.showDescription === true ) {
                stateManager.fetchDescription(this.namespaceData.namespace);
            }
            if ( this.showDescription === false ) {
                this.render();
            }
        });

        this.render();
    },
    releaseNamespace: function() {
        stateManager.releaseNamespace(this.namespaceData.namespace);

    },
    namespaceReleased: function(evt) {
        if ( this.namespaceData.namespace === evt.detail ) {
            //set time out
            setTimeout(() => {
                stateManager.fetchNamespaces();
            }, 1000);

            this.falling = true;
            this.el.setAttribute('namespace', {isWaiting: true});
            this.render();
        }
    },
    reserveNamespace: function() {

    },
    truncateString: function(str, maxLength) {
        // If either str or maxlength are null or undefined, don't do anything
        if(!str || !maxLength) return str;
        return str.length > maxLength ? str.slice(0, maxLength) : str;
    },
    render: function() {
        // Clear existing text entities to prevent duplication
        while (this.el.firstChild) {
            this.el.removeChild(this.el.firstChild);
        }

        if ( this.showDescription === true ) {
            // Create a panel above the namespace to display the description
            const descriptionPanel = document.createElement('a-entity');
            descriptionPanel.setAttribute('geometry', 'primitive: plane; width: 2; height: 1.5');
            descriptionPanel.setAttribute('material', 'color: #FFF; emissive: #FFF; roughness: 0.1; transparent: true; opacity: 0.9');
            descriptionPanel.setAttribute('position', '0 2 0');
            //set the text
            descriptionPanel.setAttribute('text', `value: ${this.description}; color: #000; align: center; width: 1.5; font: monoid`);
            this.el.appendChild(descriptionPanel);

        }

        // Assuming namespaceData contains properties like `namespace`, `index`, etc.
        this.el.setAttribute('id', this.namespaceData.namespace);
        this.el.setAttribute(`click-handler`);
        this.el.setAttribute('class', 'clickable');
        this.el.setAttribute('geometry', 'primitive: box; width: 1; height: 2s');
        this.el.setAttribute('material', `color: #FFF; emissive: ${this.getColor()}; roughness: 0.1; src: #textured-glass-texture; transparent: true; opacity: 0.9`);
        this.el.setAttribute('scale', '2 2 2');
        //this.el.setAttribute('position', `0 3 0`);
        //this.el.setAttribute('animation', `property: position; to: 0 ${this.el.getAttribute("position").y + 3} 0; dir: alternate; dur: ${1000 + (this.namespaceData.index * 100)}; easing: easeInOutSine; loop: true`);
    
        // Create a text entity
        const namespaceText = document.createElement('a-entity');
        namespaceText.setAttribute('id', `${this.namespaceData.namespace}-text`);
        namespaceText.setAttribute('text', `value: ${this.namespaceData.namespace}; color: #FFF; align: center; width: 2.5; font: monoid`);
        namespaceText.setAttribute('position', `0 .6 0.5`); 
        this.el.appendChild(namespaceText);

        const reservedText = document.createElement('a-entity');
        reservedText.setAttribute('text', `value: ${this.namespaceData.reserved ? `Reserved\n${this.truncateString(this.namespaceData.requester, 19)}`: "Available"}; color: #FFF; align: center; width: 2.5; font: monoid`);
        reservedText.setAttribute('position', `0 0.3 0.5`); 
        this.el.appendChild(reservedText);

        const poolText = document.createElement('a-entity');
        poolText.setAttribute('text', `value: ${this.namespaceData.pool_type}; color: #FFF; align: center; width: 2.5; font: monoid`);
        poolText.setAttribute('position', `0 0 0.5`); 
        this.el.appendChild(poolText);

        if ( this.falling === true ) {
            const currentX = this.el.getAttribute('position').x;
            const currentY = this.el.getAttribute('position').y;
            const currentZ = this.el.getAttribute('position').z;
            this.el.setAttribute('animation', `property: position; to: ${currentX} -10 ${currentY}; dir: alternate; dur: 1000; easing: easeInOutSine; loop: false`);
        }

        if ( this.data.isWaiting === false) {
            return
        }
        const fetchBox = document.createElement('a-entity')
        fetchBox.setAttribute('release-box', `title: Releasing...`);
        fetchBox.setAttribute('position', `0 -0.6 0.5`); 
        this.el.appendChild(fetchBox);

        
    }
});