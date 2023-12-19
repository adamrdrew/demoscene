import { registerComponent } from "aframe";

registerComponent('namespace-list', {
  init: function() {
      // Fetch data from the server
      fetch('/api/firelink/namespace/list')
          .then(response => response.json())
          .then(data => {
              // Successfully fetched data
              this.render(data);
          })
          .catch(error => console.error('Error fetching data:', error));
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