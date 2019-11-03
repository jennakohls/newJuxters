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
    width: 375,         // default: 800
    height: 667,        // default: 600
    antialias: true,    // default: false
    transparent: false, // default: false
    resolution: 1       // default: 1
  }
);

//auto-resize function from here: https://github.com/kittykatattack/scaleToWindow
      //basically keeps things centered and sized nice. i have not tested this extensively :) 
      window.addEventListener("resize", function(event){ 
          var scale = scaleToWindow(app.renderer.view);
      });


//Add pixi canvas to html document
document.body.appendChild(app.view);
      
      
//load an image and run the `setup` function when it's done
loader
  .add("rss/tileset.json")
  .load(setup);

let a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,blank;
//tiles = new Array(27);
tiles = new Array();
      
//This `setup` function will run when the image has loaded
function setup() {

//this is horrible. eventually i'll make this more efficient.    
a = new Sprite(TextureCache["a.png"]);
    tiles.push(new Sprite(TextureCache["a.png"]));
    app.stage.addChild(a);
b = new Sprite(TextureCache["b.png"]);
    tiles.push(new Sprite(TextureCache["b.png"]));
    app.stage.addChild(b);
c = new Sprite(TextureCache["c.png"]);
    tiles.push(new Sprite(TextureCache["c.png"]));
    app.stage.addChild(c);
d = new Sprite(TextureCache["d.png"]);
    tiles.push(new Sprite(TextureCache["d.png"]));
    app.stage.addChild(d);
e = new Sprite(TextureCache["e.png"]);
    tiles.push(new Sprite(TextureCache["e.png"]));
    app.stage.addChild(e);
f = new Sprite(TextureCache["f.png"]);
    tiles.push(new Sprite(TextureCache["f.png"]));
    app.stage.addChild(f);    
g = new Sprite(TextureCache["g.png"]);
    tiles.push(new Sprite(TextureCache["g.png"]));
    app.stage.addChild(g);   
h = new Sprite(TextureCache["h.png"]);
    tiles.push(new Sprite(TextureCache["h.png"]));
    app.stage.addChild(h);
i = new Sprite(TextureCache["i.png"]);
    tiles.push(new Sprite(TextureCache["i.png"]));
    app.stage.addChild(i);
j = new Sprite(TextureCache["j.png"]);
    tiles.push(new Sprite(TextureCache["j.png"]));
    app.stage.addChild(j);
k = new Sprite(TextureCache["k.png"]);
    tiles.push(new Sprite(TextureCache["k.png"]));
    app.stage.addChild(k);
l = new Sprite(TextureCache["l.png"]);
    tiles.push(new Sprite(TextureCache["l.png"]));
    app.stage.addChild(l);
m = new Sprite(TextureCache["m.png"]);
    tiles.push(new Sprite(TextureCache["m.png"]));
    app.stage.addChild(m);
n = new Sprite(TextureCache["n.png"]);
    tiles.push(new Sprite(TextureCache["n.png"]));
    app.stage.addChild(n);
o = new Sprite(TextureCache["o.png"]);
    tiles.push(new Sprite(TextureCache["o.png"]));
    app.stage.addChild(o);
p = new Sprite(TextureCache["p.png"]);
    tiles.push(new Sprite(TextureCache["p.png"]));
    app.stage.addChild(p);
q = new Sprite(TextureCache["q.png"]);
    tiles.push(new Sprite(TextureCache["q.png"]));
    app.stage.addChild(q);
r = new Sprite(TextureCache["r.png"]);
    tiles.push(new Sprite(TextureCache["r.png"]));
    app.stage.addChild(r);
s = new Sprite(TextureCache["s.png"]);
    tiles.push(new Sprite(TextureCache["s.png"]));
    app.stage.addChild(s);
t = new Sprite(TextureCache["t.png"]);
    tiles.push(new Sprite(TextureCache["t.png"]));
    app.stage.addChild(t);
u = new Sprite(TextureCache["u.png"]);
    tiles.push(new Sprite(TextureCache["u.png"]));
    app.stage.addChild(u);
v = new Sprite(TextureCache["v.png"]);
    tiles.push(new Sprite(TextureCache["v.png"]));
    app.stage.addChild(v);
w = new Sprite(TextureCache["w.png"]);
    tiles.push(new Sprite(TextureCache["w.png"]));
    app.stage.addChild(w);
x = new Sprite(TextureCache["x.png"]);
    tiles.push(new Sprite(TextureCache["x.png"]));
    app.stage.addChild(x);
y = new Sprite(TextureCache["y.png"]);
    tiles.push(new Sprite(TextureCache["y.png"]));
    app.stage.addChild(y);
z = new Sprite(TextureCache["z.png"]);
    tiles.push(new Sprite(TextureCache["z.png"]));
    app.stage.addChild(z);
blank = new Sprite(TextureCache["_blank.png"]);
    tiles.push(new Sprite(TextureCache["_blank.png"]));
    app.stage.addChild(blank);

let tileSz = 64;
  //Render the stage   
createA(32,64 + 32);
    
}

function createA(x,y){
    a.y=64;
    a.interactive = true;
    a.buttonMode = true;
    a.anchor.set(0.5);
    
    a // events for drag start
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
    a.position.x = x;
    a.position.y = y;
}

requestAnimationFrame( animate );

function animate() {

    requestAnimationFrame(animate);

    // render the stage
    renderer.render(stage);
}

function onDragStart(event)
{
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
}

function onDragEnd()
{
    this.alpha = 1;

    this.dragging = false;

    // set the interaction data to null
    this.data = null;
}

function onDragMove()
{
    if (this.dragging)
    {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.position.x = roundPosition(newPosition.x);
        this.position.y = roundPosition(newPosition.y);
    }
}

function roundPosition(x){
    return Math.round(x/10)*10;
}