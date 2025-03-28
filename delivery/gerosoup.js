//===============================================
// Javascript Extensions 
//===============================================

const PI = Math.PI;
const TAU = Math.PI*2;
let fps = 0;
let fpsCounter = 0;

setInterval(function(){
    fps = fpsCounter;
    fpsCounter = 0;
},1000);

Math.lerp = function(a,b,n){
    return (1-n)*a+n*b;
}

Math.sigmoid = function(z){
    const k = 2;
    return 1 / (1 + Math.exp(-z/k));
}

Array.prototype.pushUnique = function(a){
    if(this.includes(a)){
        return this.length;
    }
    return this.push(a);
}

Array.prototype.remove = function(item){
    const i = this.indexOf(item);
    if(i != -1){
        this.splice(i,1);
        return true;
    }
    return false;
}

window.addEventListener('contextmenu',function(e){
    e.preventDefault();
    return false;
})

const __cachedImages = {};
let Touched = false;

const dummyImageSource = createDummyImage();

function createDummyImage(c="#f80",w=16,h=16){
    const canvas =document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = c;
    ctx.fillRect(0,0,canvas.width,canvas.height);
    return canvas.toDataURL();
}

let TouchScreenSupport = navigator.maxTouchPoints > 0;

function loadImage(url){
    if(__cachedImages[url]){
        return __cachedImages[url];
    }else{

        const image = new Image();
        /*
        const img = new Image();
        img.onerror = function(){
            console.error("Failed to load image "+url)
        };
        img.onload = function(){
            image.src = url;
        }

        img.src = url;
        */

        image.onerror = function(){
            image.src = createDummyImage();
        }
        
        image.src = url//dummyImageSource;

        __cachedImages[url] = image;
        return image;
    }
}

function isPointInsideRect(x,y,rx,ry,rw,rh){

    if(x < rx){
        return false;
    }
    
    if(y < ry){
        return false;
    }

    if(x > rx + rw){
        return false;
    }

    if(y > ry + rh){
        return false;
    }

    return true;

}
//===============================================
// Time
//===============================================

const Time = {
    seconds:0
};

//===============================================
// Canvas Extensions 
//===============================================

CanvasRenderingContext2D.prototype.fillCircle = function(x,y,r){
    this.beginPath();
    this.arc(x,y,r,0,TAU);
    this.fill();
}

CanvasRenderingContext2D.prototype.strokeCircle = function(x,y,r){
    this.beginPath();
    this.arc(x,y,r,0,TAU);
    this.stroke();
}

//===============================================
// Vector2 
//===============================================

function Vector2(x,y){
    this.x = x;
    this.y = y;
}

Vector2.prototype.directionTo = function(b){
    return this.duplicate().sub(b).normalize();
}

Vector2.prototype.angleTo = function(b){
    return Math.atan2(b.x-this.x,b.y-this.y);
    //this doesn't work? or returns something else? I'm lost lol
    return Math.atan2(this.cross(b),this.dot(b));
}

Vector2.prototype.cross = function(b){
    return this.x * b.y - this.y * b.x;
}

Vector2.prototype.dot = function(b){
    return this.x * b.x + this.y * b.y;
}

Vector2.prototype.toString = function(){
    return `X:${this.x}, Y:${this.y}`;
}

Vector2.prototype.length = function(){
    return Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2));
}

Vector2.prototype.normalize = function(){
    const l = this.length();
    this.x /= l;
    this.y /= l;
    return this;
}

Vector2.prototype.distanceSquaredTo = function(v2){
    return Math.pow(v2.x-this.x,2) + Math.pow(v2.y-this.y,2);
};

Vector2.prototype.distanceTo = function(v2){
    return Math.sqrt(this.distanceSquaredTo(v2));
}

Vector2.prototype.directionTo = function(v2){
    const output = v2.duplicate();
    output.sub(this);
    output.normalize();
    return output;
}

Vector2.prototype.duplicate = function(){
    return new Vector2(this.x,this.y);
};

Vector2.prototype.normalized = function(){
    return this.duplicate().normalize();
}

Vector2.prototype.dot = function(other){
    return this.x * other.x + this.y * other.y;
}

Vector2.prototype.add = function(other){
    this.x += other.x;
    this.y += other.y;
    return this;
}

Vector2.prototype.sub = function(other){
    this.x -= other.x;
    this.y -= other.y;
    return this;
}

Vector2.prototype.mul = function(other){
    this.x *= other.x;
    this.y *= other.y;
    return this;
}

Vector2.prototype.fmul = function(n){
    this.x *= n;
    this.y *= n;
    return this;
}

const V2 = {
    left:new Vector2(-1,0),
    right:new Vector2(1,0),
    up:new Vector2(0,-1),
    down:new Vector2(0,1),
    zero:new Vector2(0,0)
}

