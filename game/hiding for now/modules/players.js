import { c, width, height, centerX, centerY, splashAnimation, boatSprite, buttonPic} from '../Main.js';
import { ellipse, image } from './drawShapes.js';
import { randomColor } from './colors.js';
import { keys, keyCode } from './listeners/keyListener.js'
import { gamepad } from './listeners/gamepadListener.js'

export let controllerDeadzone = 0.1;


export let pAccelRate = 0.3;
export let pDecelRate = 0.99;
export let pTopSpeed = 10;
let sprintTopSpeed = pTopSpeed * 1.5;
let sprintEnergyUseRate = 1.67;
let sprintEnergyRechargeRate = 0.33;
let sprintRechargeTimer = 60;



export class Player {
    constructor(clr) {
        this.x = 0;
        this.y = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.topSpeed = pTopSpeed;
        this.accelRate = pAccelRate;
        this.decelRate = pDecelRate;
        this.sprintEnergy = 100;
        this.sprintRechargeTimer = sprintRechargeTimer;
        
        this.points = 0;
        this.lose = false;

        this.size = 100;
        this.clr = clr;
        this.name;
        this.pid;
        this.skin;

        
        this.controller;
        this.cNum;
        this.boundUp;
        this.boundDown;
        this.boundLeft;
        this.boundRight;
        this.boundSprint;
        this.left;
        this.up;
        this.right;
        this.left;
        this.sprint;

        
        //Player Contact Physics (for games like Sumo and Row Race);
        this.newPlayerContactPhysics = {
            xdbpab: (pNum) => { return (this.x-player[pNum].x) - ((this.x-player[pNum].x)/((this.size+player[pNum].size)/2))*(this.size/2); },
            ydbpab: (pNum) => { return (this.y-player[pNum].y) - ((this.y-player[pNum].y)/((this.size+player[pNum].size)/2))*(this.size/2); },
            tdbpab: (pNum) => { return Math.sqrt(Math.pow(this.newPlayerContactPhysics.xdbpab(pNum), 2) + Math.pow(this.newPlayerContactPhysics.ydbpab(pNum), 2)); },

            //delete this. I don't know what the fuck is going on here but I don't feel like cleaning it up right now.
            //y indicators
            yBPs: (pNum) => { return (Math.round((0.00001)/((this.ySpeed+0.00001)-player[pNum].ySpeed))*-1)+1; },
            yBPp: (pNum) => { return Math.round(((0.00001)/((this.y+0.00001)-player[pNum].y))); },
            //yBPind: (pNum) => { return (Math.abs(this.ySpeed+0.00001)/(this.ySpeed+0.00001) + Math.abs(player[pNum].ySpeed+0.00001)/(player[pNum].ySpeed+0.00001)) /2},
            //yPind: () => { return Math.round((this.ySpeed * 1)/(this.ySpeed+0.00001)); },
            yDind1: (pNum) => { return Math.abs((Math.abs(this.ySpeed+0.00001)-Math.abs(player[pNum].ySpeed+0.00001)*this.newPlayerContactPhysics.yBPs(pNum)))/(Math.abs(this.ySpeed+0.00001)-Math.abs(player[pNum].ySpeed+0.00001)*this.newPlayerContactPhysics.yBPs(pNum)); },
            yDind2: (pNum) => { return Math.abs(player[pNum].y-this.y)/(player[pNum].y-this.y+this.newPlayerContactPhysics.yBPp(pNum))*Math.abs(player[pNum].y-this.y)/(player[pNum].y-this.y+this.newPlayerContactPhysics.yBPp(pNum)); },
            yDind: (pNum) => { return (this.newPlayerContactPhysics.yDind1(pNum)+this.newPlayerContactPhysics.yDind2(pNum))/2; },
            //inc indicators
            incInd1: (pNum) => { return Math.abs((player[pNum].y-this.y+this.newPlayerContactPhysics.yBPp(pNum)))/(player[pNum].y-this.y+this.newPlayerContactPhysics.yBPp(pNum)); },
            incInd2: (pNum) => { return Math.abs((this.y-player[pNum].y-this.newPlayerContactPhysics.yBPp(pNum)))/(this.y-player[pNum].y-this.newPlayerContactPhysics.yBPp(pNum)); },
            incInd3: (pNum) => { return (this.newPlayerContactPhysics.incInd2(pNum) - Math.abs(this.newPlayerContactPhysics.incInd1(pNum)))/-2; },
            incInd4: (pNum) => { return (this.newPlayerContactPhysics.incInd1(pNum) - Math.abs(this.newPlayerContactPhysics.incInd2(pNum)))/-2; },

            inc: (pNum) => { return Math.acos(this.newPlayerContactPhysics.xdbpab(pNum) / this.newPlayerContactPhysics.tdbpab(pNum))*this.newPlayerContactPhysics.incInd4(pNum) + (2*Math.PI-Math.acos(this.newPlayerContactPhysics.xdbpab(pNum) / this.newPlayerContactPhysics.tdbpab(pNum)))*this.newPlayerContactPhysics.incInd3(pNum); },
            inc2: (pNum) => { return this.newPlayerContactPhysics.inc(pNum) + Math.PI },
            inc3: (pNum) => { return this.newPlayerContactPhysics.inc(pNum) - Math.PI/2 },
            inc4: (pNum) => { return this.newPlayerContactPhysics.inc(pNum) + Math.PI/2 },

            player1xSpeed: (pNum) => { return Math.abs(player[pNum].xSpeed * Math.cos(this.newPlayerContactPhysics.inc(pNum))) * Math.cos(this.newPlayerContactPhysics.inc(pNum)) + Math.abs(player[pNum].ySpeed * Math.sin(this.newPlayerContactPhysics.inc(pNum))) * Math.cos(this.newPlayerContactPhysics.inc(pNum)) },
            player1ySpeed: (pNum) => { return Math.abs(player[pNum].xSpeed * Math.cos(this.newPlayerContactPhysics.inc(pNum))) * Math.sin(this.newPlayerContactPhysics.inc(pNum)) + Math.abs(player[pNum].ySpeed * Math.sin(this.newPlayerContactPhysics.inc(pNum))) * Math.sin(this.newPlayerContactPhysics.inc(pNum)) },
            player2xSpeed: (pNum) => { return Math.abs(this.xSpeed * Math.cos(this.newPlayerContactPhysics.inc(pNum))) * Math.cos(this.newPlayerContactPhysics.inc2(pNum)) + Math.abs(this.ySpeed * Math.sin(this.newPlayerContactPhysics.inc(pNum))) * Math.cos(this.newPlayerContactPhysics.inc2(pNum)) },
            player2ySpeed: (pNum) => { return Math.abs(this.xSpeed * Math.cos(this.newPlayerContactPhysics.inc(pNum))) * Math.sin(this.newPlayerContactPhysics.inc2(pNum)) + Math.abs(this.ySpeed * Math.sin(this.newPlayerContactPhysics.inc(pNum))) * Math.sin(this.newPlayerContactPhysics.inc2(pNum)) },

            player1ResidualxSpeed: (pNum) => { return this.xSpeed * Math.sin(this.newPlayerContactPhysics.inc(pNum)) * Math.cos(this.newPlayerContactPhysics.inc3(pNum)) + this.ySpeed * Math.cos(this.newPlayerContactPhysics.inc(pNum)) * Math.cos(this.newPlayerContactPhysics.inc4(pNum)); },
            player1ResidualySpeed: (pNum) => { return this.xSpeed * Math.sin(this.newPlayerContactPhysics.inc(pNum)) * Math.sin(this.newPlayerContactPhysics.inc3(pNum)) + this.ySpeed * Math.cos(this.newPlayerContactPhysics.inc(pNum)) * Math.sin(this.newPlayerContactPhysics.inc4(pNum)); },
            player2ResidualxSpeed: (pNum) => { return player[pNum].xSpeed * Math.sin(this.newPlayerContactPhysics.inc2(pNum)) * Math.cos(this.newPlayerContactPhysics.inc4(pNum)) + player[pNum].ySpeed * Math.cos(this.newPlayerContactPhysics.inc2(pNum)) * Math.cos(this.newPlayerContactPhysics.inc3(pNum)); },
            player2ResidualySpeed: (pNum) => { return player[pNum].xSpeed * Math.sin(this.newPlayerContactPhysics.inc2(pNum)) * Math.sin(this.newPlayerContactPhysics.inc4(pNum)) + player[pNum].ySpeed * Math.cos(this.newPlayerContactPhysics.inc2(pNum)) * Math.sin(this.newPlayerContactPhysics.inc3(pNum)); },

            player1xSpeedFinal: (pNum) => { return this.newPlayerContactPhysics.player1xSpeed(pNum) + this.newPlayerContactPhysics.player1ResidualxSpeed(pNum); },
            player1ySpeedFinal: (pNum) => { return this.newPlayerContactPhysics.player1ySpeed(pNum) + this.newPlayerContactPhysics.player1ResidualySpeed(pNum); },
            player2xSpeedFinal: (pNum) => { return this.newPlayerContactPhysics.player2xSpeed(pNum) + this.newPlayerContactPhysics.player2ResidualxSpeed(pNum); },
            player2ySpeedFinal: (pNum) => { return this.newPlayerContactPhysics.player2ySpeed(pNum) + this.newPlayerContactPhysics.player2ResidualySpeed(pNum); },
        }
        /*this.ballPhysicsHandler = {
            xdbpab: (pNum) => { return (this.x-ball.x) - ((this.x-ball.x)/((this.size+ball.size)/2))*(this.size/2); },
            ydbpab: (pNum) => { return (this.y-ball.y) - ((this.y-ball.y)/((this.size+ball.size)/2))*(this.size/2); },
            tdbpab: (pNum) => { return Math.sqrt(Math.pow(this.xdbpab(), 2) + Math.pow(this.ydbpab(), 2)); },
            
            //x indicators
            xBPs: (pNum) => { return (Math.round((0.00001)/((this.xSpeed+0.00001)-ball.xSpeed))*-1)+1; },
            xBPp: (pNum) => { return Math.round(((0.00001)/((this.x+0.00001)-ball.x))); },
            xBPind: (pNum) => { return (Math.abs(this.xSpeed+0.00001)/(this.xSpeed+0.00001) + Math.abs(ball.xSpeed+0.00001)/(ball.xSpeed+0.00001)) /2},
            xPind: () => { return Math.round((this.xSpeed * 1)/(this.xSpeed+0.00001)); },
            xDind1: (pNum) => { return Math.abs(( Math.abs(this.xSpeed+0.00001)-Math.abs(ball.xSpeed+0.00001)*this.xBPs()))/(Math.abs(this.xSpeed+0.00001)-Math.abs(ball.xSpeed+0.00001)*this.xBPs()); },
            xDind2: (pNum) => { return Math.abs(ball.x-this.x)/(ball.x-this.x+this.xBPp())*Math.abs(ball.x-this.x)/(ball.x-this.x+this.xBPp()) },
            xDind: (pNum) => { return (this.xDind1(pNum)+this.xDind2(pNum))/2; },
            //y indicators
            yBPs: (pNum) => { return (Math.round((0.00001)/((this.ySpeed+0.00001)-ball.ySpeed))*-1)+1; },
            yBPp: (pNum) => { return Math.round(((0.00001)/((this.y+0.00001)-ball.y))); },
            yBPind: (pNum) => { return (Math.abs(this.ySpeed+0.00001)/(this.ySpeed+0.00001) + Math.abs(ball.ySpeed+0.00001)/(ball.ySpeed+0.00001)) /2},
            yPind: () => { return Math.round((this.ySpeed * 1)/(this.ySpeed+0.00001)); },
            yDind1: (pNum) => { return Math.abs((Math.abs(this.ySpeed+0.00001)-Math.abs(ball.ySpeed+0.00001)*this.yBPs()))/(Math.abs(this.ySpeed+0.00001)-Math.abs(ball.ySpeed+0.00001)*this.yBPs()); },
            yDind2: (pNum) => { return Math.abs(ball.y-this.y)/(ball.y-this.y+this.yBPp())*Math.abs(ball.y-this.y)/(ball.y-this.y+this.yBPp()); },
            yDind: (pNum) => { return (this.yDind1(pNum)+this.yDind2(pNum))/2; },
            //inc indicators
            incInd1: (pNum) => { return Math.abs((ball.y-this.y+this.yBPp()))/(ball.y-this.y+this.yBPp()); },
            incInd2: (pNum) => { return Math.abs((this.y-ball.y-this.yBPp()))/(this.y-ball.y-this.yBPp()); },

            incInd3: (pNum) => { return (this.incInd2(pNum) - Math.abs(this.incInd1(pNum)))/-2; },
            incInd4: (pNum) => { return (this.incInd1(pNum) - Math.abs(this.incInd2(pNum)))/-2; },

            inc: (pNum) => { return Math.acos(this.xdbpab(pNum) / this.tdbpab(pNum))*this.incInd4(pNum) + (2*Math.PI-Math.acos(this.xdbpab(pNum) / this.tdbpab(pNum)))*this.incInd3(pNum); },
            cA: (pNum) => { return this.inc(pNum)-(3/2)*Math.PI; }, //complimentary angle
            //ball speed after collision calc
            ballxSpeed: () => { return Math.abs(ball.xSpeed*Math.cos(this.inc())*Math.cos(this.inc())) * this.xBPind() * this.xPind() * this.xDind() + this.xSpeed * Math.cos(this.inc()) * Math.cos(this.inc()) + ( (ball.xSpeed * Math.cos(this.cA()) * Math.cos(this.cA())) - (ball.xSpeed * Math.cos(this.inc()) * Math.cos(this.inc())) ) + (this.ySpeed * Math.sin(this.inc()) * Math.cos(this.inc()) - ball.ySpeed * Math.sin(this.inc()) * Math.cos(this.inc()) ); },
            ballySpeed: () => { return Math.abs(ball.ySpeed*Math.sin(this.inc())*Math.sin(this.inc())) * this.yBPind() * this.yPind() * this.yDind() + this.ySpeed * Math.sin(this.inc()) * Math.sin(this.inc()) + ( (ball.ySpeed * Math.sin(this.cA()) * Math.sin(this.cA())) - (ball.ySpeed * Math.sin(this.inc()) * Math.sin(this.inc())) ) + (this.xSpeed * Math.sin(this.inc()) * Math.cos(this.inc()) - ball.xSpeed * Math.sin(this.inc()) * Math.cos(this.inc()) ); },  
        }*/
        

        //Row Race properties
        this.rrp = {
            boatX: 0,
            boatY: 0,
            angle: 0,
            speed: 0,
            accelRate: 1,
            angleChangeRate: Math.PI/90,
            checkpoint: [false, false, 1],

            leftTriggerValues: [],
            highestLTValue: 0,
            lowerLTValue: 0,
            rowDownL: false,
            rowUpL: false,
            rightTriggerValues: [],
            highestRTValue: 0,
            lowerRTValue: 0,
            rowDownR: false,
            rowUpR: false,
            rowSound: [],

            momentum: () => {
                this.x += this.rrp.translateSpeedToXSpeed();
                this.y += this.rrp.translateSpeedToYSpeed();
                if (this.rrp.speed > 0) { this.rrp.speed -= 0.1 }
                if (this.rrp.speed < 0) { this.rrp.speed += 0.01 }
                if ( Math.abs(this.rrp.speed) < 0.01 ) { this.rrp.speed = 0 };

                if (this.xSpeed > 0) { this.xSpeed -= 0.3 }
                if (this.xSpeed < 0) { this.ySpeed += 0.3 }
                if ( Math.abs(this.xSpeed) < 0.5 && this.xSpeed > -0.5 ) { this.xSpeed = 0 };
                if (this.ySpeed > 0) { this.ySpeed -= 0.3 }
                if (this.ySpeed < 0) { this.ySpeed += 0.3 }
                if ( Math.abs(this.ySpeed) < 0.5 && this.ySpeed > -0.5 ) { this.ySpeed = 0 };
                this.x += this.xSpeed;
                this.y += this.ySpeed;
            },
            translateSpeedToXSpeed: () => {
                return Math.cos(this.rrp.angle) * this.rrp.speed; 
            },
            translateSpeedToYSpeed: () => {
                return Math.sin(this.rrp.angle) * this.rrp.speed;
            },
            splashFrame: 0,
            animateSplash: () => {
                image(splashAnimation[this.rrp.splashFrame.toFixed(0)], this.rrp.boatX, this.rrp.boatY, this.size/100*3.2, this.size/100*1.2);
                this.rrp.splashFrame += 0.2;
                if (this.rrp.splashFrame > 26) { this.rrp.splashFrame = 0; }
            },
            draw: () => {
                c.save();
                c.translate(this.x, this.y)
                c.rotate(this.rrp.angle);
                this.rrp.animateSplash()
                image(boatSprite, this.rrp.boatX, this.rrp.boatY, this.size/100, this.size/100)
                c.restore();
                this.draw();
            },
        }
        //Simon Says properties
        this.ssp = {
            inputPicArray: [],
            inputArray: [],
            buttonHeld: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            
            xPosition: undefined,

            draw: () => {
                this.draw();
                for (let i = 0; i < this.ssp.inputPicArray.length; i++){
                    image(this.ssp.inputPicArray[i], this.x + i*22 - (this.ssp.inputPicArray.length-1)/2*22, this.y - 50, 0.25, 0.25)
                }
            },

            controls: () => {
                this.gamepadControlsListener();
                this.ssp.pressButtonOnce(this.buttonA, 0)
                this.ssp.pressButtonOnce(this.buttonB, 1)
                this.ssp.pressButtonOnce(this.buttonX, 2)
                this.ssp.pressButtonOnce(this.buttonY, 3)
                this.ssp.pressButtonOnce(this.buttonLB, 4)
                this.ssp.pressButtonOnce(this.buttonRB, 5)
                this.ssp.pressButtonOnce(this.leftTrigger, 6)
                this.ssp.pressButtonOnce(this.rightTrigger, 7)
                this.ssp.pressButtonOnce(this.buttonLS, 10)
                this.ssp.pressButtonOnce(this.buttonRS, 11)
                this.ssp.pressButtonOnce(this.buttonDPadUp, 12)
                this.ssp.pressButtonOnce(this.buttonDPadDown, 13)
                this.ssp.pressButtonOnce(this.buttonDPadLeft, 14)
                this.ssp.pressButtonOnce(this.buttonDPadRight, 15)
            },
            pressButtonOnce: (button, buttonID) =>{
                if (button){
                    if (this.ssp.buttonHeld[buttonID] === 0 ) { 
                        this.ssp.inputPicArray.push(buttonPic[buttonID]); 
                        this.ssp.inputArray.push(buttonID);
                        this.ssp.buttonHeld[buttonID]++;
                    }
                } else { this.ssp.buttonHeld[buttonID] = 0; }
            },
        }
        this.ccp = {
            buttonHeld: 0,
            pixelsCovered: 0,
        }
    }
    draw () {
        ellipse(this.x, this.y, this.size, this.clr);
    }
    //movement functions
    momentum () {
        this.y += this.ySpeed;
        this.x += this.xSpeed;

        if ((this.xSpeed > -this.accelRate && this.xSpeed < this.accelRate) && (this.ySpeed > -this.accelRate && this.ySpeed < this.accelRate)) {
            this.xSpeed = 0;
            this.ySpeed = 0;
        }
    }
    resetAccelY () {
        if (this.ySpeed > 0){
            this.ySpeed *= this.decelRate;
        }

        if (this.ySpeed < 0){
            this.ySpeed *= this.decelRate;
        }
    }
    resetAccelX () {
        if (this.xSpeed > 0){
            this.xSpeed *= this.decelRate;
        }

        if (this.xSpeed < 0){
            this.xSpeed *= this.decelRate;
        }
    }
    north (axes) {
        if (!axes){ axes = -1 }
        if (this.ySpeed >= this.topSpeed*axes + pAccelRate){
            this.ySpeed -= this.accelRate;
        }
        return true;
    }
    south (axes) {
        if (!axes){ axes = 1 }
        if (this.ySpeed <= this.topSpeed*axes - pAccelRate){
            this.ySpeed += this.accelRate;
        }
        return true;
    }
    west (axes) {
        if (!axes){ axes = -1 }
        if (this.xSpeed >= this.topSpeed*axes + pAccelRate){
            this.xSpeed -= this.accelRate;
        }
        return true;
    }
    east (axes) {
        if (!axes){ axes = 1 }
        if (this.xSpeed <= this.topSpeed*axes - pAccelRate){
            this.xSpeed += this.accelRate;
        }
        return true;
    }
    sprintAbility (sprintButton) {
        //sprint energy bar
        c.fillStyle = 'rgb(255, 0, 0)';
        c.fillRect(this.x - this.size/2, this.y+this.size*2/3, this.size, 5);
        c.fillStyle = 'rgb(0, 255, 0)';
        c.fillRect(this.x - this.size/2, this.y+this.size*2/3, this.sprintEnergy * (this.size/100), 5);
        //Timer counts to 60 to allow 1 second to pass after releasing sprint before charging sprintEnergy
        if (this.sprintEnergy < sprintEnergyUseRate || !sprintButton){
            this.sprintRechargeTimer +=1;
            this.topSpeed = pTopSpeed;
            this.accelRate = pAccelRate;
            if(this.ySpeed < -pTopSpeed && this.north()){
                this.ySpeed += this.accelRate;
            }
            if (this.ySpeed > pTopSpeed && this.south()){
                this.ySpeed += -this.accelRate;
            }
            if (this.xSpeed < -pTopSpeed && this.west()){
                this.xSpeed += this.accelRate;
            }
            if (this.xSpeed > pTopSpeed && this.east()){
                this.xSpeed += -this.accelRate;
            }
        }
        //charge sprintEnergy if less than 100, the button is released, and a second has passed since use.
        if (this.sprintEnergy < 100 && !sprintButton && this.sprintRechargeTimer > 60){
            this.sprintEnergy += sprintEnergyRechargeRate;
        }
        //don't discharge sprint energy when button is pressed if player is not moving
        if (this.sprintEnergy >= sprintEnergyUseRate && sprintButton && (this.xSpeed !== 0 || this.ySpeed !== 0)){
            this.sprintEnergy -= sprintEnergyUseRate;
            this.topSpeed = sprintTopSpeed;
            this.accelRate = pAccelRate*1.5;
            this.sprintRechargeTimer = 0;
        }
    }
    checkForWallCollision () {
        if (this.square > 4){
            if (this.x <= centerX + squareSize*1.5){
                this.xSpeed = 0;
                this.x = centerX+squareSize*1.5+0.5;
            }
        }
        if (this.x <= 0){
            this.xSpeed = 0;
            this.x = 0.5;
        } else if (this.x > width){
            this.xSpeed = 0;
            this.x = width - 0.5;
        }
        if (this.y < 0){
            this.ySpeed = 0;
            this.y = 0.5;
        } else if (this.y > height){
            this.ySpeed = 0;
            this.y = height - 0.5;
        }
    }
    checkForPlayerCollision (pNum) {
        if (this.newPlayerContactPhysics.tdbpab(pNum) <= this.size/2 && !player[pNum].lose){
           let player1xSpeed = this.newPlayerContactPhysics.player1xSpeedFinal(pNum);
           let player1ySpeed = this.newPlayerContactPhysics.player1ySpeedFinal(pNum);

           let player2xSpeed = this.newPlayerContactPhysics.player2xSpeedFinal(pNum);
           let player2ySpeed = this.newPlayerContactPhysics.player2ySpeedFinal(pNum);

           this.xSpeed = player1xSpeed;
           this.ySpeed = player1ySpeed;
           player[pNum].xSpeed = player2xSpeed;
           player[pNum].ySpeed = player2ySpeed;
           
           let hitHard = new Audio('./modules/scenes/sumo/sounds/normalized/hitHard.mp3');
           hitHard.play();
           return true;
        }
    }
    checkForBallCollision () {
        if (this.tdbpab() <= ball.size/4){
            soundBallHit(this);
            this.ballCollisionConditionCheck();
            let ballxSpeed = this.ballxSpeed();
            let ballySpeed = this.ballySpeed();
            ball.xSpeed = ballxSpeed;
            ball.ySpeed = ballySpeed;
            this.x -= ballxSpeed * 5;
            this.y -= ballySpeed * 5;
            this.xSpeed = 0;
            this.ySpeed = 0;
            ball.hitBy = this.id;
            ball.bounceCount = 0;
            ball.illuminateBall();
        }
    }
    ballCollisionConditionCheck () {
        //allows the serving player to serve without getting out
        if (activeSquare === 0 && ball.bounceCount === 0 && ball.hitBy === 0){
            if (this.square !== 1){
                this.lose = true;
                loseMessage = `${this.name} hit the ball before it was served.`;
            }
        }
        //checks to see if the ball has bounced after serve
        else if (activeSquare === 0 && ball.bounceCount === 0 && ball.hitBy !== 0){
            this.lose = true;
            loseMessage = `${this.name} hit the ball before the serve landed.`;
        }
        //checks to see if the ball is active in player's square
        else if (activeSquare !== this.square && ball.hitBy !== 0){
            this.lose = true;
            loseMessage = `${this.name} hit the ball before it bounced in their square.`;
        }
        //checks to see if the player his the ball twice in a row
        else if (ball.bounceCount === 0 && activeSquare === this.square){
            this.lose = true;
            loseMessage = `${this.name} hit the ball twice in a row.`;
        }
    }

