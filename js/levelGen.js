let coinCointer = 0
let todaysCoins = 0
const defaultMinimumCoins = 1
let minimumCoins = 0
const defaultTimer = 10
let timer = 3

// LEVEL ITERATION FUNCTIONS

function genLevel() {
    console.log("Generating Level: " + LEVEL)
    if (LEVEL=== "TUTORIAL_M1"){
        genFoodTruck(580, 348)
        genPlatform(220, 380)
        genPlatform(100, 380)
        genPlatform(600, 520)
        genPlatform(1100, 200)
        genPlatform(1400, 550)
        genPlatform(1400, 380)
    }
    else if (LEVEL === 1) {
        playBgMusic()
        genThornBush(700, 630)
    }
    else if (LEVEL === 2) {
        player.position.x = 100
        player.position.y = 100
        genFoodTruck(580, 348)
        genThornBush(700, 630)
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
        genThornBush(700, 630)
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
        background = new Sprite({
            position: {
                x: 0,
                y: 0
            },
            imageSrc: './img/background.png',
            scale: 1.41
        })

        // initiate objects
        resetArrays()

        genLevel()
        resetTimer()
        genPortal(1300, 500)

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
            document.querySelector("#beforeLevel").innerHTML = `Welcome to day ${LEVEL} of the restaurant biz! <br><br>Rent's stayed the same! <br><br>We'll need ${minimumCoins} mesos to get through the day!`
        } else {
            document.querySelector("#beforeLevel").innerHTML = `Welcome to day ${LEVEL} of the restaurant biz! <br><br>Rent's gone up... <br><br>We'll need ${minimumCoins} mesos to get through the day!`
        }
        GAMESTATE = "BEFORELEVEL"
        player.position.x = 1350
        player.position.y = 500

    }
}


function goBetweenLevels() {
    // In this state, mushroom is at home, resting between levels
    console.log("GAMESTATE CHANGE: GOING INBETWEEN LEVELS")
    GAMESTATE = "BETWEENLEVELS"

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
function incrementLevel(){
        // increment level difficulty
        levelCoinChange = randomRoll(3)
        minimumCoins = minimumCoins + levelCoinChange
        console.log("Leve coin requirement increase: " +levelCoinChange + ", for a total of: " + minimumCoins)
        LEVEL +=1    
}

function endLevel() {
    // in this state, the level is just ended, and level summaries are being shown
    if (GAMESTATE === "ACTIVE") {
        GAMESTATE = "INACTIVE"
        console.log("GAMESTATE CHANGE: INACTIVE -- ending level")

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
            // increment levels
            if (todaysCoins > minimumCoins) {
                document.querySelector("#levelEnd").innerHTML = `Your day is complete!<br><br>You made an incredible ${todaysCoins} mesos today!<br><br>We'll pay you out the ${todaysCoins - minimumCoins} extra mesos<br><br>Good work. See you tomorrow.`
            } else if (todaysCoins === minimumCoins) {
                document.querySelector("#levelEnd").innerHTML = `Your day is complete!<br><br>You made ${todaysCoins} mesos for the restaurant today.<br><br>${minimumCoins} mesos goes to us, so sorry-- nothing for you to take home tonight<br><br>Unfortunately work unions aren't big on maple island... better luck tomorrow.`
            }
            document.getElementById("gameWindow").addEventListener('click', () => {
                incrementLevel()
                goBetweenLevels()
            }, { once: true })

        } else {
            // LOSS CASE
            document.querySelector("#levelEnd").innerHTML = `You made ${todaysCoins} mesos from your shift today. The minimum was ${minimumCoins}.<br><br>You're fired. Refresh to try again!`
        }
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



    background = new Sprite({
        position: {
            x: 0,
            y: 0
        },
        imageSrc: './img/background.png',
        scale: 1.41
    })

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

    resetArrays()

    GAMESTATE = "TUTORIAL"
    LEVEL = "TUTORIAL_M1"
}