V2.cardinal = [
    V2.left,V2.right,V2.up,V2.down
]


//===============================================
// Camera
//===============================================

function Camera(position=new Vector2(0,0)){
    this.position = position;
    this.scale = new Vector2(1,1);
    this.offset = new Vector2(0,0);
}

Camera.prototype.apply = function(ctx,offsetX=0,offsetY=0){
	this.offset.x = -this.position.x+offsetX;
	this.offset.y = -this.position.y+offsetY;
    ctx.translate(this.offset.x,this.offset.y);
    ctx.scale(this.scale.x,this.scale.y);
}

Camera.prototype.remove = function(ctx){
    ctx.scale(1/this.scale.x,1/this.scale.y);
    ctx.translate(-this.offset.x,-this.offset.y);
}


//===============================================
// Input System
//===============================================

const Input = {}
const Mouse = {
    position:new Vector2(-1,-1)
};
const Keys = {};

const MouseButtons = ['left','middle','right'];

const Touch = [];

window.addEventListener('touchstart',function(e){
	Touched = true
	Mouse.left = true;
	Mouse.position.x = e.touches[0].clientX;
	Mouse.position.y = e.touches[0].clientY;
},false);

window.addEventListener('touchend',function(e){
	if(e.touches.length === 0){
		Mouse.left = false;
	}
},false);

window.addEventListener('touchmove',function(e){
	Mouse.position.x = e.touches[0].clientX;
	Mouse.position.y = e.touches[0].clientY;
},false);

window.addEventListener('keydown',function(e){
    if (!Keys[e.key]){
        Signals.emit('keydown',e.key);
    }
    Keys[e.key] = true; //.key is case sensative .code is not
    Keys[e.code] = true
},false);

window.addEventListener('keyup',function(e){
    if (Keys[e.key]){
        Signals.emit('keyup',e.key);
    }
    Keys[e.key] = false;
    Keys[e.code] = false;
},false);


window.addEventListener('mousedown',function(e){
    Mouse[MouseButtons[e.button]] = true;
    Mouse.position.x = e.clientX;
    Mouse.position.y = e.clientY;
    Signals.emit('mousedown')
},false);

window.addEventListener('mouseup',function(e){
    Mouse[MouseButtons[e.button]] = false;
    Signals.emit('mouseup')
},false);

window.addEventListener('mousemove',function(e){
    Mouse.position.x = e.clientX;
    Mouse.position.y = e.clientY;
},false);

//===============================================
// Canvas / Camera System
//===============================================

function Viewport(width,height){

    this.width = width;
    this.height = height;

    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.mouse = new Vector2(0,0);
    
    this.canvas.height = height;
    this.scene;
    this.ctx = this.canvas.getContext('2d');

    document.body.appendChild(this.canvas);

    this.scaling = 0;
    
    this.Scaling = {
        nearestNeighbor:0,
        bilinear:1
    };

	if(!this.width && !this.height){
		const self = this;
		window.addEventListener('resize',() => {
			self.resize(window.innerWidth,window.innerHeight);
		},false);
		self.resize(window.innerWidth,window.innerHeight);
	}

   this.canvas.addEventListener('mousedown',(e) => {
       this.mouse[MouseButtons[e.button]] = true;
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        const c = this.scene.camera

        this.mouse.x = (e.clientX - rect.left) * scaleX  + c.position.x;
        this.mouse.y = (e.clientY - rect.top) * scaleY  + c.position.y;
        this.mouse.x /= c.scale.x;
        this.mouse.y /= c.scale.y;

    },false);
    
   this.canvas.addEventListener('mouseup',(e) => {
       this.mouse[MouseButtons[e.button]] = false;
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        const c = this.scene.camera

        this.mouse.x = (e.clientX - rect.left) * scaleX  + c.position.x;
        this.mouse.y = (e.clientY - rect.top) * scaleY  + c.position.y;
        this.mouse.x /= c.scale.x;
        this.mouse.y /= c.scale.y;

    },false);
    
    this.canvas.addEventListener('mousemove',(e) => {

        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        const c = this.scene.camera

        this.mouse.x = (e.clientX - rect.left) * scaleX  + c.position.x;
        this.mouse.y = (e.clientY - rect.top) * scaleY  + c.position.y;
        this.mouse.x /= c.scale.x;
        this.mouse.y /= c.scale.y;

        //this.mouse.x /= this.scene.camera.scale.x;
        //this.mouse.y /= this.scene.camera.scale.y;
        //this.mouse.x += this.canvas.offsetLeft / this.scene.camera.scale.x;
        //this.mouse.y += this.canvas.offsetTop;
    });

      this.canvas.addEventListener('touchstart',(e) => {
      	Touched = true
       	this.mouse.left = true;
       	e = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        const c = this.scene.camera

        this.mouse.x = (e.clientX - rect.left) * scaleX  + c.position.x;
        this.mouse.y = (e.clientY - rect.top) * scaleY  + c.position.y;
        this.mouse.x /= c.scale.x;
        this.mouse.y /= c.scale.y;

    },false);


    this.canvas.addEventListener('touchend',(e) => {
		if(e.touches.length === 0){
			this.mouse.left = false;
		}
	});
    
    this.canvas.addEventListener('touchmove',(e) => {

		e = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        const c = this.scene.camera

        this.mouse.x = (e.clientX - rect.left) * scaleX  + c.position.x;
        this.mouse.y = (e.clientY - rect.top) * scaleY  + c.position.y;
        this.mouse.x /= c.scale.x;
        this.mouse.y /= c.scale.y;

        //this.mouse.x /= this.scene.camera.scale.x;
        //this.mouse.y /= this.scene.camera.scale.y;
        //this.mouse.x += this.canvas.offsetLeft / this.scene.camera.scale.x;
        //this.mouse.y += this.canvas.offsetTop;
    });
}

