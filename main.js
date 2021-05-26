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
		this.direction = -1;
		this.speed = 3;
        this.bounce_angle = 0;
		this.max_bounce_angle = Math.PI / 12;
		board.ball = this;
		this.kind = "circle";	

    }
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
        // con este metodo colicion, identificamos cuando la bola golpea una de las barras
        collision: function(bar){
            var relative_intersect_y = ( bar.y + (bar.height / 2) ) - this.y;
            var normalized_intersect_y = relative_intersect_y / (bar.height / 2);
            this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;
            this.speed_y = this.speed * -Math.sin(this.bounce_angle);
            this.speed_x = this.speed * Math.cos(this.bounce_angle);
            if(this.x > (this.board.width / 2)) this.direction = -1;
            else this.direction = 1;
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
        //cada iteracion revisamos si golpea las barras
        this.check_collisions()
        this.board.ball.move()}
    },
    check_collisions: function(){

        for (var i = this.board.bars.length - 1; i >= 0; i--) {
            var bar = this.board.bars[i];
            if(hit(bar, this.board.ball)){

                this.board.ball.collision(bar);
            }
            
        };
        if(this.board.ball.y - this.board.ball.radius < 0 ||this.board.ball.y + this.board.ball.radius > 400 ){
            this.board.ball.speed_y= this.board.ball.speed_y*-1
        }
        if(this.board.ball.x - this.board.ball.radius < 0 ||this.board.ball.x + this.board.ball.radius > 800 ){
            this.board.ball.speed_x= this.board.ball.speed_x*-1
        }

    },
    }
    //Este metodo arroja true si la bola golpea las barras, teniendo en cuentra los tamaños de estos
    function hit(a,b){
		var hit = false;
		if(b.x + b.width >= a.x && b.x < a.x + a.width)
		{
			if(b.y + b.height >= a.y && b.y < a.y + a.height)
				hit = true;}
		if(b.x <= a.x && b.x + b.width >= a.x + a.width)
		{
			if(b.y <= a.y && b.y + b.height >= a.y + a.height)
				hit = true;}
		if(a.x <= b.x && a.x + a.width >= b.x + b.width)
		{
			if(a.y <= b.y && a.y + a.height >= b.y + b.height)
				hit = true;}
		return hit;
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