import { registerComponent } from "aframe";
import { stateManager } from "../stateManager/stateManager";

registerComponent('reserve-namespace', {
    schema: {
        isWaiting: { type: 'boolean', default: false },
        success: { type: 'boolean', default: false },
    },
    events: {
        click: function(evt) {
            if ( this.data.isWaiting === true ) {
                return;
            }
            this.el.setAttribute('reserve-namespace',{isWaiting: true});
            this.render();
            this.registerNamespace();
        }
    },
    init: function () {
        stateManager.addEventListener('namespaceReserved', (event) => {
            this.namespaceWasReserved(event)
        });
        this.render();
    },
    registerNamespace: function () {
        stateManager.reserveNamespace(this.data.namespace);
    },
    getColor: function() {
        if ( this.data.success === true ) {
            return "#0F0";
        }
        if ( this.data.isWaiting === true ) {
            return "#A00";
        }
        return "#0FF";
    },
    getText: function() {
        if ( this.data.success === true ) {
            return `Reserved\n${this.namespace}`;
        }
        if ( this.data.isWaiting === true ) {
            return "Waiting...";
        }
        return "Reserve";
    },
    namespaceWasReserved: function(evt) {
        console.log("namespaceWasReserved", evt.detail);
        this.el.setAttribute('reserve-namespace',{success: true});
        this.namespace = evt.detail;
        this.render()
        //wait 10w second
        setTimeout(() => {
            this.el.setAttribute('reserve-namespace',{success: false});
            this.el.setAttribute('reserve-namespace',{isWaiting: false});
            stateManager.fetchNamespaces();
            this.render()
        }, 10000);
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
    render: function () {
        this.clearEntities();

        //const terminal = document.createElement('a-entity');
        this.el.setAttribute('gltf-model', '#terminal');
        this.el.setAttribute('scale', '0.016 0.016 0.016');
        this.el.setAttribute('rotation', '0 0 0');
        this.el.setAttribute('material', {
            color: '#444',
        });
        this.el.setAttribute("click-handler", "click");
        this.el.setAttribute('class', 'clickable');

        //this.el.appendChild(terminal);

        const screen = document.createElement('a-entity');
        screen.setAttribute('geometry', {
            primitive: 'plane',
            width: 1,
            height: 0.5,
        });
        screen.setAttribute('rotation', '-30 0 0');
        screen.setAttribute('scale', '75 75 75')
        screen.setAttribute('material', {
            color: this.getColor(),
            opacity: 0.9,
        });
        screen.setAttribute('position', '0 116 24');

        screen.setAttribute('text', {
            value: this.getText(),
            align: 'center',
            color: '#FFF',
            font: 'monoid',
            width: 2.5
        });
        screen.setAttribute(`click-handler`);
        screen.setAttribute('class', 'clickable');
        this.el.appendChild(screen);
        


    }
});