Viewport.prototype.render = function(ctx){
    //ctx.fillCircle(this.mouse.x,this.mouse.y,1);
}

Viewport.prototype.clear = function(){
    this.ctx.clearRect(0,0,this.width,this.height);
}

Viewport.prototype.resize = function(w=0,h=0){
    this.width = w;
    this.height = h;
    this.canvas.width = w;
    this.canvas.height = h;
    Signals.emit('viewport_resize',this);
    this.setScaling(this.scaling);
}

Viewport.prototype.setScaling = function(n){
    this.scaling = n;
    switch (this.scaling)
    {
        case this.Scaling.nearestNeighbor:
            this.ctx.mozImageSmoothingEnabled = false;
            this.ctx.webkitImageSMoothingEnabled = false;
            this.ctx.imageSmoothingEnabled = false;
            break;
        case this.Scaling.bilinear:
            this.ctx.mozImageSmoothingEnabled = true;
            this.ctx.webkitImageSMoothingEnabled = true;
            this.ctx.imageSmoothingEnabled = true;
        default:
            break;
    }
}

//===============================================
// Signal System
//===============================================

const Signals = {
    signals:{},
    disconnect:function(){

    },
    connect:function(signal,callback){
        if(!this.signals[signal]){
            this.signals[signal] = [];
        }
        this.signals[signal].push(callback);
    },
    emit:function(signal,...args){
        if(this.signals[signal]){
            for(let s of this.signals[signal]){
                s(...args);
            }
        }
    }
}

//===============================================
// Grid
//===============================================

function Grid(gridWidth,gridHeight,tileWidth,tileHeight){
    
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.data = [];

    for(let x = 0; x <this.gridWidth; x++){
        this.data.push([]);
        for(let y = 0; y < this.gridHeight; y++){
            this.data[x][y] = 0;
        }
    }
    
    Groups.add('grid',this);

    Signals.connect('resizeAllGrids',(w,h) => {
        
        const newData = [];

        this.gridWidth = w;
        this.gridHeight = h;

        for(let x = 0; x <this.gridWidth; x++){
           newData.push([]);
            for(let y = 0; y < this.gridHeight; y++){
               newData[x][y] = this.get(x,y,-1);
            }
        }

        this.data = newData;
        console.log('resize grid');
    })

}

Grid.prototype.raycastWorld = function(startX,startY,dir,distanceLimit,stepSize=1.0){

	const dirX = Math.sin(dir) * stepSize;
	const dirY = Math.cos(dir) * stepSize;

	let dis = 0
	
	let [gx,gy] = this.toGrid(startX,startY);
	
	while(!this.isSolid(gx,gy) && dis < distanceLimit){
		startX += dirX;
		startY += dirY;
		dis += stepSize;
		[gx,gy] = this.toGrid(startX,startY);
	}

	return [startX,startY,dis];
}

Grid.prototype.floodfill = function(startX,startY,visitedCallback){
    const self = this;

    let frontlines = [[startX,startY,0]];
    let visited = {};

    function add(x,y,n){
        
        if(self.isSolid(x,y)){
            return;
        }
        
        const id = x+':'+y;
        
        if( visited[id] === undefined ){
            frontlines.push([x,y,n]);
            self.data[x][y] = n;
        }

        visited[id] = n;
    }

    while(frontlines.length > 0){
        const next = frontlines.shift();
        add(next[0]+1,next[1],next[2]+1);
        add(next[0]-1,next[1],next[2]+1);
        add(next[0],next[1]+1,next[2]+1);
        add(next[0],next[1]-1,next[2]+1);
    }
}

