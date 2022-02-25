var database;

var dog,sadDog,happyDog;
var foodS,foodStock;
var addFood,feeddog;
var foodObj;

var feed, lastFeed 

function preload(){
  sadDog=loadImage("Dog.png");
  happyDog=loadImage("happy dog.png");
}
function setup() {
  database=firebase.database();

  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref("Food");
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  feeddog=createButton("Alimentar al perro");
  feeddog.position(500,95);
  feeddog.mousePressed(feedDog);

  addFood=createButton("Agregar Alimento");
  addFood.position(650,95);
  addFood.mousePressed(addFoods);

}
function draw() {
  background(46,139,87);

  foodObj.display();

  feedTime=database.ref('FeedTime');
  feedTime.on("value",function(data){lastFeed=data.val();}); 
  
  fill("white");
  if(lastFeed>=12){
    text("ULTIMA HORA EN LA QUE SE ALIMENTO: "+lastFeed%12+"PM",20,30);
  }else if(lastFeed ==0){
    text("ULTIMA HORA EN LA QUE SE ALIMENTO: 12PM",20,30); 
  }else{
    text("ULTIMA HORA EN QUE SE ALIMENTO: "+lastFeed%12+"AM",20,30);
  }
 
  drawSprites();
}
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}
function feedDog(){
  dog.addImage(happyDog);

  database.ref("/").update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  });

  foodObj.deductFood();

  var foodStockValue = foodObj.getFoodStock();
  if(foodStockValue <= 0){
    foodObj.updateFoodStock(foodStockValue * 0);
  }else{
    foodObj.updateFoodStock(foodStockValue - 1);
  }
}
function addFoods(){
  database.ref("/").update({
    Food:foodS
  });
  foodS+=1;
}