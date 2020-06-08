AFRAME.registerComponent('presenter', {

  init: function() {
    var sceneEl = document.querySelector('a-scene');

    for(let node in View.nodes){
      let entityEl = document.createElement('a-entity');
      let curNode = View.nodes[node];
      entityEl.setAttribute('geometry', {
        primitive: 'sphere',
        radius: 0.5
      });
      entityEl.object3D.position.set(curNode.position.x, curNode.position.y, curNode.position.z);
      entityEl.setAttribute('material', 'color', 'blue');
      console.log(curNode.name);
      let textEl = document.createElement('a-entity');
      textEl.setAttribute('text', {value: curNode.name, color: 'black', width: 7, anchor: 'left', xOffset: 1});
      entityEl.appendChild(textEl);
      sceneEl.appendChild(entityEl);
    }

    var drawEdges = function() {
      for (var index = 0; index < View.edges.length; index++) {
        var inputPosition, outputPosition, targetMag, targetPosition, targetVector, targetRotation, targetAngles, entityEl, negInputPosition, height;
        try {
          inputPosition = (new THREE.Vector3()).copy(View.nodes[View.edges[index].input].position); // A (have to copy so original doesnt change)
          outputPosition = (new THREE.Vector3()).copy(View.nodes[View.edges[index].output].position); // B (ditto)
        } catch(e) {
          console.log("Error while reading view: " + e.message);
          continue;
        }
        
        negInputPosition = (new THREE.Vector3()).copy(inputPosition).negate();
        targetMag = (new THREE.Vector3()).add(outputPosition).add(negInputPosition);
        targetPosition = (new THREE.Vector3()).copy(targetMag).multiplyScalar(0.5).add(inputPosition) // midpoint

        targetVector = (new THREE.Vector3()).add(outputPosition).add(negInputPosition).normalize(); // AB = B - A
        targetRotation = (new THREE.Quaternion()).setFromUnitVectors(new THREE.Vector3(0, 1, 0), targetVector) // rotation from up vector to AB
        targetAngles = (new THREE.Euler()).setFromQuaternion(targetRotation); //turn to euler to apply to aframe entity

        height = targetMag.length();

        entityEl = document.createElement('a-entity');
        entityEl.setAttribute('geometry', {
          primitive: 'cylinder',
          height: height, //will need to maket his variable
          radius: 0.3
        });
        entityEl.object3D.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
        entityEl.object3D.rotation.set(targetAngles.x, targetAngles.y, targetAngles.z);
        entityEl.setAttribute('material', 'color', 'green');
        sceneEl.appendChild(entityEl);
      }
    };

    drawEdges();
  }

});