Grid.prototype.toGrid = function(x,y){
	return [Math.floor(x/this.tileWidth),Math.floor(y/this.tileHeight)];
}

Grid.prototype.toWorld = function(x,y){
	return [x * this.tileWidth ,y*this.tileHeight];
}

Grid.prototype.floodfillFunction = function(startX,startY,callback,isSolid=this.isSolid){
    const self = this;

    let frontlines = [[startX,startY,0]];
    let visited = {};

    visited[startX+':'+startY] = 0;

    function add(x,y,n){
        
        if(isSolid(x,y)){
            return;
        }
        
        const id = x+':'+y;

        if( visited[id] === undefined ){
            visited[id] = n;
            frontlines.push([x,y,n]);
            callback(x,y,n);
        }

    }

    while(frontlines.length > 0){
        const next = frontlines.shift();
        add(next[0]+1,next[1],next[2]+1);
        add(next[0]-1,next[1],next[2]+1);
        add(next[0],next[1]+1,next[2]+1);
        add(next[0],next[1]-1,next[2]+1);
    }
}

Grid.prototype.moveCheck = function(currentPosition,direction){
    //#todo raycast me!
    if(!this.isSolid(currentPosition.x + direction.x,currentPosition.y + direction.y)){
        currentPosition.add(direction);
    }
};

Grid.prototype.get = function(x,y,def=-1){
    
    if(isNaN(x) || isNaN(y)){
        console.error(x,y);
    }

    if( x < 0 || x >= this.data.length){
        return def;
    }

    if(!this.data[x]){ // WHY IS THIS NEEDED?
        return def;
    }
    
    if(y < 0 || y >= this.data[x].length){
        return def;
    }

    return this.data[x][y];
}

Grid.prototype.add = function(x,y,v){
    const n = this.get(x,y,false);
    if(n !== false){
        this.set(x,y,n+v);
    }
}

Grid.prototype.setAll = function(v){
    for(let x = 0; x < this.gridWidth; x++){
        for(let y = 0; y < this.gridHeight; y++){
            this.data[x][y] = v;
        }
    }
}

Grid.prototype.set = function(x,y,v){
    if(x >= this.data.length || x < 0){
        return false;
    }

    if(!this.data[x]){ // WHY IS THIS NEEDED?
        return false;
    }
    
    if(y >= this.data[x].length || y < 0){
        return false;
    }

    this.data[x][y] = v;
    return true;
}

Grid.prototype.isSolid = function(x,y){
    if(x >= this.data.length || x < 0){
        //#todo Signal to try and leave map
        return true;
    }
    
    if(y >= this.data[x].length || y < 0){
        //#todo Signal to try and leave map
        //Grid.canLeaveLocalGrid
        //Grid.worldGrid? or something? lol
        return true;
    }

    if(this.data[x][y] === 0){
        return false;
    }

    return true;

}

Grid.prototype.render = function(ctx){
    const w = this.tileWidth;
    const h = this.tileHeight;
    for(let x = 0; x < this.gridWidth; x++){
        for(let y = 0; y < this.gridHeight; y++){
          this.renderTile(ctx,x,y,this.data[x][y],w,h);
        }
    }
}

Grid.prototype.renderTile = function(ctx,x,y,v,w,h){
    ctx.strokeRect(x*w,y*h,w,h);
    ctx.fillText(v,x*w+w*0.5,y*h+h*0.5);
}


Grid.prototype.findPath = function(sx,sy,gx,gy){

	if(sx === gx && sy === gy){
		return [];
	}

	let frontlines = [];

	class Entry{
		x = 0
		y = 0
		distance = 0
		last = null 
		constructor(x,y,dis,last){
			this.x = x;
			this.y = y;
			this.distance = dis;
			this.last = last;
		}
	}

    frontlines.push(new Entry(sx,sy,0,false));

	let visited = {};

	function add(x,y,n,last){
	    const id = x+':'+y;
	    if(grid.isSolid(x,y)){
	    	visited[id] = true;
	        return;
	    }
	    if( !visited[id]){
	        frontlines.push(new Entry(x,y,n,last));
	    }
	    visited[id] = true;
	}
	let c = 0;
	while(frontlines.length > 0 && c < 5000){
		c++;
	    const next = frontlines.shift();
	    if(next.x === gx && next.y === gy){
	    	let output = [];
	    	let n = next;
	    	while(n.last){
	    		output.push(new Vector2(n.x,n.y));
	    		n = n.last;
	    	}
	    	output.reverse();
	    	return output;
	    }else{
		    add(next.x+1,next.y,next.distance+1,next);
		    add(next.x-1,next.y,next.distance+1,next);
		    add(next.x,next.y+1,next.distance+1,next);
		    add(next.x,next.y-1,next.distance+1,next);
	    }
	}
	return [];
}


//===============================================
// Scene
//===============================================