    keyControlsListener () {
        this.up = keys[this.boundUp.keyCode].returnValue;
        this.down = keys[this.boundDown.keyCode].returnValue;
        this.left = keys[this.boundLeft.keyCode].returnValue;
        this.right = keys[this.boundRight.keyCode].returnValue;
        this.sprint = keys[this.boundSprint.keyCode].returnValue;
        this.action = keys[this.boundAction.keyCode].returnValue;
        this.fakeLT = keys[this.boundLeftTrigger.keyCode].returnValue;
        this.fakeRT = keys[this.boundRightTrigger.keyCode].returnValue;
    }
    gamepadControlsListener () {
        this.up = gamepad[this.cNum].axes[this.boundUp];
        this.right = gamepad[this.cNum].axes[this.boundRight];
        this.buttonA = gamepad[this.cNum].buttons[this.boundA].pressed;
        this.buttonB = gamepad[this.cNum].buttons[this.boundB].pressed;
        this.buttonX = gamepad[this.cNum].buttons[this.boundX].pressed;
        this.buttonY = gamepad[this.cNum].buttons[this.boundY].pressed;
        this.buttonLB = gamepad[this.cNum].buttons[this.boundLB].pressed;
        this.buttonRB = gamepad[this.cNum].buttons[this.boundRB].pressed;
        this.leftTrigger = gamepad[this.cNum].buttons[this.boundLT].value;
        this.rightTrigger = gamepad[this.cNum].buttons[this.boundRT].value;
        this.buttonSelect = gamepad[this.cNum].buttons[this.boundSelect].pressed;
        this.buttonLS = gamepad[this.cNum].buttons[this.boundLSClicked].pressed;
        this.buttonRS = gamepad[this.cNum].buttons[this.boundRSClicked].pressed;
        this.buttonDPadUp = gamepad[this.cNum].buttons[this.boundDPadUp].pressed;
        this.buttonDPadDown = gamepad[this.cNum].buttons[this.boundDPadDown].pressed;
        this.buttonDPadLeft = gamepad[this.cNum].buttons[this.boundDPadLeft].pressed;
        this.buttonDPadRight = gamepad[this.cNum].buttons[this.boundDPadRight].pressed;
    }

