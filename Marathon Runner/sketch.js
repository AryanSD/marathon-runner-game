var PLAY = 1;
var END = 0;
var TIRED = 2;
var gameState = PLAY;

var runner, runner_running, runner_collided;
var ground, invisibleGround, groundImage;

var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var invGroup;

var score = 0;

function preload(){
 runner_running = loadAnimation("b1.png", "b2.png", "b3.png");
 runner_collided = loadAnimation("ouch.png");
 groundImage = loadImage("track.jpeg");
 obstacleImage = loadImage("Stone.png");
 gameOverImg = loadImage("gameOver.png");
}

function setup() {
  createCanvas(600, 400);

  ground = createSprite(300,100,600,400);
  ground.addImage("ground",groundImage);
  
  runner = createSprite(90,160,20,50);
  runner.addAnimation("running", runner_running);
  runner.addAnimation("collided" ,runner_collided);
  runner.scale = 0.4;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  obstaclesGroup = createGroup();
  invGroup = createGroup();
  runner.setCollider("circle",0,0,40);
  score = 0;
}

function draw() {
  
  background(180);
  
  if(gameState === PLAY){
    drawSprites();

    ground.velocityX = -4;
        
    if (ground.x < 100){
      ground.x = ground.width/2;
    }

      for(var i = 0; i<invGroup.length; i++){
        if(runner.isTouching(invGroup.get(i))){
          invGroup.get(i).destroy();
          score = score + 1;
        }
      }
      
    if(keyDown("space")&& runner.y >= 100) {
        runner.velocityY = -12;
        
    }

    runner.velocityY = runner.velocityY + 0.8
    spawnObstacles();
    if(obstaclesGroup.isTouching(runner)){
      gameState = END;
    }

  }
   else if (gameState === END) {
     obstaclesGroup.destroyEach();
      x = 0;
     ground.velocityX = 0;
     runner.velocityY = 0;
      runner.changeAnimation("collided", runner_collided);
      runner.x = 300;
      obstaclesGroup.setLifetimeEach(-1);
      invGroup.setVelocityXEach(0);
      invGroup.destroyEach();
     
     obstaclesGroup.setVelocityXEach(0);
     drawSprites();

     textSize(25)
    fill("black")
    text("Press 'R' to restart", 200, 300);

    if(keyDown("R") || keyDown("r")){
        reset();
    }
   }
   else if(gameState === TIRED){
    
    ground.velocityX = 0;
    runner.velocityY = 0;
    runner.x = 200;
    runner.y = 160;

    obstaclesGroup.setVelocityXEach(0);
    obstaclesGroup.destroyEach();
    invGroup.setVelocityXEach(0);
    invGroup.destroyEach();
    drawSprites();

    textSize(40)
    fill("black")
    text("Runner exhausted!", 100,300)
 
     
   }
  runner.collide(invisibleGround);
  fill("white")
  textSize(20)
  text("Score: "+ score, 500,70);
  }

function spawnObstacles(){
 if (frameCount % 80 === 0){
   var obstacle = createSprite(650,210,10,40);
    obstacle.velocityX = -6;
    obstacle.addImage(obstacleImage);
    obstacle.setCollider("rectangle", 0, 0, 100, 100);
           
    obstacle.scale = 0.1;
    obstacle.lifetime = 300;
    obstacle.depth = runner.depth;
    runner.depth = runner.depth + 1;
    obstaclesGroup.add(obstacle);

    var inv = createSprite(obstacle.x + 10,obstacle.y - 100, 20, 150);
    inv.shapeColor = "red";
    inv.velocityX = -6;
    inv.lifetime = 300;
    inv.visible = false;
    invGroup.add(inv);
 }
}

function reset(){
  gameState = PLAY;
  runner.changeAnimation("running", runner_running);
  score = 0;
}