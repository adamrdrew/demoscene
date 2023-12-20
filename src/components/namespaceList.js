import { registerComponent } from "aframe";
import { stateManager } from "../stateManager/stateManager";

registerComponent('namespace-list', {
  schema: {
    requester: {type: "string", default: "any"},
  },
  init: function() {
    stateManager.addEventListener('namespacesChanged', (event) => {
        this.render(event.detail);
    });

  },
  clearEntities: function() {
      // Clear existing text entities to prevent duplication
      while (this.el.firstChild) {
          this.el.removeChild(this.el.firstChild);
      }
  },
  render: function(namespaces) {
      this.clearEntities(); 
      
      let iteration = 0;
      const gridWidth = 5; // Number of boxes in each row
      const spacing = 5;   // Space between boxes
      
      namespaces.forEach((namespace, index) => {
          if (this.data.requester !== 'any' && namespace.requester !== this.data.requester) {
              return;
          }
      
          // Calculate the position
          let x = (index % gridWidth) * spacing;
          let z = -1 * Math.floor(index / gridWidth) * spacing;
      
          // Create an a-entity for each namespace
          const entity = document.createElement('a-entity');
          entity.setAttribute('namespace', `data: ${JSON.stringify({ ...namespace, index: iteration })}`);
          entity.setAttribute('position', { x: x, y: .5, z: z });
          this.el.appendChild(entity);
      
          iteration += 1;
      });
      
  }
});