import { registerComponent } from "aframe";
import { stateManager } from "../stateManager/stateManager";

registerComponent('namespace-list', {
  schema: {
    reserved: {type: "boolean", default: false},
    requester: {type: "string", default: "any"},
  },
  init: function() {

    stateManager.addEventListener('namespacesChanged', (event) => {
        this.render(event.detail);
    });

  },
  render: function(namespaces) {
      let iteration = 0;
      namespaces.forEach((namespace, index) => {
          if (namespace.reserved !== this.data.reserved) {
              return;
          }
          if (this.data.requester !== 'any' && namespace.requester !== this.data.requester) {
              return;
          }
          // Create an a-entity for each namespace
          const entity = document.createElement('a-entity');
          entity.setAttribute('namespace', `data: ${JSON.stringify({ ...namespace, index: iteration })}`);
          this.el.appendChild(entity);
          iteration += 1;
      });
  }
});