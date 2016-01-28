//Author: Md Anisur Rahman
//Author URI: http://anistuhin.com
//Github link: https://github.com/anistuhin/privacy-week


//vars
var watermark = new Image();
watermark.src = 'img/watermark.png';
var fill = '#1F93D0';
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var info = ctx.getImageData(0, 0, 800, 800);
var photo = document.getElementById('photo');
var ptx = photo.getContext('2d');
var img = document.querySelector('#color-palet img');
var palet = document.getElementById('palet');
//drawing svg with the watermark
function prepare(){
	ctx.fillStyle = fill;
	ctx.fillRect(227.272, 666.429, 420.779, 61.039);
	ctx.beginPath();
	ctx.moveTo(800,0);
	ctx.lineTo(800,92.701);
	ctx.lineTo(665.532,92.701);
	ctx.lineTo(572.026,0);
	ctx.closePath();
	ctx.fillStyle = fill;
	ctx.fill();
	ctx.drawImage(watermark, 0, 0);
}
//default photo
var defaultView = new Image();
defaultView.src = 'img/demo-gray.jpg';
defaultView.addEventListener('load', function() {
	ctx.drawImage(defaultView, 0, 0);
	info = ctx.getImageData(0, 0, 800, 800);
	ptx.putImageData(info, 0, 0);
	prepare();	
}, false);
img.addEventListener('click', function(e){
	var x = '',y = '';
	// chrome
	if(e.offsetX) {
		x = e.offsetX;
		y = e.offsetY; 
	}
	// firefox
	else if(e.layerX) {
		x = e.layerX;
		y = e.layerY;
	}
	palet.width = img.width;
	palet.height = img.height;
	// draw image in canvas tag
	palet.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
	var p = palet.getContext('2d').getImageData(x, y, 1, 1).data;
	// change svg
	if ((rgbToHex(p[0],p[1],p[2]) == "#000000") || (rgbToHex(p[0],p[1],p[2]) == "#ffffff")) {
		
	} else {
		fill = rgbToHex(p[0],p[1],p[2]);
		prepare();
	}
},false);
// convert rgba to hex 
function rgbToHex(r, g, b) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}
//downloads the canvas image
function downloadPic() {
	var dataURL = document.getElementById('canvas').toDataURL('image/png');
	document.getElementById('download').href = dataURL;
}
//upload photo
function selectPhoto() {
	var upload = document.getElementById('upload');
	upload.click();
}
//copies the uploaded photo into the canvas
function readImage(evt) {
	var file = evt.target.files[0];
	if (!file.type.match('image.*')) {
		alert("Sorry, you missed to select an image. Try again :)");
	} else {
		if ( this.files && this.files[0] ) {
			var reader= new FileReader();
			reader.onload = function(e) {
				var img = new Image();
				img.onload = function() {
					var height = img.height, width = img.width;
					var newWidth, newHeight, scale;
					if (width < height) {
					  scale = width / 800;
					  newWidth = 800;
					  newHeight = height / scale;
					} else {
					  scale = height / 800;
					  newHeight = 800;
					  newWidth = width / scale;
					}
					ctx.drawImage(img, canvas.width / 2 - newWidth / 2, canvas.height / 2 - newHeight / 2, newWidth, newHeight);
					info = ctx.getImageData(0, 0, 800, 800);
					ptx.putImageData(info, 0, 0);
					prepare();
				};
				img.src = e.target.result;	
			};       
			reader.readAsDataURL( this.files[0] );
		}
	}
}
//color mode process
function color(){
	var tempColor = ptx.getImageData(0, 0, 800, 800);
	ctx.putImageData(tempColor, 0, 0);
	prepare();
}
//grayscale mode process
function grayscale(){
	var tempGrayscale = ptx.getImageData(0, 0, 800, 800);;
	var data = tempGrayscale.data;
	for(var i = 0; i < data.length; i += 4) {
		var brightness = 0.05 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
		data[i] = brightness;
		data[i + 1] = brightness;
		data[i + 2] = brightness;
	}
	ctx.putImageData(tempGrayscale, 0, 0);
	prepare();
}
//EventListeners
document.getElementById('color').addEventListener('click', color, false);
document.getElementById('grayscale').addEventListener('click', grayscale, false);
document.getElementById('select').addEventListener('click', selectPhoto, false);
document.getElementById('upload').addEventListener('change', readImage, false);
document.getElementById('download').addEventListener('click', downloadPic, false);
document.getElementById('share').addEventListener("mouseover", function(){
	document.querySelector('ul#palet-nav li:nth-child(5)').style.display = "none";
	document.querySelector('ul#palet-nav li:last-child').style.display = "block";
}, false);
document.getElementById('share-nav').addEventListener("mouseout", function(){
	document.querySelector('ul#palet-nav li:nth-child(5)').style.display = "block";
	document.querySelector('ul#palet-nav li:last-child').style.display = "none";
}, false);