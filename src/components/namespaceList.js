import { registerComponent } from "aframe";
import { stateManager } from "../stateManager/stateManager";

registerComponent('namespace-list', {
  init: function() {

    stateManager.addEventListener('namespacesChanged', (event) => {
        this.render(event.detail);
    });

  },

  render: function(namespaces) {
      namespaces.forEach((namespace, index) => {
          // Create an a-entity for each namespace
          const entity = document.createElement('a-entity');
          entity.setAttribute('namespace', `data: ${JSON.stringify({ ...namespace, index })}`);
          this.el.appendChild(entity);
      });
  }
});