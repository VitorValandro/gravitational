var jumpAudio = new loadAudio('audio/switch_jump.wav', false);
function PlayerConstructor(width, height, img, x, y, sx,sy,swidth,sheight) { // Construtor do jogador
	var image = new Image(width, height);
	image.src = img;

	this.width = width;
	this.height = height;
	this.speedX = 0;
	this.speedY = 3.5;
	this.x = x;
	this.y = y;
	this.img = image;
	this.swidth = swidth;
	this.sheight = sheight;
	this.sx = sx;
	this.sy = sy;
	this.interval = setInterval(updateSprite, 130);
	this.update = function(){
	    ctx = myGameArea.context;
	    ctx.drawImage(this.img, this.sx,this.sy,this.width,59, this.x, this.y, this.width, this.height);
  	}

  	this.ChangeMove = function(){
  		this.x += this.speedX;
  		this.y += this.speedY;
  	}

  	var x = true;

  	this.MovePlayer = function(){

	  		if (x === true){
	  			this.speedY = 0;
	  			this.speedY -= 3.5;
	  			x = false;
	  			this.sy += 59;
	  		}
	  		else {
	  			this.speedY = 0;
	  			this.speedY +=3.5;
	  			x = true;
	  			this.sy = 0;
	  		}
  	}

  	this.FallLost = function(){
  		var fall = false;

  		if ((this.y < 0 - this.height) || (this.y > myGameArea.canvas.height) || (this.x + this.width -10< 0)){
  			fall = true;
  		}
  		return fall;
  	}

	this.PlayerGrounded = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var grounded = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            grounded = false;
        }
        return grounded;
	}


// função auxiliar pra checar colisão COPIADA do StackOverflow pra ajudar :)
	this.colCheck = function(shapeA, shapeB) {
	    // get the vectors to check against
	    var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
	        vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
	        // add the half widths and half heights of the objects
	        hWidths = (shapeA.width / 2) + (shapeB.width / 2),
	        hHeights = (shapeA.height / 2) + (shapeB.height / 2),
	        colDir = null;

	    // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
	    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
	        // figures out on which side we are colliding (top, bottom, left, or right)
	        var oX = hWidths - Math.abs(vX),
	            oY = hHeights - Math.abs(vY);
	        if (oX >= oY) {
	            if (vY > 0) {
	                colDir = "t";
	                shapeA.y += oY;
	            } else {
	                colDir = "b";
	                shapeA.y -= oY;
	            }
	        } else {
	            if (vX > 0) {
	                colDir = "l";
	                shapeA.x += oX;
	            } else {
	                colDir = "r";
	                shapeA.x -= oX;
	            }
	        }
	    }
    return colDir;
	}
}


// função de controle do jogador

function KeyDown(evt){
    switch (evt.keyCode) {
        case 32:  //code da spacebar
	        if (Onground == true){
	            player.MovePlayer();
	            jumpAudio.audio.play();
	            break;
	        }
	        else{break;}
	    case 13:
	    	myGameArea.pause();
    }
}

window.addEventListener('keydown',KeyDown,true);

function updateSprite(){
	player.sx += 44;
    if (player.sx >= 300){
        player.sx = 0;
    }
}