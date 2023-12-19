import { registerComponent } from "aframe";

registerComponent('thumbstick-movement', {
    schema: {
      speed: {type: 'number', default: 2}
    },

    init: function () {
      this.velocity = new THREE.Vector3();
      this.direction = new THREE.Vector3();
      this.rotation = new THREE.Euler(0, 0, 0, 'YXZ');

      this.el.addEventListener('thumbstickmoved', (e) => {
          this.direction.x = e.detail.x; // Left/right movement
          this.direction.z = e.detail.y; // Forward/backward movement
      });
    },

    tick: function (time, timeDelta) {
      const delta = (timeDelta / 1000) * this.data.speed;
      this.rotation.y = THREE.MathUtils.degToRad(this.el.getAttribute('rotation').y);

      this.velocity.x = this.direction.x * delta;
      this.velocity.z = this.direction.z * delta;

      this.velocity.applyEuler(this.rotation);

      this.el.object3D.position.add(this.velocity);
    }
  });