export function captureImage(arLib) {
  const { video, renderer, scene, camera } = arLib;
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

  // 创建浮水印图像对象
  const waterMarkImage = new Image();
  waterMarkImage.src = '/path/to/your/watermark/image.png';

  // 绘制浮水印
  waterMarkImage.onload = () => {
    const x = canvas.width - waterMarkImage.width - 10;
    const y = canvas.height - waterMarkImage.height - 10;
    context.drawImage(waterMarkImage, x, y);

    renderer.preserveDrawingBuffer = true;
    renderer.render(scene, camera);
    context.drawImage(renderCanvas, 0, 0, canvas.width, canvas.height);
    renderer.preserveDrawingBuffer = false;
  };

  return canvas;
}