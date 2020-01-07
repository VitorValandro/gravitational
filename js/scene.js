
function SceneConstructor(width, height, img, x, y, reference){
	var image = new Image(width, height);
	image.src = img;

	this.width = width;
	this.height = height;	
	this.reference = reference;
	this.x = x;
	this.img = image;
	this.y = y;
	this.update = function(){
	    ctx = myGameArea.context;
	    ctx.drawImage(this.img, 0,0,this.width, this.height,this.x, this.y,this.width, this.height);
	    if(this.reference === 'bottom' || this.reference === 'top'){
	    	ctx.strokeStyle = '#a5eff4';
		    ctx.lineWidth = 3;
		    ctx.strokeRect(this.x, this.y, this.width, this.height);
	    }
  	}
}
