var player;
var platforms;
var Onground;
var score;
var sceneSpeed;
var background;
var mountains;
var stars;
var clouds;
var time;
var aux;
var pause;
var soundtrack = new loadAudio('audio/jumpshot.mp3', true);
var pauseImg = new Image(700, 500);
pauseImg.src = 'img/pause.png';
var overImg = new Image(700,500);
overImg.src = 'img/gameover.jpg';


var myGameArea = { //constrói a tela de jogo
    canvas : document.getElementById('screen'),
    start : function() {
        this.canvas.width = 700;
        this.canvas.height = 500;
        this.context = this.canvas.getContext("2d");
        //document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0; 
        this.interval;
        loadAudio();
        document.getElementById("pause").style.display = 'none';
        //this.pause = SceneConstructor(700,500,'img/pause;j')
    },
    stop : function() {
        clearInterval(this.interval);
        clearInterval(player.interval);
        myGameArea.clear();
        //myGameArea.start();
        this.context.drawImage(overImg, 0,0,700,500);        
        document.getElementById('restart').style.display = 'block';
        document.getElementById('scorePost').style.display = 'block';
        document.getElementById("pause").innerHTML = score;
        document.getElementById("pause").style.display = 'flex';
        document.getElementById("pause").style.opacity = 1;
        soundtrack.audio.pause();
        soundtrack.audio.currentTime = 0.0;
    },    
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    pause : function() {
        if (!pause){
            this.context.drawImage(pauseImg, 0,0,700,500);
            document.getElementById("pause").innerHTML = score;
            document.getElementById("pause").style.display = 'flex';
            clearInterval(this.interval);
            pause = true;
        }
        else{
            myGameArea.interval = setInterval(updateGameArea, time);
            document.getElementById("pause").style.display = 'none';
            pause = false;
        }
    }
}

function startGame(){ //inicializa o jogo
    document.getElementById('start').style.display = 'none';
    document.getElementById('restart').style.display = 'none';
    document.getElementById('scorePost').style.display = 'none';
    player = '';
    platforms = [];
    background = '';
    stars = [];
    mountains = [];
    clouds = []
    pause=false;

    player = new PlayerConstructor(44, 59, "img/spritesheet.png", 100, 450,0,0,43,59); //crio um jogador
    platforms.push(new SceneConstructor(600, 50, "img/tileGround.jpg", 0, 450, 'bottom'));
    platforms.push(new SceneConstructor(600, 50, "img/tileRoof.jpg", 0, 0, 'top'));
    background = new SceneConstructor(700, 500, "img/gradient.jpg", 0,0,'background');
    stars.push(new SceneConstructor(700, 500, "img/stars.png", 0,0,'parallax'));
    mountains.push(new SceneConstructor(700, 500, "img/mountains.png", 0,160,'parallax'));
    clouds.push(new SceneConstructor(700, 500, "img/clouds.png", 0,-90,'parallax'));
    score = 0;
    time= 18;
    aux = 1;
    sceneSpeed = -3;
    myGameArea.interval = setInterval(updateGameArea, time);
    myGameArea.start();   
    soundtrack.audio.play();
    console.log(platforms);
}

function updateGameArea(){ //função para atualizar o canvas
    var x;
    console.log(player);
    if(player.FallLost()){
        myGameArea.stop();
        return;
    }
    Onground = false;
    for(i=0; i < platforms.length; i++){
        if (player.PlayerGrounded(platforms[i])){
            Onground = true;
                if (player.colCheck(player, platforms[i]) === "r"){
                    player.y-=2;
                } else {    
                    if (platforms[i].reference === 'bottom'){
                        player.y = myGameArea.canvas.height - player.height - 53;
                    }
                    else{
                        player.y = platforms[i].height - 3;
                    } 
                }
        }
    }
    if (player.x < (0.60 * myGameArea.canvas.width)){
        player.x += 0.2;
    }
    myGameArea.clear();
    background.update();
    for(i=0; i < stars.length; i++){
        stars[i].update();
        stars[i].x += -0.3;
        if(stars.length < 3){
            stars.push(new SceneConstructor(700, 500, "img/stars.png", stars.length*500,0,'parallax'));
        }
        if(stars[0].x + 500 < myGameArea.canvas.width - stars[0].width){
            stars.splice(0,1);
        }
    }
    for(i=0; i < mountains.length; i++){
        mountains[i].update();
        mountains[i].x += -0.2;
        if(mountains.length < 3){
            mountains.push(new SceneConstructor(700, 500, "img/mountains.png", mountains.length*500,160,'parallax'));
        }
        if(mountains[0].x + 500 < myGameArea.canvas.width - mountains[0].width){
            mountains.splice(0,1);
        }
    }
    for(i=0; i < clouds.length; i++){
        clouds[i].update();
        clouds[i].x += -0.5;
        if(clouds.length < 3){
            clouds.push(new SceneConstructor(700, 500, "img/clouds.png", clouds.length*500,-90,'parallax'));
        }
        if(clouds[0].x + 500 < myGameArea.canvas.width - clouds[0].width){
            clouds.splice(0,1);
        }
    }
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(100)) {
        x = myGameArea.canvas.width;
        width = Math.floor(Math.random() * (300 - 140)) + 140;
        height = Math.floor(Math.random() * (200 - 50)) + 50;
        platforms.push(new SceneConstructor(width, height, "img/tileGround.jpg", x, 450, 'bottom'));
        width = Math.floor(Math.random() * (300 - 140)) + 140; 
        platforms.push(new SceneConstructor(width, height, "img/tileRoof.jpg", x, -5, 'top'));
    }

    for (i = 0; i < platforms.length; i += 1) {
        platforms[i].x += sceneSpeed;
        platforms[i].update();
    }
    player.ChangeMove();
    player.update();
    score += 1;
    document.getElementById("score").innerHTML = score;

    if(platforms.length > 9){
        platforms.splice(0,1);
    }
    if(score >= aux * (500 + aux*50)){
        aux++;
        upDifficulty();
        console.log(time);
    }
}
function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}
function upDifficulty(){
    clearInterval(myGameArea.interval);
    time -= 1;
    myGameArea.interval = setInterval(updateGameArea, time);
}

function catchScore(){
    var caminho = document.getElementById("score").innerHTML;
    document.getElementById("scoreInput").value = caminho;
}
function loadAudio(src, loop) {
         this.audio = new Audio();
         this.audio.src = src;
         this.audio.load();
         this.audio.volume = 0.5;
         this.audio.loop = loop;
}
var span = document.getElementById("close");
var helpIco = document.getElementById("helpIco");
var help = document.getElementById("help");
helpIco.onclick = function(){
     help.style.display = "block";
    }
span.onclick = function() { 
      help.style.display = "none";
    }