function Scene(viewport){
    this.lastTime = Date.now();
    this.paused = true;
    this.delta = 0.0;
    this.timescale = 1.0;
    viewport.scene = this;
    this.nodesUpdate = [];
    this.nodesRender = [];
    this.nodesRenderUI = [];

    this.viewport = viewport;

    this.loop();
    this.camera = new Camera(new Vector2(0,0));
    this.BackgroundTypes = {
        'clear':0,
        'color':1,
        'persist':2
    };
    this.backgroundType = 0;
    this.backgroundColor = '#f80';
}

Scene.prototype.start = function(){
    this.paused = false;
}

Scene.prototype.add = function(node){
    
    if(node.update){
        this.nodesUpdate.push(node);
    }
    
    if(node.render){
        this.nodesRender.push(node);
    }
    
    if(node.renderUI){
        this.nodesRenderUI.push(node);
    }
    
    if(node.onReady){
        node.onReady(this);
    }

}

Scene.prototype.clear = function(){
    this.nodesRenderUI = [];
    this.nodesUpdate = [];
    this.nodesRender = [];
}

Scene.prototype.remove = function(node){
    if(node.update){
        const i = this.nodesUpdate.indexOf(node);
        if(i > -1){
            this.nodesUpdate.splice(i,1);
        }
    }
    if(node.render){
        const i = this.nodesRender.indexOf(node);
        if(i > -1){
            this.nodesRender.splice(i,1);
        }
    }
    if(node.renderUI){
        const i = this.nodesRenderUI.indexOf(node);
        if(i > -1){
            this.nodesRenderUI.splice(i,1);
        }
    }
}

Scene.prototype.updateAll = function(delta){
    for(let node of this.nodesUpdate){
        node.update(delta);
    }
}

Scene.prototype.loop = function(time){
    
    const self = this;
    requestAnimationFrame(self.loop.bind(this));
    
    if(this.paused){
        return;
    }

    const now = Date.now();
    const delta = ((now - this.lastTime) / 1000) * this.timescale;
    this.lastTime = now;
    this.delta =delta;
    Time.seconds += delta;
    this.tick(delta);
}

Scene.prototype.beforeUpdate = function(delta){}
Scene.prototype.afterUpdate = function(delta){}
Scene.prototype.beforeRender = function(ctx){};
Scene.prototype.afterRender = function(ctx){};
Scene.prototype.renderAll = function(ctx){
    for(let node of this.nodesRender){
        /*
        ctx.globalAlpha = 0.5;
        ctx.translate(0,1);
        node.render(ctx);
        ctx.globalAlpha = 1;
        ctx.translate(0,-1);
        */
        node.render(ctx);
    }
}
Scene.prototype.tick = function(delta){
    fpsCounter += 1;
    const ctx = this.viewport.ctx;

    this.beforeUpdate(delta);
    this.updateAll(delta);
    this.afterUpdate(delta);
   
    switch (this.backgroundType) {
        case this.BackgroundTypes.clear:
            ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
            break;
        case this.BackgroundTypes.color:
            ctx.fillStyle = this.backgroundColor;
            ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
        default:
            break;
    }
    
    this.camera.apply(ctx);
    this.beforeRender(ctx)
    this.renderAll(ctx);
    this.afterRender(ctx)
    this.camera.remove(ctx);
    
    for(let node of this.nodesRenderUI){
        node.renderUI(ctx);
    }

}

//===============================================
// UI System
//===============================================

function StringToMatchType(newValue,matchtype){
	const type = typeof(matchtype);
	if(type === 'number'){
		return parseFloat(newValue,10); 
	}else if(type === 'object'){
		if(Array.isArray(matchtype)){
			return newValue.split(',');	
		}else{
			console.error('key/values not supported yet!');
		}
	}else{
		return newValue;
	}
}

