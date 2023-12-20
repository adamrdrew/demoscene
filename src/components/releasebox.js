import { registerComponent } from "aframe";
import { stateManager } from "../stateManager/stateManager";


registerComponent('release-box', {
    schema: {
        title: {type: 'string', default: 'Fetch Box'},
        namespace: {type: 'string', default: 'bobobobo'}
    },
    
    init: function () {
        console.log("fetch-box init")
        this.render();
    },
    releaseNamespace: function () {
        stateManager.releaseNamespace(this.data.namespace);
    },
    events: {

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

        this.el.setAttribute('geometry', {
            primitive: 'plane',
            width: 1,
            height: 1,
        });
        this.el.setAttribute('rotation', '0 0 0');
        this.el.setAttribute('material', {
            color: '#19F',
            src: '#textured-glass-texture',
            opacity: 0.9
        });
        this.el.setAttribute('position', {
            x: 0,
            y: 0.3,
            z: 0.75
        });
        this.el.setAttribute('text', {
            value: this.data.title,
            align: 'center',
            color: '#FFF',
            font: 'monoid',
            width: 3
        });

    }
});
