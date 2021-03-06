import { settingsOpen } from "./settings.js"
import { checkSettings } from "../../js/localStorage.js";
checkSettings(false);
import { checkHighscores } from "../../js/highScores.js";
checkHighscores(false);

let highScores = JSON.parse(localStorage.getItem("highScores"));
export var started = false;
var character = document.getElementById("character");
var block = document.getElementById("block");
var score = 0;
let highscore = highScores[0].virusjump;
var die = true;
var last1k = 0;
let allowjump = true;

document.getElementById("highscore").innerHTML = "High score: " + numComma(highscore);

const jumpSound = new sound("./snd/jump.wav");
const extraSound = new sound("./snd/1k.wav");
const gameoverSound = new sound("./snd/gameover.wav");
export const rickrollSound = new sound("./snd/rickroll.wav");

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        let settings = JSON.parse(localStorage.getItem("settings"));
        if (settings[0].sound == true) this.sound.currentTime = 0;
        if (settings[0].sound == true) this.sound.play();
    }
    this.stop = function(){
        let settings = JSON.parse(localStorage.getItem("settings"));
        if (settings[0].sound == true) this.sound.pause();
    }
}

function button(){
    if (allowjump == false) return;
    if (settingsOpen == true) return;
    if (started == true){
        jump();
    } else {
        start();
    }
}

document.addEventListener("keydown", evt => {
    if (allowjump == false) return;
    if (settingsOpen == true) return;
    if (evt.keyCode === 32){
        jump();
    }
    if (evt.keyCode === 13){
        if (started == false){
            start();
        }
    }
})

document.getElementById("button").addEventListener("click", () => {
    button()
})

function jump(){
    if (started == true){
        if (character.classList != "animate"){
            character.classList.add("animate");
            jumpSound.play();
        }
    }
    setTimeout(function(){
        if (character.classList = "animate"){
            character.classList.remove("animate");
        }
    }, 500);;
}

var checkDead = setInterval(function(){
    var characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
    var blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));
    if (started == true){
        if (blockLeft < 20 && blockLeft > 0 && characterTop >= 130){
            if (die == true){
                stop();
            } else {
                if (score - last1k > 50){
                    score = score + 1000;
                    last1k = score;
                    document.getElementById("block").style.display = "none";
                    extraSound.play();
                    setTimeout(function(){
                        document.getElementById("block").style.display = "block";
                    }, 100);
                }
            }
        } else {
            score = score + 1;
            document.getElementById("score").innerHTML = numComma(score);
        }
        if (die == true){
            block.style.backgroundImage = "url(./img/block.png)";
        } else {
            block.style.backgroundImage = "url(./img/1k.png)";
        }
    }
}, 10);

function stop(){
    gameoverSound.play();
    var newhs = false;
    document.getElementById("score").innerHTML = numComma(score);
    if (score > highscore){
        newhs = true;
        highScores[0].virusjump = score;
        localStorage.setItem("highScores", JSON.stringify(highScores));
        highscore = score;
    }
    document.getElementById("highscore").innerHTML = "High score: " + numComma(highscore);
    setTimeout(function(){
        rickrollSound.play();
        document.getElementById("gameoverMessage").classList.add("show");
        if (newhs == true){
            document.querySelector("[data-gameover-message-text]").innerText = "You caught the virus!\nScore: " + numComma(score) + "\nNew high score!";
        } else{
            document.querySelector("[data-gameover-message-text]").innerText = "You caught the virus!\nScore: " + numComma(score);
        }
        allowjump = false;
        block.style.animation = "none";
        block.style.display = "none";
        started = false;
        score = 0;
        last1k = 0;
        die = true;
        document.getElementById("score").innerHTML = 0;
        document.getElementById("button").innerHTML = "Start (enter)";
    }, 1);
}

document.getElementById("restartButton").addEventListener("click", () => {
    document.getElementById("gameoverMessage").classList.remove("show");
    allowjump = true;
    rickrollSound.stop();
})

function start(){
    started = true;
    document.getElementById("highscore").innerHTML = "High score: " + numComma(highscore);
    block.style.display = "block";
    block.style.animation = "block 1200ms infinite linear";
    document.getElementById("button").innerHTML = "Jump (space)";
    var interval = setInterval(function(){
        if (started == true){
            var int = randomInt(1, 10);
            if (int == 1){
                die = false;
            } else{
                die = true;
            }
        } else clearInterval(interval);;
    }, 1200);
}

function numComma(numb) {
    var str = numb.toString().split(".");
    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return str.join(".");
}
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}