export function shareImage(imageDom) {
  const files = [dataURLtoFile(imageDom, "image.png")];
  if(navigator.canShare || navigator.canShare({files})) {
    navigator.share({
      files: files
    })
  }
}

function dataURLtoFile(dataurl, filename) {
  let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

  while(n--){
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, {type:mime});
}