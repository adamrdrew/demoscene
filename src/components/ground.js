import { registerComponent, THREE } from "aframe";

registerComponent('ground', {
    schema: {
        width: {type: 'number', default: 100},
        height: {type: 'number', default: 100},
        color: {type: 'color', default: '#7BC8A4'}
    },
    
    init: function () {
        var data = this.data;

        // Create geometry using PlaneGeometry
        this.geometry = new THREE.PlaneGeometry(data.width, data.height);

        // Create material.
        this.material = new THREE.MeshStandardMaterial({color: data.color});

        // Create mesh.
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        // Set mesh on entity.
        this.el.setObject3D('mesh', this.mesh);

        // Rotate the mesh to lie flat (plane is vertical by default)
        this.mesh.rotation.x = -Math.PI / 2;
    },
    
    remove: function () {
        // Remove mesh.
        this.el.removeObject3D('mesh');
    }
});