    controls(enableSprint){
        if (this.controllerType === 'keyboard'){
            this.keyControlsListener();
            this.momentum();
            if (enableSprint){ this.sprintAbility(this.sprint); }
            if (this.up) {
                this.north();
            }
            if (this.down) {
                this.south();
            }
            if (this.left) {
                this.west();
            }
            if (this.right) {
                this.east();
            }
            if (!this.up && !this.down){
                this.resetAccelY();
            } 
            if (!this.left && !this.right){
                this.resetAccelX();
            }
        } else if (this.controllerType === 'gamepad'){
            this.gamepadControlsListener();
            this.momentum();
            if (enableSprint){ this.sprintAbility(this.buttonB); }
            if (this.up < -controllerDeadzone) {
                this.north(this.up);
            }
            if (this.up > controllerDeadzone) {
                this.south(this.up);
            }
            if (this.right < -controllerDeadzone) {
                this.west(this.right);
            }
            if (this.right > controllerDeadzone) {
                this.east(this.right);
            }
            if (this.up > -controllerDeadzone && this.up < controllerDeadzone ){
                this.resetAccelY();
            } 
            if (this.right > -controllerDeadzone && this.right < controllerDeadzone ){
                this.resetAccelX();
            }
        }
    }
    boatControls(){
        if (this.controllerType === 'keyboard'){
            this.keyControlsListener();
            this.rrp.momentum();

            if (this.fakeLT) {
                this.rrp.rowDownL = true;
                this.rrp.angle -= this.rrp.angleChangeRate;
            } else {
                if (this.rrp.rowDownL) {
                    for (let i = 0; i < 7; i++){
                        this.rrp.rowSound[i] = new Audio(`./modules/scenes/Row Race/sounds/splash/splash${i+1}.mp3`);
                    }
                    this.rrp.rowSound[Math.floor(Math.random() * this.rrp.rowSound.length)].play();
                    this.rrp.speed += this.rrp.accelRate;
                    this.rrp.rowDownL = false;
                }
            }
            if (this.fakeRT) {
                this.rrp.rowDownR = true;
                this.rrp.angle += this.rrp.angleChangeRate;
            } else {
                if (this.rrp.rowDownR) {
                    for (let i = 0; i < 7; i++){
                        this.rrp.rowSound[i] = new Audio(`./modules/scenes/Row Race/sounds/splash/splash${i+1}.mp3`);
                    }
                    this.rrp.rowSound[Math.floor(Math.random() * this.rrp.rowSound.length)].play();
                    this.rrp.speed += this.rrp.accelRate;
                    this.rrp.rowDownR = false;
                }
            }
        } else if (this.controllerType === 'gamepad'){
            this.gamepadControlsListener();
            this.rrp.momentum();

            if (this.leftTrigger > 0) {
                this.rrp.leftTriggerValues.push(this.leftTrigger);
                if (this.rrp.leftTriggerValues.length > 1) {
                    this.rrp.highestLTValue = Math.max(this.rrp.leftTriggerValues[0], this.rrp.leftTriggerValues[1]);
                    this.rrp.lowerLTValue = Math.min(this.rrp.leftTriggerValues[0], this.rrp.leftTriggerValues[1])
                    this.rrp.leftTriggerValues.splice(this.rrp.leftTriggerValues.indexOf(this.rrp.lowerLTValue), 1);
                }
                if (this.rrp.highestLTValue >= 0.8) { this.rrp.rowDownL = true}                
                this.rrp.angle -= this.rrp.angleChangeRate;
            }
            if (this.rrp.rowDownL && this.leftTrigger < 0.1) { 
                this.rrp.speed += this.rrp.accelRate*this.rrp.highestLTValue;
                this.rrp.highestLTValue = 0;
                this.rrp.lowerLTValue = 0;
                this.rrp.leftTriggerValues = [];
                for (let i = 0; i < 7; i++){
                    this.rrp.rowSound[i] = new Audio(`./modules/scenes/Row Race/sounds/splash/splash${i+1}.mp3`);
                }
                this.rrp.rowSound[Math.floor(Math.random() * this.rrp.rowSound.length)].play();
                this.rrp.rowDownL = false;
            }
            if (this.rightTrigger > 0 ) {
                this.rrp.rightTriggerValues.push(this.rightTrigger);
                if (this.rrp.rightTriggerValues.length > 1) {
                    this.rrp.highestRTValue = Math.max(this.rrp.rightTriggerValues[0], this.rrp.rightTriggerValues[1]);
                    this.rrp.lowerRTValue = Math.min(this.rrp.rightTriggerValues[0], this.rrp.rightTriggerValues[1])
                    this.rrp.rightTriggerValues.splice(this.rrp.rightTriggerValues.indexOf(this.rrp.lowerRTValue), 1);
                }
                if (this.rrp.highestRTValue >= 0.8) { this.rrp.rowDownR = true}                
                this.rrp.angle += this.rrp.angleChangeRate;
            }
            if (this.rrp.rowDownR && this.rightTrigger < 0.1) { 
                this.rrp.speed += this.rrp.accelRate*this.rrp.highestRTValue;
                this.rrp.highestRTValue = 0;
                this.rrp.lowerRTValue = 0;
                this.rrp.rightTriggerValues = [];
                for (let i = 0; i < 7; i++){
                    this.rrp.rowSound[i] = new Audio(`./modules/scenes/Row Race/sounds/splash/splash${i+1}.mp3`);
                }
                this.rrp.rowSound[Math.floor(Math.random() * this.rrp.rowSound.length)].play();
                this.rrp.rowDownR = false;
             }
        }
    }
}

function assignPlayerNames () {
    for (let i = 0; i < player.length; i++){
        player[i].name = `Player ${i+1}`;
        player[i].pid = i;
    }
}

export function initializePlayers () {
    player[0] = new Player('rgb(0, 255, 0');
    player[1] = new Player('rgb(255, 255, 0');
    player[2] = new Player('rgb(255, 0, 0');
    player[3] = new Player('rgb(0, 0, 255');
    //player[4] = new Player(randomColor());
    //player[5] = new Player(randomColor());
    //player[6] = new Player(randomColor());

    assignPlayerNames();
}


export let player = [];