class GRUI{
    x = 0;
    y = 0;
    viewport;
    buttonWidth = 40;
    buttonHeight = 20;
    offsetDirection = new Vector2(0,1)
    color1 = '#000'
    color2 = '#fff'
    spacing = 1.5
    font = 'arial'
    fontSize = 16
    setFontSize(n){
    	this.fontSize = n;
		this.applyFont();
	}
	flipDirection(){
		this.offsetDirection.x = 1 - this.offsetDirection.x;
		this.offsetDirection.y = 1 - this.offsetDirection.y;
	}
	flipDir(){
		this.flipDirection();
	}
	setFont(n){
		this.font = n;
		this.applyFont();
	}
    applyFont(){
   		this.viewport.ctx.font = this.fontSize +'px '+ this.font;
    }
    constructor(viewport){
        this.viewport = viewport;
    }
    flipColors(){
        const c = this.color1;
        this.color1 = this.color2;
        this.color2 = c;
    }
    labeledInput(key,value,obj,nx=this.x,ny=this.y){
        const ctx = this.viewport.ctx;
        this.x = nx;
        this.y = ny;
        let inside = false;
		const type = typeof(value);
		if(type === 'function'){
			this.button(key+"()");
			return;
		}else{
			this.textBGInverted(key,nx.ny);
		}
		
		if(type === 'object'){
			if(!Array.isArray(value)){
				this.x += this.buttonWidth * 0.25;
				for(let k2 in value){
					this.labeledInput(k2,value[k2],value);
				}
			}else{
				this.x += this.buttonWidth * 0.25;
				for(let i = 0; i < value.length; i++){
					if(this.button(value[i])){
						value[i] = StringToMatchType(prompt("new value? #todo custom input"),value[i]);
					}
				}
			}
		}else if(type === 'function'){
			
		}else{
			if(this.button(value.toString(),nx+this.buttonWidth * this.spacing,ny)){
				let newValue = prompt('new value? #todo custom input'); 
				obj[key] = StringToMatchType(newValue,obj[key]);
			}
		}
        this.x = nx;
        //this.y += this.buttonHeight * this.offsetDirection.y * this.spacing;
        this.x += this.buttonWidth * this.offsetDirection.x * this.spacing;
        return Mouse.left && inside;
    }
	buttonImage(img,nx=this.x,ny=this.y,w,h,r=0){
        const ctx = this.viewport.ctx;
		w = w || img.width;
		h = h || img.height;
		let inside = false;
		if(isPointInsideRect(Mouse.position.x,Mouse.position.y,this.x,this.y,w,h)){
			ctx.drawImage(img,nx,ny,w,h);
			inside = true;
		}else{
			ctx.globalAlpha = 0.5;
			ctx.drawImage(img,nx,ny,w,h);
			ctx.globalAlpha = 1.0;
		}
		this.x += w * this.offsetDirection.x * this.spacing;
		this.y += h * this.offsetDirection.y * this.spacing;
		return Mouse.left && inside;
	}
    buttonInvert(text,nx=this.x,ny=this.y){
        const ctx = this.viewport.ctx;
        this.x = nx;
        this.y = ny;
        let inside = false;
        if(isPointInsideRect(Mouse.position.x,Mouse.position.y,this.x,this.y,this.buttonWidth,this.buttonHeight)){
            ctx.fillStyle = this.color2;
            ctx.fillRect(this.x,this.y,this.buttonWidth,this.buttonHeight);
            ctx.fillStyle = this.color1;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text,this.x+this.buttonWidth*0.5,this.y+this.buttonHeight*0.5);
            inside = true;
        }else{
            ctx.fillStyle = this.color1;
            ctx.fillRect(this.x,this.y,this.buttonWidth,this.buttonHeight);
            ctx.strokeStyle = this.color2;
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.strokeRect(this.x+0.5,this.y+0.5,this.buttonWidth,this.buttonHeight);
			ctx.fillStyle = this.color2;
            ctx.fillText(text,this.x+this.buttonWidth*0.5,this.y+this.buttonHeight*0.5)
        }
        this.y += this.buttonHeight * this.offsetDirection.y * this.spacing;
        this.x += this.buttonWidth * this.offsetDirection.x * this.spacing;
        return Mouse.left && inside;
    }
    button(text,nx=this.x,ny=this.y){
        const ctx = this.viewport.ctx;
        this.x = nx;
        this.y = ny;
        let inside = false;
        if(isPointInsideRect(Mouse.position.x,Mouse.position.y,this.x,this.y,this.buttonWidth,this.buttonHeight)){
            ctx.fillStyle = this.color1;
            ctx.fillRect(this.x,this.y,this.buttonWidth,this.buttonHeight);
            ctx.fillStyle = this.color2;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text,this.x+this.buttonWidth*0.5,this.y+this.buttonHeight*0.5);
            inside = true;
        }else{
            ctx.fillStyle = this.color2;
            ctx.fillRect(this.x,this.y,this.buttonWidth,this.buttonHeight);
            ctx.strokeStyle = this.color1;
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.strokeRect(this.x+0.5,this.y+0.5,this.buttonWidth,this.buttonHeight);
			ctx.fillStyle = this.color1;
            ctx.fillText(text,this.x+this.buttonWidth*0.5,this.y+this.buttonHeight*0.5)
        }
        this.y += this.buttonHeight * this.offsetDirection.y * this.spacing;
        this.x += this.buttonWidth * this.offsetDirection.x * this.spacing;
        return Mouse.left && inside;
    }
    textOutline(text,nx=this.x,ny=this.y){
        const ctx = this.viewport.ctx;
        this.x = nx;
        this.y = ny;

        ctx.fillStyle = this.color2;
        ctx.fillRect(this.x,this.y,this.buttonWidth,this.buttonHeight);
        ctx.strokeStyle = this.color1;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.strokeRect(this.x+0.5,this.y+0.5,this.buttonWidth,this.buttonHeight);
		ctx.fillStyle = this.color1;
        ctx.fillText(text,this.x+this.buttonWidth*0.5,this.y+this.buttonHeight*0.5)

        this.y += this.buttonHeight * this.offsetDirection.y * this.spacing;
        this.x += this.buttonWidth * this.offsetDirection.x * this.spacing;
    }
    textBG(text,nx=this.x,ny=this.y){
        const ctx = this.viewport.ctx;
        this.x = nx;
        this.y = ny;

        ctx.fillStyle = this.color2;
        const size = ctx.measureText(text);
        //const height = Math.abs(size.actualBoundingBoxAscent + size.actualBoundingBoxDescent);
        //const width = size.width;
        const width = this.buttonWidth;
        const height = this.buttonHeight;
        ctx.fillRect(
			this.x,
			this.y,
        	width,
        	height
       	);
        ctx.fillStyle = this.color1;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text,this.x+width*0.5,this.y+height*0.5);

        this.y += this.buttonHeight * this.offsetDirection.y;
        this.x += this.buttonWidth * this.offsetDirection.x;
    }
    textBGInverted(text,nx=this.x,ny=this.y){
        const ctx = this.viewport.ctx;
        this.x = nx;
        this.y = ny;

        ctx.fillStyle = this.color1;
        const size = ctx.measureText(text);
        //const height = Math.abs(size.actualBoundingBoxAscent + size.actualBoundingBoxDescent);
        //const width = size.width;
        const width = this.buttonWidth;
        const height = this.buttonHeight;
        ctx.fillRect(
			this.x,
			this.y,
        	width,
        	height
       	);
        ctx.fillStyle = this.color2;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text,this.x+width*0.5,this.y+height*0.5);

        this.y += this.buttonHeight * this.offsetDirection.y;
        this.x += this.buttonWidth * this.offsetDirection.x;
    }
    text(text,nx=this.x,ny=this.y){
        const ctx = this.viewport.ctx;
        this.x = nx;
        this.y = ny;
        ctx.fillStyle = this.color1;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(text,this.x,this.y);
        this.y += this.buttonHeight * this.offsetDirection.y * this.spacing;
        this.x += this.buttonWidth * this.offsetDirection.x * this.spacing;
    }
    progressBar(percent=1.0,x=this.x,y=this.y){
        const ctx = this.viewport.ctx;
        ctx.fillStyle = this.color1;
        ctx.strokeStyle = this.color1;
        ctx.fillRect(x,y,this.buttonWidth*percent,this.buttonHeight);
        ctx.strokeRect(x,y,this.buttonWidth,this.buttonHeight);
        this.y += this.buttonHeight * this.offsetDirection.y * this.spacing;
        this.x += this.buttonWidth * this.offsetDirection.x * this.spacing;
    }
    slider(percent=1.0,x=this.x,y=this.y){

        const ctx = this.viewport.ctx;
        ctx.fillStyle = this.color1;
        ctx.strokeStyle = this.color1;
        
        this.x = x;
        this.y = y;

        if(Mouse.left && isPointInsideRect(Mouse.position.x,Mouse.position.y,this.x,this.y,this.buttonWidth,this.buttonHeight)){
            percent = (Mouse.position.x - this.x) / this.buttonWidth;
        }

        ctx.fillRect(x,y,this.buttonWidth*percent,this.buttonHeight);
        
        ctx.lineWidth = 3.0;
        ctx.strokeRect(x,y,this.buttonWidth,this.buttonHeight);

        this.y += this.buttonHeight * this.offsetDirection.y * this.spacing;
        this.x += this.buttonWidth * this.offsetDirection.x * this.spacing;
        return percent;
    }
}

