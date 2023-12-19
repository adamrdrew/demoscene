import { registerComponent } from "aframe";

registerComponent('reflective', {
    schema: {
      envMap: {type: 'selector'}
    },
  
    init: function() {
      var data = this.data;
      var el = this.el;
      var object3D = el.object3D;
  
      // Wait for the model to load.
      el.addEventListener('model-loaded', () => {
        // Grab the mesh.
        var mesh = object3D.getObjectByProperty('type', 'Mesh');
        if (!mesh) return;
  
        // Create and apply the reflective material.
        var reflectiveMaterial = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          envMap: data.envMap.object3D.environment,
          roughness: 0,
          metalness: 0.5
        });
  
        mesh.material = reflectiveMaterial;
      });
    }
  });
  