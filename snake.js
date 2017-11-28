(function(){
	"use strict";
	var fetchId=function(e_id){
		try{
			var element=document.getElementById(e_id);
			if(element!==null){
				return element;
			}
			else{
				return;
			}
		}
		catch(e){
			console.log(e);
		}
	};
	var canvas=fetchId("canvas");
	var ctx=canvas.getContext("2d");
	var width=canvas.width;
	var height=canvas.height;
	var block_size=10;
	var width_in_blocks=width/block_size;
	var height_in_blocks=height/block_size;
	var score=0;
	var snake;
	var apple;
	var intervalId;
	var start_btn=fetchId("start_game");
	var circle=function(x,y,radius,fill){
		ctx.beginPath();
		ctx.arc(x,y,radius,0,Math.PI*2,false);
		if(fill){
			ctx.fill();
		}
		else{
			ctx.stroke();
		}
	};
	var drawBorder=function(){
		ctx.fillStyle="grey";
		ctx.fillRect(0,0,width,block_size);
		ctx.fillRect(0,height-block_size,width,block_size);
		ctx.fillRect(0,0,block_size,height);
		ctx.fillRect(width-block_size,0,block_size,height);
	};
	var drawScore=function(){
		ctx.font="20px Courier";
		ctx.fillStyle="black";
		ctx.textAlign="left";
		ctx.textBaseline="top";
		ctx.fillText("Score:"+score,block_size,block_size);
	};
	var gameOver=function(){
		clearInterval(intervalId);
		ctx.font="60px Courier";
		ctx.fillStyle="black";
		ctx.textAlign="center";
		ctx.textBaseline="middle";
		ctx.fillText("Game Over",width/2,height/2);
		start_btn.disabled=false;
	};
	var Block=function(col,row){
		this.col=col;
		this.row=row;
	};
	Block.prototype.drawSquare=function(color){
		var x=this.col*block_size;
		var y=this.row*block_size;
		//ctx.fillStyle=color;
		ctx.strokeStyle=color;
		//ctx.fillRect(x,y,block_size,block_size);
		ctx.strokeRect(x,y,block_size,block_size);
	};
	Block.prototype.drawCircle=function(color){
		var centerX=(this.col*block_size)+(block_size/2);
		var centerY=(this.row*block_size)+(block_size/2);
		ctx.fillStyle=color;
		circle(centerX,centerY,block_size/2,true);
	};
	Block.prototype.equal=function(otherBlock){
		return this.col===otherBlock.col&&this.row===otherBlock.row;
	};
	var Apple=function(){
		this.position=new Block(10,10);
	};
	Apple.prototype.draw=function(){
		this.position.drawCircle("limegreen");
	};
	Apple.prototype.move=function(){
		var random_col=Math.floor(Math.random()*(width_in_blocks-2))+1;
		var random_row=Math.floor(Math.random()*(height_in_blocks-2))+1;
		this.position=new Block(random_col,random_row);
	};
	var Snake=function(){
		this.segments=[
			new Block(7,5),
			new Block(6,5),
			new Block(5,5),
		];
		this.direction="right";
		this.next_direction="right";
	};
	Snake.prototype.draw=function(){
		var i;
		var segments_num=this.segments.length;
		//var colors=["red","green","blue"];
		for(i=0;i<segments_num;i++){
			this.segments[i].drawSquare();
		}
	};
	Snake.prototype.move=function(){
		var head=this.segments[0];
		var new_head;
		this.direction=this.next_direction;
		switch(this.direction){
			case "right":
				new_head=new Block(head.col+1,head.row);
			break;
			case "down":
				new_head=new Block(head.col,head.row+1);
			break;
			case "left":
				new_head=new Block(head.col-1,head.row);
			break;
			case "up":
				new_head=new Block(head.col,head.row-1);
		}
		if(this.checkCollision(new_head)){
			gameOver();
			return;
		}
		this.segments.unshift(new_head);
		if(new_head.equal(apple.position)){
			score++;
			apple.move();
		}
		else{
			this.segments.pop();
		}
	};
	Snake.prototype.checkCollision=function(head){
		var left_collision=(head.col===0);
		var top_collision=(head.row===0);
		var right_collision=(head.col===width_in_blocks-1);
		var bottom_collision=(head.row===height_in_blocks-1);
		var wall_collision=left_collision||top_collision||right_collision||bottom_collision;
		var self_collision=false;
		var i;
		var segments_num=this.segments.length;
		for(i=0;i<segments_num;i++){
			if(head.equal(this.segments[i])){
				self_collision=true;
			}
		}
		return wall_collision||self_collision;
	};
	Snake.prototype.setDirection=function(new_direction){
		if(this.direction==="up"&&new_direction==="down"){
			return;
		}
		else if(this.direction==="right"&&new_direction==="left"){
			return;
		}
		else if(this.direction==="down"&&new_direction==="up"){
			return;
		}
		else if(this.direction==="left"&&new_direction==="right"){
			return;
		}
		this.next_direction=new_direction;
	};
	var gameStart=function(){
		ctx.clearRect(0,0,width,height);
		ctx.fillStyle="#ffffff";
		ctx.fillRect(0,0,width,height);
		drawScore();
		snake.move();
		snake.draw();
		apple.draw();
		drawBorder();
	};
	start_btn.onclick=function(){
		score=0;
		snake=new Snake();
		apple=new Apple();
		intervalId=setInterval(function(){
			gameStart();
		},100);
		this.disabled=true;
	};
	var beforeStart=function(){
		snake=new Snake();
		apple=new Apple();
		ctx.clearRect(0,0,width,height);
		ctx.fillStyle="#ffffff";
		ctx.fillRect(0,0,width,height);
		drawScore();
		snake.draw();
		apple.draw();
		drawBorder();
		ctx.font="60px Courier";
		ctx.fillStyle="black";
		ctx.textAlign="center";
		ctx.textBaseline="middle";
		ctx.fillText("Game Over",width/2,height/2);
	};
	beforeStart();
	var directions={
		37:"left",
		38:"up",
		39:"right",
		40:"down"
	};
	document.body.onkeydown=function(eve){
		var new_direction=directions[eve.keyCode];
		if(new_direction!=="undefined"){
			snake.setDirection(new_direction);
		}
	};
})();