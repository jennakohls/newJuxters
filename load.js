//var interact = 'interactjs';

//Aliases
let Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    Rectangle = PIXI.Rectangle;
      
      
let app = new Application({ 
    width: 384,         // default: 800
    height: 700,        // default: 600
    antialias: true,    // default: false
    transparent: false, // default: false
    resolution: 1       // default: 1
  }
);

//scaleToWindow(app.renderer.view,"#2C3539");
//auto-resize function from here: https://github.com/kittykatattack/scaleToWindow
      //basically keeps things centered and sized nice. i have not tested this extensively :)

window.addEventListener("load", function(event){ 
        scale = scaleToWindow(app.renderer.view);
});
      window.addEventListener("resize", function(event){ 
        scale = scaleToWindow(app.renderer.view);
      });


//Add pixi canvas to html document
document.body.appendChild(app.view);
      
//load an image and run the `setup` function when it's done
loader
  .add("rss/tileset.json")
  .load(setup);

//let a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,blank;
let letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','_blank'];
let pileSize = 4;
let boardSize = 8; //square but it gets cut off! :D
let pile = new PIXI.Container();
let board = new PIXI.Container();
let tileSize = 64;

let movedTileX = 0;
let movedTileY = 0;
//This `setup` function will run when the image has loaded
function setup() { 
    

    
    //make board
    for(let i = 0; i < boardSize; i++){
        for(let j = 0; j < boardSize; j++){
            let tileName = "_blank";
            let newTile = createTile(tileName,(i * tileSize) + tileSize/2,(j * tileSize) + tileSize/2 + tileSize,false);
            board.addChild(newTile);
        }
    }
    app.stage.addChild(board);
    
    //make pile
    for(let i = 0; i < pileSize; i++){
        let tileName = letters[Math.round(Math.random() * (letters.length - 2))];
        let newPos = roundPosition((i * tileSize) + tileSize/2,tileSize/2);
        let newTile = createTile(tileName,newPos[0],newPos[1],true); 
        pile.addChild(newTile);
    }
    
    pile.position.set(tileSize/2, (tileSize/2) * 19);
    app.stage.addChild(pile);
    
    //make score
    drawScore();
    
}

function drawScore(){
    
let style = new PIXI.TextStyle({
  fontFamily: "BlinkMacSystemFont", //this probably won't work on mobile. 
  fontSize: 24,
  fill: "white",
});
    
    let message = new PIXI.Text("Score: 0",style);

    message.position.set((app.view.width/2) - 48, 24);
    
    app.stage.addChild(message);
    
}

function createPileTile(x,y){
    let tileName = letters[Math.round(Math.random() * (letters.length - 1))];
    let newPos = roundPosition(x,y);
    let newTile = createTile(tileName,newPos[0],newPos[1],true); 
    pile.addChild(newTile);
}

function createTile(name,x,y,interactable){
    let path = name + ".png"
    let tile = new Sprite(TextureCache[path]);
    
    tile.interactive = interactable;
    tile.buttonMode = true;
    tile.anchor.set(0.5);
    
    tile // events for drag start
    .on('mousedown', onDragStart)
    .on('touchstart', onDragStart)
    // events for drag end
    .on('mouseup', onDragEnd)
    .on('mouseupoutside', onDragEnd)
    .on('touchend', onDragEnd)
    .on('touchendoutside', onDragEnd)
    // events for drag move
    .on('mousemove', onDragMove)
    .on('touchmove', onDragMove);

    // move the sprite to its designated position
    tile.position.x = x;
    tile.position.y = y;

    return tile;
}

requestAnimationFrame( animate );

function animate() {

    requestAnimationFrame(animate);

    // render the stage
    app.render(app.stage);
}

function onDragStart(event)
{
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
    movedTileX = this.x;
    movedTileY = this.y;
}

function onDragEnd()
{
    this.alpha = 1;

    this.dragging = false;

    // set the interaction data to null
    this.data = null;
    
    if(validMove(this)){
       createPileTile(movedTileX,movedTileY);
        this.interactive = false;
    }
    else {
        this.position.set(movedTileX,movedTileY);
    }
}

function onDragMove()
{
    if (this.dragging)
    {
        var newPosition = this.data.getLocalPosition(this.parent);
        let newRounded = roundPosition(newPosition.x,newPosition.y);
        this.position.set(newRounded[0],newRounded[1]);
    }
}

function roundPosition(x,y){
    //lol this doesn't work quite yet but... one day. it rounds, just doesn't bounce off the edge like i'd like
    let amt = tileSize;
    let roundedX = Math.round(x/amt)*amt;
    let roundedY = Math.round(y/amt)*amt;
//    if(app.view.width - roundedX <= amt) {
//        roundedX -= amt;
//    }
//    if(app.view.height - roundedY <= amt) {
//        roundedY -= amt;
//    }
    return [roundedX, roundedY];
}
function boxesCollide(ab,bb){
    return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
}

function validMove(a){ //um okay don't look too hard at this. for some reason it's backwards what i thought. idk. 
    for(const element of board.children){
        if(boxesCollide(a,element)) return false;
    }
    return true;
}