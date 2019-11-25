//Aliases
let Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.Loader.shared,
    resources = PIXI.Loader.shared.resources,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    Rectangle = PIXI.Rectangle;
      
      
let app = new Application({ 
    width: 384,         // default: 800
    height: 700,        // default: 600
    antialias: true,    // default: false
    transparent: false, // default: false
    resolution: 1,       // default: 1
    backgroundColor: 0xFF00FF // default: 0x000000
  }
);

//This has been checked and does not cause crashing
window.addEventListener("load", function(event){ 
        scale = scaleToWindow(app.renderer.view);
});
      window.addEventListener("resize", function(event){ 
        scale = scaleToWindow(app.renderer.view);
      });

//Add pixi canvas to html document
document.body.appendChild(app.view);

//PIXI.sound.Sound.from({
//    url: 'rss/sound/juxtersBounce2.ogg',
//    autoPlay: true,
//    loop: true,
//    complete: function() {
//        console.log('Sound finished');
//    }
//});

// List of files to load
const manifest = {
    full: 'rss/sound/JuxtersBounce2.ogg',
    highNotes: 'rss/sound/JuxtersBounce1.ogg'
};

// Add
for (let name in manifest) {
    PIXI.Loader.shared.add(name, manifest[name]);
}

PIXI.sound.play('full',{
    autoPlay: true,
    loop: true
})
//load an image and run the `setup` function when it's done
loader
  .add("rss/tileset.json")
  .load(setup);

//let a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,blank;
let letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','_blank','_wall'];
let pileSize = 6;
let boardSize = 8; //square but it gets cut off! :D
let pile = new PIXI.Container();
let board = new PIXI.Container();
let tileSize = 48;
let score = 0;
let tileChance = .8;
let movedTileX = 0;
let movedTileY = 0;

//This `setup` function will run when the image has loaded
function setup() { 
    //make board
    for(let i = 0; i < boardSize; i++){
        for(let j = 0; j < boardSize; j++){
            let tileName = "_blank"
            //Random wall placement
            if (Math.random() > tileChance) {
                tileName = "_wall";
            } 
            let newTile = createTile(tileName,(i * tileSize) + tileSize/2,(j * tileSize) + tileSize/2 + tileSize,false);
            board.addChild(newTile);
            console.log("Initial Tile: ");
            console.log(newTile.x);
            console.log(newTile.y);
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
    //pile.position.set(tileSize/2 + tileSize, (tileSize/2) * 19);
    app.stage.addChild(pile);
    
    //make score
    drawScore();
    
}

function drawScore(){
var graphics = new PIXI.Graphics();
graphics.beginFill(0x000000);
graphics.lineStyle(5, 0xFF00FF);
graphics.drawRect(0,0,8 * tileSize,tileSize);
app.stage.addChild(graphics);

let style = new PIXI.TextStyle({
  //fontFamily: "BlinkMacSystemFont", //this probably won't work on mobile. 
  fontSize: 24,
  fill: "white",
});
    
    let message = new PIXI.Text("Score: " + score.toString(), style);

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
    tile.height = tileSize
    tile.width = tileSize

    tile.interactive = interactable;
    tile.buttonMode = true;
    tile.anchor.set(0.5);

    tile.tileName = name;
    
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
    PIXI.sound.play('highNotes');
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
        console.log("Moved Tile: ");
        console.log(this.x);
        console.log(this.y);
    }
    else {
        this.position.set(movedTileX,movedTileY);
    }
    //This should increase and update score
    incrementScore(this);
    drawScore();
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

function incrementScore(a){//should be a more particular score determination based upon words made in the future
    score += letters.indexOf(a.tileName);
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
function boxesCollide(a,b){
    return a.x + a.width > b.x && a.x < b.x + b.width && a.y + a.height > b.y && a.y < b.y + b.height;
}
function outOfBounds(a){
    return ((a.x < 0 || a.x > 320) || //these are the max and min x values for the board (0 is the visual left, 320 is the visual right) 
        (a.y > -64 || a.y < -512)); //these are the max and min y values for the board (-512 is the visual top of the board, -64 is the visual bottom)
}

function validMove(a){ //um okay don't look too hard at this. for some reason it's backwards what i thought. idk. 
    if (outOfBounds(a)) return false;
    for(const element of board.children){
        if(boxesCollide(a,element)) return false;
    }
    return true;
}