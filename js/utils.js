/// UTILS: Functions that will be commonly used to support other functionality

function randomRoll(max){
    return Math.floor(Math.random()* max)
}

// Play bg music
var audio = new Audio('music/henesys.mp3');
function playBgMusic() {
    audio.volume=musicVolume
    audio.play()
    audio.loop = true
  }
function pauseBgMusic(){
    audio.pause()
}

// teleport sfx
function playTeleportSfx(){
    var teleportNoise = new Audio('sfx/teleport.wav');
    teleportNoise.volume = soundVolume
    teleportNoise.play()    
}

function playWinGameSfx(){
    var winNoise = new Audio('sfx/winGame.wav');
    winNoise.volume = soundVolume
    winNoise.play()    
}

function playFailSfx(){
    var failNoise = new Audio('sfx/fail.wav');
    failNoise.volume = soundVolume
    failNoise.play()    
}

function startRolls(sprite, decisionInterval, max){
    // generate 
    // may need to revisit this later to ensure Timeout is deleted when object is removed
    function roll(){
        setTimeout(roll,decisionInterval)
        let num = Math.floor(Math.random()* max)
        sprite.movementDecision(num)
    }
    roll()
}

function spriteCollision({ rectangle1, rectangle2 }) {
    var rectangle1Height = rectangle1.height
    var rectangle1Width = rectangle1.width

    var rectangle2Height = rectangle2.height
    var rectangle2Width = rectangle2.width

    var rectangle1_x = rectangle1.position.x + rectangle1.offset_x
    var rectangle1_y = rectangle1.position.y + rectangle1.offset_y

    var rectangle2_x = rectangle2.position.x + rectangle2.offset_x
    var rectangle2_y = rectangle2.position.y + rectangle2.offset_y


    return (
        rectangle1_x + rectangle1Width >= rectangle2_x &&
        rectangle1_x <= rectangle2_x + rectangle2Width &&
        rectangle1_y + rectangle1Height >= rectangle2_y &&
        rectangle1_y <= rectangle2_y + rectangle2Height
    )
}

function decreaseTimer() {
    if (timer > 0) {
        console.log('timer increment')
        timerID = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
        console.log(timer)
    }

    if (timer === 0) {
        endLevel()
        console.log('attempt endlevel')
    }

}

function resetTimer(){
    if(timer === 0){
        timer = defaultTimer
        document.querySelector('#timer').innerHTML = timer
    }
}

function resetArrays(){
    player.foods = []
    player.cookedFood = []
    messages = []
    customers = []
    enemies = []
    coins = []
    thornBushes = []
    platforms = []
    portals = []
    foodTrucks = []
}

function resetToActiveBackground(){
    background = new Sprite({
        position: {
            x: 0,
            y: 0
        },
        imageSrc: './img/backgrounds/henebg.png',
        scale: 1.27
    })
}