/*  
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com

Yo lo saqué de aquí:
  https://www.codemahal.com/make-2d-game-javascript
*/
// more documentation available at
    // https://github.com/tensorflow/tfjs-models/tree/master/speech-commands
var youHaveSaid;
var stop = 0;
    // the link to your model provided by Teachable Machine export panel
    const URL = "https://teachablemachine.withgoogle.com/models/ky6wcxNVR/";

    async function createModel() {
        const checkpointURL = URL + "model.json"; // model topology
        const metadataURL = URL + "metadata.json"; // model metadata

        const recognizer = speechCommands.create(
            "BROWSER_FFT", // fourier transform type, not useful to change
            undefined, // speech commands vocabulary feature, not useful for your models
            checkpointURL,
            metadataURL);

        // check that model and metadata are loaded via HTTPS requests.
        await recognizer.ensureModelLoaded();

        return recognizer;
    }

    async function init() {
        const recognizer = await createModel();
        const classLabels = recognizer.wordLabels(); // get class labels
        const labelContainer = document.getElementById("label-container");
        for (let i = 0; i < classLabels.length; i++) {
            labelContainer.appendChild(document.createElement("div"));
        }

        // listen() takes two arguments:
        // 1. A callback function that is invoked anytime a word is recognized.
        // 2. A configuration object with adjustable fields
        
        recognizer.listen(result => {
            const scores = result.scores; // probability of prediction for each class
            // render the probability scores per class
            var maxi = 0;
            var youHaveSaidAux = "";
            for (let i = 0; i < classLabels.length; i++) {
              //console.log(i,classLabels[i]);
                const classPrediction = classLabels[i] + ": " + result.scores[i].toFixed(2);
                labelContainer.childNodes[i].innerHTML = classPrediction;
                if(classLabels[i]!='Ruido de fondo'){
                  maxi = Math.max(maxi,result.scores[i].toFixed(2));
                  if(maxi>=0.80 && maxi==result.scores[i].toFixed(2))
                    youHaveSaidAux = classLabels[i];
                  stop=10;
                }
                
                
            }
            youHaveSaid = youHaveSaidAux;

        }, {
            includeSpectrogram: false, // in case listen should return result.spectrogram
            probabilityThreshold: 0.85,
            invokeCallbackOnNoiseAndUnknown: true,
            overlapFactor: 0.5 // probably want between 0.5 and 0.75. More info in README
        });


        // Stop the recognition in 5 seconds.
        // setTimeout(() => recognizer.stopListening(), 5000);
    }
// Create the canvas for the game to display in
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Load the background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
  // show the background image
  bgReady = true;
};
bgImage.src = "images/background.png";

// Load the player image
var playerReady = false;
var playerImage = new Image();
playerImage.onload = function () {
  // show the player image
  playerReady = true;
};
playerImage.src = "images/player.png";

// Load the enemy image
var enemyReady = false;
var enemyImage = new Image();
enemyImage.onload = function () {
  // show the enemy image
  enemyReady = true;
};
enemyImage.src = "images/enemy.png?format=300w";

// Create the game objects
var player = {
  speed: 256 // movement speed of player in pixels per second
};
var enemy = {};
var enemiesCaught = 0;

// Handle keyboard controls
var keysDown = {};

// Check for keys pressed where key represents the key pressed
addEventListener("keydown", function (event) {
  keysDown[event.key] = true;
}, false);

addEventListener("keyup", function (event) {
  delete keysDown[event.key];
}, false);

// Reset the player and enemy positions when player catches an enemy
var reset = function () {
  // Reset player's position to centre of canvas
  player.x = canvas.width / 2;
  player.y = canvas.height / 2;

  // Place the enemy somewhere on the canvas randomly
  enemy.x = enemyImage.width + (Math.random() * (canvas.width - (enemyImage.width*2)));
  enemy.y = enemyImage.height + (Math.random() * (canvas.height - (enemyImage.height*2)));
};
console.log(youHaveSaid);
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
// Update game objects - change player position based on key pressed
var update = function (modifier) {
  if (stop==0)
    return;
  if ("ArrowUp" in keysDown || "w" in keysDown || youHaveSaid=="Arriba") { // Player is holding up key
    //for(i=0;i<10;i++)

      player.y -= player.speed * modifier;
  }
  if ("ArrowDown" in keysDown || "s" in keysDown || youHaveSaid=="Abajo") { // Player is holding down key
    //for(i=0;i<10;i++)
      player.y += player.speed * modifier;
  }
  if ("ArrowLeft" in keysDown || "a" in keysDown || youHaveSaid=="Izquierda") { // Player is holding left key
    //for(i=0;i<10;i++)
      player.x -= player.speed * modifier;
  }
  if ("ArrowRight" in keysDown || "d" in keysDown || youHaveSaid=="Derecha") { // Player is holding right key
    //for(i=0;i<10;i++)
      player.x += player.speed * modifier;
      
  }
if (youHaveSaid=='A'){
  playerImage.src = "images/A.jpeg";
}
if (youHaveSaid=='E'){
  playerImage.src = "images/E.jpeg";
}
if (youHaveSaid=='I'){
  playerImage.src = "images/I.jpeg";
}
if (youHaveSaid=='O'){
  playerImage.src = "images/O.jpeg";
}
if (youHaveSaid=='U'){
  playerImage.src = "images/U.jpeg";
}
if (youHaveSaid==''){
  playerImage.src = "images/player.png";
}
  /*
  if (youHaveSaid=="Ruido de fondo") { // Player is holding right key
    for(i=0;i<5;i++){
          player.x += player.speed * modifier;
        }
  }*/
  //console.log("youHaveSaid: "+youHaveSaid);
  //youHaveSaid = "";
  // Check if player and enemy collide
  if (
    player.x <= (enemy.x + enemyImage.width)
    && enemy.x <= (player.x + playerImage.width)
    && player.y <= (enemy.y + enemyImage.height)
    && enemy.y <= (player.y + playerImage.height)
  ) {
    ++enemiesCaught;
    reset();
  }
};

// Draw everything on the canvas
var render = function () {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }

  if (playerReady) {
    ctx.drawImage(playerImage, player.x, player.y);
  }

  if (enemyReady) {
    ctx.drawImage(enemyImage, enemy.x, enemy.y);
  }

  // Display score and time 
  ctx.fillStyle = "rgb(250, 250, 250)";
  ctx.font = "24px Helvetica";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Enemies caught: " + enemiesCaught, 20, 20);
  ctx.fillText("Time: " + count, 20, 50);
  // Display game over message when timer finished
  if(finished==true){
    ctx.fillText("Game over!", 200, 220);
  }

  
};

var count = 30; // how many seconds the game lasts for - default 30
var finished = false;
var counter =function(){
  //count=count-1; // countown by 1 every second
  // when count reaches 0 clear the timer, hide enemy and player and finish the game
  	if (count <= 0)
  	{
  		// stop the timer
     	clearInterval(counter);
     	// set game to finished
     	finished = true;
     	count=0;
     	// hider enemy and player
     	enemyReady=false;
     	playerReady=false;
  	}

}

// timer interval is every second (1000ms)
setInterval(counter, 1000);

// The main game loop
var main = function () {
  if (stop>0){
      stop--;
      console.log(youHaveSaid);
    }
  // run the update function
  update(0.02); // do not change
  // run the render function
  render();
  // Request to do this again ASAP
  requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
reset();
main();