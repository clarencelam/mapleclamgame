let coinCointer = 0
let todaysCoins = 0
const defaultMinimumCoins = 5
let minimumCoins = 3
const defaultTimer = 20
let timer = 10
let day = 1

// LEVEL ITERATION FUNCTIONS

function genLevel() {
    console.log("Generating Level: " + LEVEL)
    if (LEVEL === "TUTORIAL_M1") {
        genFoodTruck(1100, 532)
        genPlatform(100, 380)
        genPlatform(220, 380)
        genPlatform(600, 520)
    }
    else if (LEVEL === 1) {
        //genFoodTruck(580, 348)
        genPlatform(220, 380)
        genPlatform(100, 380)
        genPlatform(600, 520)
        playBgMusic()
        genThornBush(700, 650)
    }
    else if (LEVEL === 2) {
        player.position.x = 100
        player.position.y = 100
        genFoodTruck(580, 348)
        genThornBush(700, 650)
        genPlatform(220, 380)
        genPlatform(100, 380)
        genPlatform(600, 520)
        genPlatform(1100, 200)
        genPlatform(1400, 550)
        genPlatform(1400, 380)
    }
    else if (LEVEL === 3) {
        player.position.x = 100
        player.position.y = 100
        genFoodTruck(580, 348)
        genThornBush(700, 650)
        genPlatform(220, 380)
        genPlatform(100, 380)
        genPlatform(600, 520)
        genPlatform(1100, 200)
        genPlatform(1400, 550)
        genPlatform(1400, 380)
    }
}

function nextLevel() {
    // In this state, mushroom is in the next level map, but game is not yet active until they interact with the foodstand
    if (GAMESTATE === 'BETWEENLEVELS') {
        // background update
        resetToActiveBackground()
        
        playTeleportSfx()

        // initiate objects
        resetArrays()

        genLevel()
        resetTimer()
        genPortal(1300, 525)

        // show active game ui, suppress inbetween game ui
        document.querySelector("#nextLevel").style.display = 'none'
        toShow = ["#coinCounter", "#timer", "#cookingTotal", "#totalCoinCounter"]
        for (let i in toShow) {
            document.querySelector(`${toShow[i]}`).style.display = 'inline'
        }

        // add beforeLevel message
        let beforeLevelSummary = new Message({
            position: {
                x: 370,
                y: 30
            },
            imageSrc: `./img/messages1/messageTemplate.png`,
            scale: 0.55
        })
        messages.push(beforeLevelSummary)
        if (levelCoinChange === 0) {
            document.querySelector("#beforeLevel").innerHTML = `Welcome to day ${day} of the restaurant biz! <br><br>Rent's stayed the same! <br><br>We'll need ${minimumCoins} mesos to get through the day!`
        } else {
            document.querySelector("#beforeLevel").innerHTML = `Welcome to day ${day} of the restaurant biz! <br><br>Rent's gone up... <br><br>We'll need ${minimumCoins} mesos to get through the day!`
        }
        GAMESTATE = "BEFORELEVEL"
        player.position.x = 1350
        player.position.y = 500

    }
}


function goBetweenLevels() {
    // In this state, mushroom is at home, resting between levels
    // Function called after the conclusion of a successful level, after summary screen
    console.log("GAMESTATE CHANGE: GOING INBETWEEN LEVELS")
    GAMESTATE = "BETWEENLEVELS"

    // play sound effect
    playTeleportSfx()

    // clear objects
    toHide = ["#coinCounter", "#timer", "#levelEnd", "#cookingTotal"]
    for (let i in toHide) {
        document.querySelector(`${toHide[i]}`).style.display = 'none'
    }
    todaysCoins = 0
    document.querySelector('#coinCounter').innerHTML = `Today's Coins: ${todaysCoins}`
    resetArrays()

    // background = home (upgrade room), with portal to next level
    background = new Sprite({
        position: {
            x: 0,
            y: 0
        },
        imageSrc: './img/backgrounds/home.png',
        scale: .57
    })
    genPortal(120, 600)
    player.position.x = 130
    player.position.y = 600

}

