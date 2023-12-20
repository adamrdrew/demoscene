import { registerComponent } from "aframe";
import { stateManager } from "../stateManager/stateManager";

registerComponent('reserve-namespace', {
    schema: {
        isWaiting: { type: 'boolean', default: false },
    },
    
    init: function () {
        console.log("register-box init")
        this.render();
    },
    registerNamespace: function () {
        stateManager.registerNamespace(this.data.namespace);
    },
    events: {
        click: function(evt) {
            if ( this.data.isWaiting === true ) {
                return;
            }
            this.el.setAttribute('register-namespace',"isWaiting", true);
            this.render();
            this.registerNamespace();
        }

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

        const terminal = document.createElement('a-entity');
        terminal.setAttribute('gltf-model', '#terminal');
        terminal.setAttribute('scale', '0.016 0.016 0.016');
        terminal.setAttribute('rotation', '0 0 0');
        terminal.setAttribute('material', {
            color: '#444',
        });
        terminal.setAttribute('position', {
            x: 0,
            y: 0.9,
            z: 0,
        });

        this.el.appendChild(terminal);

        const screen = document.createElement('a-entity');
        screen.setAttribute('geometry', {
            primitive: 'plane',
            width: 1,
            height: 0.5,
        });
        screen.setAttribute('rotation', '-30 0 0');
        screen.setAttribute('material', {
            color: '#19F',
            opacity: 0.9
        });
        screen.setAttribute('position', {
            x: 0,
            y: 2.76,
            z: 0.388
        });

        screen.setAttribute('text', {
            value: 'Register',
            align: 'center',
            color: '#FFF',
            font: 'monoid',
            width: 3
        });
        this.el.appendChild(screen);
        


    }
});