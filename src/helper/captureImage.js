export function captureImage(arLib) {
  const { video, renderer, scene, camera,camera2D,scene2D,detect } = arLib;
  const renderCanvas = renderer.domElement;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = renderCanvas.width;
  canvas.height = renderCanvas.height;

  //* 先把模型畫上去
  renderer.preserveDrawingBuffer = true;
  renderer.autoClear = false;
  if(detect>17){
    camera.layers.set(detect-3);
  }else{
    camera.layers.set(detect);
  }
  renderer.render(scene, camera);

   //* 切換2D相機layer到視訊畫面的那層
  renderer.autoClear = false; 
  camera2D.layers.set(25);
  renderer.render(scene, camera2D);
  //* 切換2D相機layer到圖框的那層
  renderer.autoClear = false; // 防止在渲染2D场景前清除现有的渲染
  camera2D.layers.set(0);
  renderer.render(scene2D, camera2D);
  renderer.autoClear = true; 
  context.drawImage(renderCanvas, 0, 0, canvas.width, canvas.height);
  renderer.preserveDrawingBuffer = false;

  return canvas.toDataURL();
}

export function captureImageFromCanvas(canvas) {
  // 建立一個新的 Canvas 元素來暫存擷取的影像
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');

  // 設定新 Canvas 的寬高與原始 Canvas 相同
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;

  // 在新 Canvas 上繪製原始 Canvas 的影像
  tempCtx.drawImage(canvas, 0, 0);

  // 從新 Canvas 中擷取影像，並返回資料 URL
  const imageDataURL = tempCanvas.toDataURL('image/png');
  
  // 返回影像的資料 URL
  return imageDataURL;
}