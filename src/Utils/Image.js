// export const Resize = ( file, callback )=>{
//
//   let reader = new FileReader();
//   reader.onload = function(e) {
//     let img = new Image();
//     img.onloadend = function() {
//       let canvas = document.createElement("canvas");
//       let ctx = canvas.getContext("2d");
//       ctx.drawImage(img, 0, 0, 400, 400);
//       console.log(canvas);
//       let dataurl = canvas.toDataURL("image/jpeg");
//       callback({
//         thumb: dataurl,
//         original: img.src
//       })
//     }
//     img.src = e.target.result;
//   }
//   reader.readAsDataURL(file);
// }
//
// export const MakeImg = (img)=>{
//   return img.replace('data:image/jpeg;base64,', '')
// }

export const Resize = ( file, callback )=>{
  var fileReader = new FileReader();
  fileReader.readAsArrayBuffer(file);

  fileReader.onload = (evt) => {
    var arrayBuffer = fileReader.result;
    callback(arrayBuffer)
  }
}
