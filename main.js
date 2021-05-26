(function(){
    //Creacion clase tablero de juego
	self.Board = function(width,height){
		this.width = width;
		this.height = height;
		this.playing = false;
		this.game_over = false;
		this.bars = [];
		this.ball = null;
	}

	self.Board.prototype = {
        //getter para obtener las barras y la bola 
		get elements(){
			var elements = this.bars;
		//	elements.push(this.ball);
			return elements;
		}
        
	}
})();


(function(){
    self.Bar = function(x,y,width,height,board){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.board = board;
        this.speed= 10;
        this.board.bars.push(this)
        this.kind ="rectangle"
    }
    self.Bar.prototype ={
        down: function(){
            this.y+=this.speed
        },
        up : function(){
            this.y -=this.speed
        },
        toString: function(){
            return "x:" + this.x + " y:" + this.y
        }
    }

})()
(function(){
    self.Ball = function(x,y,radius,board){
        this.x = x;
		this.y = y;
		this.radius = radius;
		this.speed_y = 0;
		this.speed_x = 3;
		this.board = board;
		this.direction = -1;
		this.speed = 3;
        this.bounce_angle = 0;
		this.max_bounce_angle = Math.PI / 12;



		board.ball = this;
		this.kind = "circle";	
    },
    
    self.Ball.prototype = {
        move: function(){
			this.x += (this.speed_x * this.direction);
			this.y += (this.speed_y);
		},
        get width(){
            return this.radius*2
        },
        get height(){
            return this.radius*2
        },  
    }

})();
(function(){
    //Creacion de la clase BoardView, este es la instancia del canvas en el html
    self.BoardView = function(canvas,board){
        this.canvas = canvas;
        this.canvas.width=board.width;
        this.canvas.height=board.height;
        this.board = board;
        this.ctx = canvas.getContext("2d");
    }
    self.BoardView.prototype={
        draw : function(){
                for (let i = this.board.elements.length - 1; i >=0; i--) {
                    var el = this.board.elements[i];             
                    draw(this.ctx,el)
                }
        }, 
        clean: function(){
            this.ctx.clearRect(0,0,board.width,board.height)
    },
    play: function(){
        this.clean()
        this.draw()
    }
    }
        //Dibuja en el board
        function draw(ctx,element){
            switch(element.kind){
                case "rectangle":
                    ctx.fillRect(element.x, element.y, element.width, element.height);
                    break;
                case "circle": 
                    ctx.beginPath();
                    ctx.arc(element.x,element.y,element.radius,0,7);
                    ctx.fill();
                    ctx.closePath();
                    break;
        }
        }
})();

var board = new Board(800,400)
var bar = new Bar(20,150,40,100,board)
var bar_2 = new Bar(735,150,40,100,board)
var canvas = document.getElementById("canvas")
var board_view = new BoardView(canvas, board)
var ball = new Ball(350, 200 , 10,board);

document.addEventListener("keydown",(ev)=>{
    e.preventDefault()
    if(ev.keyCode == 38){
		bar.up()
	}
	else if(ev.keyCode == 40){
		bar.down()
	}
    else if(ev.keyCode === 87){
        //W
		bar_2.up()
	}else if(ev.keyCode === 83){
        //S
		bar_2.down();
	}

})

window.requestAnimationFrame(controller)

function controller(){
    board_view.play()
    window.requestAnimationFrame(controller)

}