//===============================================
// Framework
//===============================================

Framework = {
    activeScene:null,
    activeCamera:null
};


//===============================================
// Groups
//===============================================

const Groups = {
    groups:{},
    loop:function(group,callback){
        if(this.groups[group]){
            for(let item of this.groups[group]){
                callback(item);
            }
        }
    },
    get:function(group){
        return this.groups[group] || [];
    },
    add:function(group,object){
        this.groups[group] = this.groups[group] || [];
        this.groups[group].push(object);
        object._groups = object._groups || [];
        object._groups.push(group);
    },
    remove:function(group,object){
        if(this.groups[group]){
			object._groups.remove(group);
            const i = this.groups[group].indexOf(object);
            if(i !== -1){
                this.groups[group].splice(i,1);
            }
        }
    }
}

//===============================================
// InputRecorder
//===============================================

class __InputRecorder{
    startTime = -1
    stack = []
    start(){
        const self = this;
        this.startTime = Date.now();
        this.stack = [];
        document.body.addEventListener('keydown',function(e){
            self.stack.push(['keydown',e,Date.now()-self.startTime])
        })
        document.body.addEventListener('keyup',function(e){
            self.stack.push(['keyup',e,Date.now()-self.startTime])
        })
    }
    play(){
        for(let item of this.stack){
            setTimeout(function(){
                document.body.dispatchEvent(item[1]);
            },item[2])
        }
    }
}

