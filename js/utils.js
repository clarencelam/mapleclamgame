/// UTILS: Functions that will be commonly used to support other functionality

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


// LEVEL ITERATION FUNCTIONS

function endLevel() { 
    if (GAMESTATE === "ACTIVE") {
        GAMESTATE = "INACTIVE"
        console.log("end level activated")

        messages = []
        let daySummary = new Message({
            position: {
                x: 250,
                y: 200
            },
            imageSrc: `./img/messages1/messageTemplate.png`,
            scale: 0.8
        })
        messages.push(daySummary)

        document.querySelector("#levelEnd").style.display = 'flex'

        // WIN CASE
        if (todaysCoins >= minimumCoins) {
            // press space to go to betweenLevels state
            if (todaysCoins > minimumCoins) {
                document.querySelector("#levelEnd").innerHTML = `Your day is complete!<br><br>You made an incredible ${todaysCoins} mesos today!<br><br>We'll pay you out the ${todaysCoins - minimumCoins} extra mesos<br><br>Good work. See you tomorrow.`
            } else if (todaysCoins === minimumCoins) {
                document.querySelector("#levelEnd").innerHTML = `Your day is complete!<br><br>You made ${todaysCoins} mesos for the restaurant today.<br><br>${minimumCoins} mesos goes to us, so sorry-- nothing for you to take home tonight<br><br>Unfortunately work unions aren't big on maple island... better luck tomorrow.`
            }
            document.getElementById("gameWindow").addEventListener('click', () => {
                    goBetweenLevels()
            }, { once: true })

        } else {
            // LOSS CASE
            document.querySelector("#levelEnd").innerHTML = `You made ${todaysCoins} mesos from your shift today. The minimum was ${minimumCoins}.<br><br>You're fired. Refresh to try again!`
        }
    }
}

function goBetweenLevels(){
    console.log("GAMESTATE CHANGE: GOING INBETWEEN LEVELS")
    GAMESTATE = "BETWEENLEVELS"

    // clear objects
    toHide = ["#coinCounter","#timer","#levelEnd","#cookingTotal"]
    for(let i in toHide){
        document.querySelector(`${toHide[i]}`).style.display = 'none'
    }

    messages = []
    customers = []
    enemies = []
    coins = []
    thornBushes = []
    platforms = []
    portals = []

    // background = home (upgrade room), with portal to next level
    background = new Sprite({
        position:{
            x: 0,
            y: 0
        },
        imageSrc: './img/backgrounds/home.png',
        scale: .57
    })

    advanceLevelPortal = new Portal({
        position:{
        x: 120,
        y: 600
        },
     imageSrc: './img/portal/portalsprite.png',
     scale: 1}
     )
    portals.push(advanceLevelPortal)
    }

function startLevel(){
    // make Gamestate = active
    // increment level
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
    }

}


function restartGame(){
    timer = 3
    console.log("reset pressed")

    // hide and show appropriate HTML elements
    document.querySelector("#levelEnd").style.display = 'none'
    toShow = ["#coinCounter","#timer","#cookingTotal"]
    for(let i in toShow){
        document.querySelector(`${toShow[i]}`).style.display = 'inline'
    }
    pauseBgMusic()
    


background = new Sprite({
    position:{
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png',
    scale: 1.41
})

// DEFINE PLAYER
player = new Player({
    position:{
        x: 1200,
        y: 620
    },
    velocity: {
        x: 0,
        y: 10
    },
    imageSrc: './img/player/idle.png',
    scale: 1.4,
    framesMax: 4,
    sprites: {
        idle: {
            imageSrc: './img/player/idle.png',
            framesMax: 4
        },
        idleRight: {
            imageSrc: './img/player/idleRight.png',
            framesMax: 4
        },
        move: {
            imageSrc: './img/player/move.png',
            framesMax: 6
        },
        moveRight: {
            imageSrc: './img/player/moveRight.png',
            framesMax: 6
        },
        jump: {
            imageSrc: './img/player/jump.png',
            framesMax: 1
        },
        jumpRight: {
            imageSrc: './img/player/jumpRight.png',
            framesMax: 1
        },
    }
})

 coinCointer = 0
 todaysCoins = 0
 minimumCoins = 0

    messages = []
    customers = []
    enemies = []
    coins = []
    thornBushes = []
    platforms = []
    portals = []

    GAMESTATE = "TUTORIAL"
    LEVEL = "TUTORIAL_M1"
}