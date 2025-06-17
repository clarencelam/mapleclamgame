let coinCointer = 0
let todaysCoins = 0
const defaultMinimumCoins = 1
let minimumCoins = 1
levelCoinChange = 0
const defaultTimer = 12
let day = 1
let playerlives = 10
let levelCounter = 1  //  Track current level number


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
        resetTimer()
        GAMESTATE = "ACTIVE"
        decreaseTimer()
    }
    else {
        // NEW: Dynamic level generation for levels 2+
        generateDynamicLevel()
    }
}
// NEW: Dynamic level generation function
function generateDynamicLevel() {
    player.position.x = 100
    player.position.y = 100
    
    // Always include a food truck (positioned randomly but accessibly)
    const foodTruckX = Math.random() * (canvas.width - 500) + 200 // Keep away from edges
    const foodTruckY = Math.random() * 200 + 300 // Between y=300-500
    genFoodTruck(foodTruckX, foodTruckY)
    
    // Generate thornbushes (1-3 per level)
    const thornCount = Math.floor(Math.random() * 3) + 1
    for (let i = 0; i < thornCount; i++) {
        const thornX = Math.random() * (canvas.width - 100)
        genThornBush(thornX, 650)
    }
    
    // Generate platforms with variety but ensure accessibility
    generateAccessiblePlatforms()
    }


// NEW: Generate platforms that are accessible to the player
function generateAccessiblePlatforms() {
    const maxJumpHeight = 180 // Player's max jump reach
    const floorY = 703 // player.bottomYCordsActive
    const minPlatformY = 200 // Don't generate platforms too high
    const platformWidth = 215 // Standard platform width
    
    // Always generate some low platforms for basic navigation
    const basePlatforms = Math.floor(Math.random() * 3) + 2 // 2-4 base platforms
    for (let i = 0; i < basePlatforms; i++) {
        const x = Math.random() * (canvas.width - platformWidth)
        const y = Math.random() * 200 + 430 // Between y=430-630
        genPlatform(x, y)
    }
    
    // Generate connected platform chains (ensuring accessibility)
    const chainCount = Math.floor(Math.random() * 2) + 1 // 1-2 chains
    for (let chain = 0; chain < chainCount; chain++) {
        generatePlatformChain()
    }
}
// NEW: Generate a chain of connected platforms
function generatePlatformChain() {
    const maxJumpHeight = 180
    const maxJumpDistance = 200 // Horizontal jump distance
    const platformWidth = 215
    const chainLength = Math.floor(Math.random() * 4) + 2 // 2-5 platforms per chain
    
    // Start position for the chain
    let currentX = Math.random() * (canvas.width - chainLength * maxJumpDistance)
    let currentY = Math.random() * 300 + 250 // Between y=250-550
    
    for (let i = 0; i < chainLength; i++) {
        genPlatform(currentX, currentY)
        
        // Calculate next platform position (within jump range)
        if (i < chainLength - 1) {
            const nextX = currentX + (Math.random() * maxJumpDistance) + 50 // Move right
            const nextY = currentY + (Math.random() * maxJumpHeight * 2) - maxJumpHeight // Can go up or down
            
            // Ensure next platform is within bounds and accessible
            currentX = Math.max(0, Math.min(canvas.width - platformWidth, nextX))
            currentY = Math.max(200, Math.min(600, nextY)) // Keep within reasonable bounds
        }
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
        if (timerID) {
            clearTimeout(timerID);
        }    
        resetTimer()
        genPortal(1300, 525)

        // show active game ui, suppress inbetween game ui
        document.querySelector("#nextLevel").style.display = 'none'
        toShow = ["#coinCounter", "#timer", "#cookingTotal", "#totalCoinCounter"]
        for (let i in toShow) {
            document.querySelector(`${toShow[i]}`).style.display = 'inline'
        }
    
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

function incrementLevel() {
    // increment level difficulty
    // Called in GAMESTATE = INACTIVE when player closes summary screen
    minimumCoins = minimumCoins + levelCoinChange
    console.log("Current level: " + LEVEL + " - Level coin requirement increase: " + levelCoinChange + ", for a total of: " + minimumCoins)

    // NEW: Always increment level instead of looping
    LEVEL += 1
    day += 1
    levelCounter += 1 

    // Update level counter UI
    if (document.querySelector('#levelCounter')) {
        document.querySelector('#levelCounter').innerHTML = `Level: ${levelCounter}`
    }
}

function determineWinLoss() {
    // STATE WHERE DAY SUMMARY IS SHOWN, RIGHT BEFORE BETWEENLEVELS
        console.log("show win/loss message")

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



function endLevel() {
    // triggered by TIMER === 0
    if (GAMESTATE === "ACTIVE") {
        determineWinLoss()
    }
}

function restartGame() {
    timer = defaultTimer;
    console.log("reset pressed");

    // Clear the existing timer to prevent it from continuing
    if (timerID) {
        clearTimeout(timerID);
    }

    // hide and show appropriate HTML elements
    document.querySelector("#levelEnd").style.display = 'none';
    toShow = ["#coinCounter", "#timer", "#cookingTotal", "#livesCounter", "#levelCounter"];
    for (let i in toShow) {
        document.querySelector(`${toShow[i]}`).style.display = 'inline';
    }
    pauseBgMusic();
    resetToActiveBackground();

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
    });

    // NEW: Reset lives and update UI
    player.lives = playerlives;
    if (document.querySelector('#livesCounter')) {
        document.querySelector('#livesCounter').innerHTML = `Lives: ${player.lives}`;
    }

    coinCointer = 0;
    todaysCoins = 0;
    minimumCoins = defaultMinimumCoins;
    day = 1;
    levelCounter = 1; 

    // Update level counter UI
    if (document.querySelector('#levelCounter')) {
        document.querySelector('#levelCounter').innerHTML = `Level: ${levelCounter}`
    }

    resetArrays();

    GAMESTATE = "TUTORIAL";
    LEVEL = "TUTORIAL_M1";
}


