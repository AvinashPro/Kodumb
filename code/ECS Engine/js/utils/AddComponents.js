export default function AddComponentToEntity(scene, entity, components) {
  components.forEach(component => {
    scene.world.addComponent(entity, component);
  })
  return;
}