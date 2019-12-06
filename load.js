//Aliases
let Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.Loader.shared,
    resources = PIXI.Loader.shared.resources,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    Rectangle = PIXI.Rectangle;
      
      
let app = new Application({ 
    width: 385,         // default: 800
    height: 700,        // default: 600
    antialias: true,    // default: false
    transparent: false, // default: false
    resolution: 1,       // default: 1
    backgroundColor: 0xCCE5F7 // default: 0x000000
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

// List of files to load
const manifest = {
    full: 'rss/sound/JuxtersBounce2.ogg',
    highNotes: 'rss/sound/JuxtersBounce1.ogg',
    c3: 'rss/sound/c3.ogg',
    d3: 'rss/sound/d3.ogg',
    e3: 'rss/sound/e3.ogg',
    f3: 'rss/sound/f3.ogg',
    g3: 'rss/sound/g3.ogg',
    a3: 'rss/sound/a3.ogg',
    b3: 'rss/sound/b3.ogg',
    c4: 'rss/sound/c4.ogg',
    d4: 'rss/sound/d4.ogg',
    e4: 'rss/sound/e4.ogg',
    f4: 'rss/sound/f4.ogg',
    g4: 'rss/sound/g4.ogg',
    a4: 'rss/sound/a4.ogg',
    b4: 'rss/sound/b4.ogg',
    c5: 'rss/sound/c5.ogg',
    d5: 'rss/sound/d5.ogg',
    e5: 'rss/sound/e5.ogg',
    f5: 'rss/sound/f5.ogg',
    g5: 'rss/sound/g5.ogg',
    a5: 'rss/sound/a5.ogg',
    b5: 'rss/sound/b5.ogg',
    c6: 'rss/sound/c6.ogg',
};

let notesArray = ['c3','d3','e3','f3','g3','a3','b3','c4','d4','e4','f4','g4','a4','b4','c5','d5','e5','f5','g5','a5','b5','c6','c4','d4','e4','f4','g4','a4','b4']; 

// Add
for (let name in manifest) {
    PIXI.Loader.shared.add(name, manifest[name]);
}

const bgmLength = 96; 

//load an image and run the `setup` function when it's done
loader
  .add("rss/tileset.json")
  .load(setup);

let letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','_blank','_wall'];
let scores = [1, 3, 3, 2, 1, 4, 2, 4, 1, 8, 5, 1, 3, 1, 1, 3, 10, 1, 1, 1, 1, 4, 4, 8, 4, 10, 0, 0];
let amounts = [9, 2, 2, 4, 12, 2, 3, 2, 9, 1, 1, 4, 2, 6, 8, 2, 1, 6, 4, 6, 4, 2, 2, 1, 2, 1, 2, 0];
let playedWords = [];
let pile = new PIXI.Container();
let board = new PIXI.Container();
let pileSize = 5;
let boardSize = 7; //square but it gets cut off! :D
let tileSize = 54;
let leftBorder = tileSize / 2;
let rightBorder = (boardSize * tileSize) + leftBorder;
let upBorder = leftBorder + tileSize;
let downBorder = rightBorder + tileSize;
let score = 0;
let tileChance = .8;
let movedTileX = 0;
let movedTileY = 0;
dictionary = {};
dictArr = dict.split('\n');
for (var i = 0; i < dictArr.length; i++) {
    dictionary[dictArr[i]] = true;
}

//This `setup` function will run when the image has loaded
function setup() { 
    //make board
    for(let i = 0; i < boardSize; i++){
        for(let j = 0; j < boardSize; j++){
            let tileName = "_blank"
            //Random wall placement
            if (i == 1 && j == 1 || i == 2 && j == 1 || i == 1 && j == 2 || 
                i == boardSize - 2 && j == boardSize - 2 || i == boardSize - 3 && j == boardSize - 2 || 
                i == boardSize - 2 && j == boardSize - 3 || i == boardSize - 2 && j == 1 ||
                i == 1 && j == boardSize - 2) {
                tileName = "_wall";
            } 
            let newTile = createTile(tileName,(i * tileSize) + tileSize/2,(j * tileSize) + tileSize/2 + tileSize,false);
            board.addChild(newTile);
        }
    }

    var background = PIXI.Sprite.fromImage('rss/background.png');
 
    // center the sprite anchor point
    background.anchor.x = 0;
    background.anchor.y = 0;
     
     
    background.position.x = 0;
    background.position.y = 0;
    app.stage.addChild(background);


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
    
    //set volumes of different octaves
    for (let note of notesArray){
        if(notesArray.indexOf(note) < 7){ //c3 to b3
            PIXI.sound.volume(note, 3);
        } else if(notesArray.indexOf(note) < 14){ //c4 to b4
            PIXI.sound.volume(note, 2);
        } else if(notesArray.indexOf(note) < 21){ //c5 to b5
            PIXI.sound.volume(note, 3);
        } else if(notesArray.indexOf(note) == 21){ //c6 only
            PIXI.sound.volume(note, 4);
        }
        //console.log(note + 'volume: '  + PIXI.sound.volume(note));
    }
    
    loopFunction();
}

function drawScore(){
var graphics = new PIXI.Graphics();
graphics.beginFill(0x74779F);
graphics.lineStyle(5, 0xCCE5F7);
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
    
    let thisNote = notesArray[letters.indexOf(this.tileName)];
    PIXI.sound.play(thisNote);
    
    console.log(this.tileName + ' ' + thisNote + ' volume: ' + PIXI.sound.volume(thisNote));
    
//    let offset = bgmInstance.progress * bgmLength;
//    console.log('offset: ' + offset);
    
}

function onDragEnd()
{
    this.alpha = 1;

    this.dragging = false;

    // set the interaction data to null
    this.data = null;

    let valid = false
    for(var b of board.children){
        if(validMove(this, b)){
            valid = true
            createPileTile(movedTileX,movedTileY);

            //Access tile in location and change its tileName to the new tile
            this.interactive = false;
            board.removeChild(b);
            //This is a super weird way to put the tile into the board structure, but it was the only way I could make it work
            //Trying to just have board.addChild(this) was giving me some super weird errors - Owen
            let newTile = createTile(this.tileName, this.getGlobalPosition().x, this.getGlobalPosition().y, false); 
            board.addChild(newTile);

            incrementScore(this);
            drawScore();        
        }
    }

    if (!valid) this.position.set(movedTileX,movedTileY);
    
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
function inRow(a, b) {
    let ax = a.getGlobalPosition().x;
    let bx = b.getGlobalPosition().x;
    return ax + a.width > bx && ax < bx + b.width;
}
function inColumn(a, b) {
    let ay = a.getGlobalPosition().y;
    let by = b.getGlobalPosition().y;
    return ay + a.height > by && ay < by + b.height;
}
function incrementScore(a){//should be a more particular score determination based upon words made in the future
    //check rows and columns
    let row = [];
    let rowWord = "";
    let column = [];
    let colWord = "";
    for (const b of board.children) {
        if (inRow(a, b)) {
            row.push(b.tileName);
        } 
        if (inColumn(a, b)) {
            column.push(b.tileName);
        }
    }
    console.log(row);
    console.log(column);
    for (var i = 0; i < row.length; i++) {
        //add the next letter or break up the word
        if (row[i] == "_blank" || row[i] == "_wall") {
            rowWord == "";
        } else {
            rowWord += row[i];
            //if rowWord in dictionary and not in playedWords
            if (!playedWords.includes(rowWord) && dictionary[rowWord]) {
                playedWords.push(rowWord);
                console.log(rowWord);
                saveWordSong(rowWord);
                for (var j = 0; j < rowWord.length - 1; j++) {
                    score += scores[letters.indexOf(rowWord[j])];
                    console.log(rowWord[j]);
                    console.log(scores[letters.indexOf(rowWord[j])]);
                }
            }
        }
    }
    for (var i = 0; i < column.length; i++) {
        //add the next letter or break up the word
        if (column[i] == "_blank" || column[i] == "_wall") {
            colWord == "";
        } else {
            colWord += column[i];
            //if colWord in dictionary and not in playedWords
            if (!playedWords.includes(colWord) && dictionary[colWord]) {
                playedWords.push(colWord);
                console.log(colWord);
                saveWordSong(colWord);
                for (var j = 0; j < colWord.length - 1; j++) {
                    score += scores[letters.indexOf(colWord[j])];
                }
            }
        }
    }
    
}

function saveWordSong(word) {
    let newPhrase = [];
    
    for (let letter of word){
        let thisNote = notesArray[letters.indexOf(letter)];
        newPhrase.push(thisNote);
        console.log('put: ' + thisNote + 'in newPhrase');
        }
    
    phraseArray.push(newPhrase);
    console.log('put: ' + newPhrase + 'in phraseArray');
    
    let offset = bgmInstance.progress * bgmLength;
    console.log('offset: ' + offset);
    phraseArrayOffets.push(offset);
}

function roundPosition(x,y){
    //lol this doesn't work quite yet but... one day. it rounds, just doesn't bounce off the edge like i'd like
    let roundedX = Math.round(x/tileSize)*tileSize;
    let roundedY = Math.round(y/tileSize)*tileSize;

    return [roundedX, roundedY];
}

function boxesCollide(a, b){
    return inRow(a, b) && inColumn(a, b);
}

function outOfBounds(a){
    let ax = a.getGlobalPosition().x;
    let ay = a.getGlobalPosition().y;
    
    return ((ax < leftBorder || ax > rightBorder) || (ay > upBorder || ay < downBorder));
}

function validMove(a, b){  
    //if (outOfBounds(a)) return false;
    if (boxesCollide(a, b)){
        if (a.tileName == "_blank"){
            return (b.tileName != "_blank" && b.tileName != "_wall");
        } else {
            return (b.tileName == "_blank");
        }
    }
    return false;
}

var phraseArrayTest = [['c5', 'c4'], ['a3', 'b3'], ['d3','f3','a4']]; 
var phraseArray = [];
var phraseArrayOffets = [];

var bgmInstance;

function loopFunction() {
    if(phraseArray.length > 0) { phraseLoop(0, phraseArray.length - 1); }
    
    bgmInstance = PIXI.sound.play('full',{
        autoPlay:true,
        volume: 0.8,
        complete:loopFunction
    });
    
}

function phraseLoop(i, n) {
    let phraseLength = phraseArray[i].length;
    let phraseOffset = phraseArrayOffets[i] * 1000;
    //let phraseOffset = 0;
    noteLoop(0, phraseLength - 1, i);
    console.log('looped: ' + i);
    if (i < n) {
        setTimeout(function() {
            phraseLoop(i+1, n);
        }, phraseLength * 1000);
    }
};

function noteLoop(i, n, whichPhrase){
    let noteLength = 0.9;//i think this makes more sense then letting the full 2 seconds play
    PIXI.sound.play(phraseArray[whichPhrase][i]);
    if (i < n) {
        setTimeout(function() {
            noteLoop(i+1, n, whichPhrase);
        }, noteLength * 1000);
    } 
}