InputRecorder = new __InputRecorder();

//===============================================
// Gamepads
//===============================================

class GamepadHandler{
    _gamepads = {};
    gamepads = {};
    deadzone = 0.0;
    gamepadHandler(event,connected){
        const gamepad = event.gamepad;
        // Note:
        // gamepad === navigator.getGamepads()[gamepad.index]
      
        if (connected) {
            this._gamepads[gamepad.index] = gamepad;
            this.gamepads[gamepad.index] = {
                leftStick:new Vector2(0,0),
                rightStick:new Vector2(0,0),
                dpad:[0,0,0,0],
                a:0,
                b:0,
                x:0,
                y:0,
                r1:0,
                r2:0,
                r3:0,
                l1:0,
                l2:0,
                l3:0,
                start:0,
                select:0
            }
            console.log(`Gamepad ${gamepad.index} connected`)
        } else {
            delete this_gamepads[gamepad.index];
            console.log(`Gamepad ${gamepad.index} disconnected`)
        }
    }
    constructor(){
        const self = this;
        window.addEventListener("gamepadconnected",(e) => {self.gamepadHandler(e, true);},false,);
        window.addEventListener("gamepaddisconnected",(e) => {self.gamepadHandler(e, false);},false,);
        this.loop();
    }
    boundLoop = this.loop.bind(this);
    loop(){
        const deadzone = this.deadzone;
        if(!navigator.getGamepads){
        	return
        }
        const gamepads = navigator.getGamepads();
        for(let i = 0; i < gamepads.length; i++){
            const gp = gamepads[i];
            
            const g = this.gamepads[gp.index];
            if(!g) continue;

            if(gp.axes[0] < -deadzone && g.leftStick.x > -deadzone){
                Signals.emit('left_stick_left',gp.axes[0],gp.index)
            }

            if(gp.axes[0] > deadzone && g.leftStick.x < deadzone){
                Signals.emit('left_stick_right',gp.axes[0],gp.index)
            }

            if(gp.axes[1] < -deadzone && g.leftStick.y > -deadzone){
                Signals.emit('left_stick_up',gp.axes[0],gp.index)
            }

            if(gp.axes[1] > deadzone && g.leftStick.y < deadzone){
                Signals.emit('left_stick_down',gp.axes[0],gp.index)
            }

            g.leftStick.x = gp.axes[0];
            g.leftStick.y = gp.axes[1];

            g.rightStick.x = gp.axes[2];
            g.rightStick.y = gp.axes[3];

            if(gp.buttons[0].value > 0 && !g.a){
                Signals.emit('gamepad_a',gp.buttons[0].value,gp.index);
            }


            if(gp.buttons[1].value > 0 && !g.b){
                Signals.emit('gamepad_b',gp.buttons[1].value,gp.index);
            }

            if(gp.buttons[2].value > 0 && !g.x){
                Signals.emit('gamepad_x',gp.buttons[2].value,gp.index);
            }

            if(gp.buttons[3].value > 0 && !g.y){
                Signals.emit('gamepad_y',gp.buttons[3].value,gp.index);
            }

            g.a = gp.buttons[0].value;
            g.b = gp.buttons[1].value;
            g.x = gp.buttons[2].value;
            g.y = gp.buttons[3].value;

        }

        requestAnimationFrame(this.boundLoop);
    }
}

const Gamepads = new GamepadHandler();

//===============================================
// Audio
//===============================================

const SFX = {
    files:{},
    muted:false,
    load:function(id,file){
        const a = new Audio();
        a.src = file;
        SFX.files[id] = a;
    },
    play:function(id){
    	if(SFX.muted){return};
        if(!SFX.files[id].paused){
            SFX.files[id].currentTime = 0;
        }else{
            SFX.files[id].play();
        }
    }
}


//===============================================
// Parsers
//===============================================


function csv2Dict(csv){
    csv = csv.split('\r\n').join('\n');
    const entries = [];
    const lines = csv.split('\n');
    const headers = lines.shift().split(',');
    for(let line of lines){
        const parts = line.split(',');
        const obj = {};
        for(let i = 0; i < headers.length; i++){
            obj[headers[i]] = parts[i];
        }
        entries.push(obj);
    }
    return entries
}


// ===========================================
// Random
// ==========================================

