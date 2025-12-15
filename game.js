let game_field = document.getElementById('game_field');
let ctx = game_field.getContext('2d');
let rect = game_field.getBoundingClientRect();
let xvelocity = 5;
let yvelocity = 5;
let colors = ['red', 'orange', 'green', 'yellow'];

let restart_button = document.getElementById('restart');
let livs_container = document.getElementById('lives');
let timer = document.getElementById('time');
let time=0;
let player_score = 0;
let score_bord = document.getElementById('score');
let timer_id = -1;
function stop_set_timer(val){
    switch(val){
        case 1:
            if(timer_id<0){
                timer_id = setInterval(()=>{
                    time+=1; 
                    let str ='';
                    str = (time/60>9?'':'0')+Math.floor(time/60)+':'+(time%60>9?'':'0')+ time%60;
                    timer.textContent=str;},1000);
            }
            break;
        case 0:
            if(timer_id>-1){
                clearInterval(timer_id);
                timer_id=-1;
            }
        break;
        default: console.log('incorect value');
    }
}
class player_object{
    bricks = [];
    x=0;
    y=rect.height*0.8;
    width=40;
    height=10;
    points=0;
    id = -1;
    spd=3.0;
    color="blue";
    speed_increase = 1.0;
    punches = 0;
    orange = false;
    red = false;
    lbc_once= false;
    game_over = false;
    fup=false;
    lives = 3;
    animf = null;
    ball={
        radius: 5,
        x:this.width/2,y:rect.height*0.8-5,
        xvelocity: 0,
        yvelocity: 0}
    constructor(x){
        this.x = x;
        let twd = Math.floor(rect.width/14);
        for(let i=0; i<8; i++){
            let aray = new Array();
            for(let j=0; j<14; j++){
                let brick = {x: j*twd, y:i*20, width:twd, height:19, hp: 7-parseInt(i/2, 10), color: colors[parseInt(i/2)], points: (8-(i%2==0?i+1:i))};
                aray.push(brick);
            }
            this.bricks.unshift(aray);
        }
        this.anim = this.write_player.bind(this);
    }
    reload(){
        if(this.animf)cancelAnimationFrame(this.animf);
    this.animf = null;
        stop_set_timer(0);
        time=0;
        timer.textContent='00:00';
        player_score=0;
        score_bord.textContent=''+player_score;
        this.lives=3;
        livs_container.textContent = this.lives;
        this.fup=false;
        this.speed_increase = 1.0;
        this.punches = 0;
        this.orange = false;
        this.red = false;
        this.lbc_once= false;
        this.width=40;
        this.points=0;
        this.id = -1;
        this.spd=3.0;
        this.ball.y=rect.height*0.8-5
        this.ball.yvelocity=0;
        this.ball.xvelocity=0;
        console.log(this.speed_increase);
        console.log(this.ball.yvelocity);
        console.log(this.ball.xvelocity);
        console.log(this.spd);
        
        if(this.bricks.length>0){
            for(var t=this.bricks.length-1; t>-1; t--){
                this.bricks[t].slice(0,this.bricks[t].length);
            }
            this.bricks.slice(0,this.bricks.length);
            this.bricks.length=0;
        };
        let twd = Math.floor(rect.width/14);
        for(let i=0; i<8; i++){
            let aray = new Array();
            for(let j=0; j<14; j++){
                let brick = {x: j*twd, y:i*20, width:twd, height:19, hp: 7-parseInt(i/2, 10), color: colors[parseInt(i/2)], points: (8-(i%2==0?i+1:i))};
                aray.push(brick);
            }
            this.bricks.unshift(aray);
        }
        requestAnimationFrame(this.anim);
    }
    check_collision(){
        if(this.ball.y>=rect.height-this.ball.radius*3){
            stop_set_timer(0);
            if(this.lives<1){   
                console.log('end')
                this.game_over = true;
            return;
            }
            this.lbc_once= false;
            this.ball.y=rect.height*0.8-5
            this.ball.yvelocity=0;
            this.ball.xvelocity=0;
            this.lives-=1;
            livs_container.textContent = this.lives;
            return;
        }
        if(this.ball.x<=0 ||this.ball.x>=rect.width){
            this.ball.xvelocity= -this.ball.xvelocity;
            return;
        }
        if(((this.ball.y-this.ball.radius) < 0)){
            this.ball.yvelocity= -this.ball.yvelocity;
            this.ball.xvelocity= -this.ball.xvelocity;
            
            console.log('out')
            return;
        }
        if(this.ball.y+this.ball.radius>=this.y &&this.ball.y-this.ball.radius<=this.y+this.height &&this.ball.x >= this.x && this.ball.x <= this.x+this.width){
            this.ball.yvelocity= -this.ball.yvelocity;
            this.ball.xvelocity= -this.ball.xvelocity;
                let hp = (this.ball.x-this.x)/this.width;
                let ang = (hp-0.5)*Math.PI/2;
                this.punches+=1;
                if(this.punches==4)this.speed_increase+=0.1;
                if(this.punches==12)this.speed_increase+=0.1;
                this.spd = Math.sqrt(this.ball.xvelocity*this.ball.xvelocity+this.ball.yvelocity*this.ball.yvelocity);
                this.ball.xvelocity = (this.spd) * Math.sin(ang);
                this.ball.yvelocity = (this.spd) * Math.cos(ang);
                console.log('spd'+this.spd)
                return;
            }
        for(let i =0; i<this.bricks.length; i++){
            for(let j=0; j<this.bricks[i].length; j++){
                let item = this.bricks[i][j];
                if(this.ball.x >= item.x && this.ball.x<= item.x+item.width+1){
                    if(this.ball.y-this.ball.radius<=item.y+item.height+1 && this.ball.y+this.ball.radius>=item.y){
                        item.hp -= 1;
                        if(item.hp <= 0) {
                            if(this.bricks[i][j].points==5)this.orange=true;
                            if(this.bricks[i][j].points==7)this.red=true;
                            player_score+=this.bricks[i][j].points;
                            score_bord.textContent=player_score;
                            this.bricks[i].splice(j,1);};
                        let ox = Math.min(this.ball.x+this.ball.radius-item.x, item.x+item.width+1-(this.ball.x-this.ball.radius));
                        let oy = Math.min(this.ball.y+this.ball.radius-item.y, item.y+item.height+1-(this.ball.y-this.ball.radius));
                        if(ox<oy){
                            this.ball.xvelocity = -this.ball.xvelocity;
                        }else{
                            this.ball.yvelocity = -this.ball.yvelocity;
                        }
                    }
                }
            }
        }
    }   
    move(){
        this.check_collision();
        this.ball.y -= this.ball.yvelocity*this.spd*(this.speed_increase+(this.orange?0.1:0)+(this.red?0.1:0));
        this.ball.x += this.ball.xvelocity*this.spd*this.speed_increase;
        console.log('x: '+this.ball.xvelocity*this.spd*this.speed_increase+' y: '+this.ball.yvelocity*this.spd*(this.speed_increase+(this.orange?0.1:0)+(this.red?0.1:0)) )
    }
    set_listener() {
        game_field.addEventListener('mousedown', (event)=>{
            if(event.button != 0) return;
            if(this.lbc_once) return;
            console.log('click');
            this.ball.yvelocity=3;
            this.ball.x=this.x+this.width/2;
            this.ball.y=rect.height*0.8-5;
            stop_set_timer(1);
            this.lbc_once = true;
        })

        game_field.addEventListener('mousemove', (event)=>{
            let posX = event.clientX-rect.left; 
            this.x = (posX<(this.width/2)||posX>(rect.width-this.width/2))?((posX<(this.width))?0:rect.width-this.width):(posX-this.width/2);
            if(!this.lbc_once)
                this.ball.x=this.x+this.width/2;
        });
        requestAnimationFrame(this.anim);}
    write_player(){
        if(this.game_over) return;
        if(this.lbc_once)this.move();
        ctx.clearRect(0,0,game_field.width,game_field.height);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x,this.y,this.width,this.height);
        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.arc(this.ball.x,this.ball.y,this.ball.radius,0,this.ball.radius*2*Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        for(let i=0; i< this.bricks.length; i++){
            ctx.fillStyle = colors[3-parseInt(i/2)];
            for(let j=0;j<this.bricks[i].length; j++){    
                ctx.fillRect(this.bricks[i][j].x, this.bricks[i][j].y, this.bricks[i][j].width, this.bricks[i][j].height);
                ctx.strokeRect(this.bricks[i][j].x, this.bricks[i][j].y, this.bricks[i][j].width, this.bricks[i][j].height);
            }
        }
        this.animf = requestAnimationFrame(this.anim);
    }

}
let obj = new player_object(0);
    obj.set_listener();

function restart(){
    obj.game_over = false;
    obj.reload();
}