levelCoinChange = 0
function incrementLevel() {
    // increment level difficulty
    levelCoinChange = randomRoll(3)
    minimumCoins = minimumCoins + levelCoinChange
    console.log("Current level: " + LEVEL + " - Level coin requirement increase: " + levelCoinChange + ", for a total of: " + minimumCoins)

    // for now, loop levels after 3
    if(LEVEL===3){
        LEVEL =1
    }else{
        LEVEL += 1
    }
    day +=1
}

function determineWinLoss() {
    // STATE WHERE DAY SUMMARY IS SHOWN, RIGHT BEFORE BETWEENLEVELS
    if(keys.space.pressed){
        console.log("show win/loss message")

        keys.space.pressed = false
        GAMESTATE = "INACTIVE"

        messages = []
        let daySummary = new Message({
            position: {
                x: 250,
                y: 50
            },
            imageSrc: `./img/messages1/messageTemplate.png`,
            scale: 0.8
        })
        messages.push(daySummary)
        document.querySelector("#levelEnd").style.display = 'flex'
        document.querySelector("#levelEnd").style.left = `${daySummary.position.x + 100}` + 'px'
        document.querySelector("#levelEnd").style.top = `${daySummary.position.y + 100}` + 'px'

        if (todaysCoins > minimumCoins) {
            playWinGameSfx()
            document.querySelector("#levelEnd").innerHTML = `That's a wrap for day ${day}!<br><br>You made an incredible ${todaysCoins} mesos today!<br><br>${minimumCoins} mesos goes to us, so you'll bring home ${todaysCoins - minimumCoins} extra.<br><br>Good work. See you tomorrow.`
        } else if (todaysCoins === minimumCoins) {
            playWinGameSfx()
            document.querySelector("#levelEnd").innerHTML = `Day ${day} is complete!<br><br>You made ${todaysCoins} mesos for the restaurant today.<br><br>${minimumCoins} mesos goes to us, so sorry-- nothing for you to take home tonight<br><br>Unfortunately work unions aren't big on maple island... better luck tomorrow.`
        }else {
            // LOSS CASE
            playFailSfx()
            document.querySelector("#levelEnd").innerHTML = `You made ${todaysCoins} mesos from your shift today. The minimum was ${minimumCoins}.<br><br>It's been a good ${day} days with you, but... <br><br>You're fired. Refresh to try again!`
        }

    }
}



function endLevel() {
    // triggered by TIMER === 0
    // in this state, the game continues, but no food will be produced, and level may be ended by interacting with 
    if (GAMESTATE === "ACTIVE") {
        // Position truck's message over foodtruck object
        msg_x = foodTrucks[0].position.x
        msg_y = foodTrucks[0].position.y - 200

        messages = []
        let msg1 = new Message({
            position: {
                x: msg_x,
                y: msg_y
            },
            imageSrc: `./img/messages1/textBox.png`,
            scale: 2
        })
        messages.push(msg1)
        document.querySelector("#levelEnd").innerHTML = "Restaurant's closed<br>for the day!<br><br>Come over when you're<br>ready to close up.<br>"
        document.querySelector("#levelEnd").style.left = `${msg_x + 50}` + 'px'
        document.querySelector("#levelEnd").style.top = `${msg_y + 50}` + 'px'
        document.querySelector("#levelEnd").style.display = 'flex'

        GAMESTATE = "AFTERLEVEL" // within this gamestate, determine stats
    }

}



function restartGame() {
    timer = defaultTimer
    console.log("reset pressed")

    // hide and show appropriate HTML elements
    document.querySelector("#levelEnd").style.display = 'none'
    toShow = ["#coinCounter", "#timer", "#cookingTotal"]
    for (let i in toShow) {
        document.querySelector(`${toShow[i]}`).style.display = 'inline'
    }
    pauseBgMusic()
    resetToActiveBackground()

    // DEFINE PLAYER
    player = new Player({
        position: {
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
    minimumCoins = defaultMinimumCoins
    day = 1

    resetArrays()

    GAMESTATE = "TUTORIAL"
    LEVEL = "TUTORIAL_M1"
}