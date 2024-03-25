export function captureImage(arLib) {
  const { video, renderer, scene, camera,camera2D,scene2D } = arLib;
  const renderCanvas = renderer.domElement;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = renderCanvas.width;
  canvas.height = renderCanvas.height;

  const sx =
    (((video.clientWidth - renderCanvas.clientWidth) / 2) * video.videoWidth) /
    video.clientWidth;
  const sy =
    (((video.clientHeight - renderCanvas.clientHeight) / 2) *
      video.videoHeight) /
    video.clientHeight;
  const sw = video.videoWidth - sx * 2;
  const sh = video.videoHeight - sy * 2;

  context.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

  renderer.preserveDrawingBuffer = true;
  camera.layers.set(0);
  renderer.render(scene, camera);
  // camera.layers.set(0);
  // renderer.render(scene, camera);
  
  renderer.autoClear = false; // 防止在渲染2D场景前清除现有的渲染
  renderer.render(scene2D, camera2D);
  renderer.autoClear = true; 
  context.drawImage(renderCanvas, 0, 0, canvas.width, canvas.height);
  renderer.preserveDrawingBuffer = false;

  return [canvas.toDataURL(), canvas];
}
