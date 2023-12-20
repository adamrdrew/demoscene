import { registerComponent, THREE } from "aframe";

registerComponent('thumbstick-movement', {
    schema: {
      speed: { type: 'number', default: 2 },
      rotationSpeed: { type: 'number', default: 60 }, // degrees per second
      hand: { type: 'string', default: 'right' }
    },
    events: {
      thumbstickmoved: function (e) {
        if ( this.data.hand === 'left' ) {
          this.direction.x = e.detail.x; // Left/right movement
          this.direction.z = e.detail.y; // Forward/backward movement
        }
        if ( this.data.hand === 'right' ) {
          this.rotationDelta = -1 * e.detail.x; // Horizontal axis for rotation
        }
      }
    }, 
    init: function () {
      this.velocity = new THREE.Vector3();
      this.direction = new THREE.Vector3();
      this.rotation = new THREE.Euler(0, 0, 0, 'YXZ');
      this.rotationDelta = 0;
      this.rig = this.el.parentNode; // or this.el.parentElement

    },

    tick: function (time, timeDelta) {
      const delta = (timeDelta / 1000) * this.data.speed;
      this.rotation.y = THREE.MathUtils.degToRad(this.el.object3D.rotation.y);

      this.velocity.x = this.direction.x * delta;
      this.velocity.z = this.direction.z * delta;

      this.velocity.applyEuler(this.rotation);

      if (this.rig) {
        this.rig.object3D.position.add(this.velocity);
    
        if (this.rotationDelta) {
          const rotationChange = this.rotationDelta * this.data.rotationSpeed * (timeDelta / 1000);
          this.rig.object3D.rotation.y += THREE.MathUtils.degToRad(rotationChange);
        }
      }
    }
});
