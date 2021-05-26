(function(){
    //Creacion clase tablero de juego
	self.Board = function(width,height){
		this.width = width;
		this.height = height;
		this.game_over = false;
		this.bars = [];
		this.ball = null;
		this.playing = false;
	}

	self.Board.prototype = {
        //getter para obtener las barras y la bola 
		get elements(){
            //se pasa el arreglo como copia
			var elements = this.bars.map(function(bar){ return bar; });
			elements.push(this.ball);
			return elements;
		}
        
	}
})();

//Creacion objeto Barras
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

})();


//Creacion objeto bola
(function(){
    self.Ball = function(x,y,radius,board){
        this.x = x;
		this.y = y;
		this.radius = radius;
		this.speed_y = 0;
		this.speed_x = 3;
		this.board = board;
		board.ball = this;
		this.kind = "circle";	
        this.direction = -1;

    }
    self.Ball.prototype = {
        move: function(){
			this.x += (this.speed_x * this.direction);
			this.y += (this.speed_y);
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
        if(board.playing){
        this.clean()
        this.draw()
        this.board.ball.move()}
    },
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

//Movimiento de las barras
document.addEventListener("keydown",(ev)=>{
    if(ev.keyCode == 38){
		ev.preventDefault()
		bar.up()
	}
	else if(ev.keyCode == 40){
		ev.preventDefault()
		bar.down()
	}else if(ev.keyCode === 87){
        //W
		ev.preventDefault()
		bar_2.up()
	}else if(ev.keyCode === 83){
        //S
		ev.preventDefault()
		bar_2.down();
	}else if(ev.keyCode === 32){
        //detener el juego con espacio
		ev.preventDefault()
		board.playing = !board.playing
	}
})

window.requestAnimationFrame(controller)

board_view.draw()
function controller(){
    board_view.play()
    window.requestAnimationFrame(controller)

}