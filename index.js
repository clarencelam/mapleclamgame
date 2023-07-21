const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')

// will use 16:9 aspect ratio (1440 x 810)
canvas.width = (480*3)
canvas.height = (270*3)

//c.fillRect(0,0, canvas.width, canvas.height)

var audio = new Audio('music/henesys.mp3',loop="loop");
function playBgMusic() {
    audio.volume=.5
    audio.play()
  }
function pauseBgMusic(){
    audio.pause()
}

var background = new Sprite({
    position:{
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png',
    scale: 1.41
})

// DEFINE PLAYER
var player = new Player({
    position:{
        x: 50,
        y: 10
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

var customers = []
var enemies = []
var coins = []
var thornBushes = []
var platforms = []
var portals = []
var foodTrucks = []


// declaring keys state 
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowDown:{
        pressed: false
    },
    space:{
        pressed: false
    }
}

// DECLARE STARTING GAMESTATE & LEVEL
// GAMESTATES DETERMINE WHAT GAME FUNCTIONALITY IS ACTIVE
// LEVEL DETERMINES WHAT MESSAGES ARE SHOWN ON THE SCREEN, CORRESPONDING TO EACH "STAGE" OF THE GAME
let GAMESTATE = "TUTORIAL"
let LEVEL = "TUTORIAL_M1"

function checkPlatforms(platform){
    return(
        player.position.x + player.offset_x >= thisPlatform.position.x &&
        player.position.x + player.offset_x + player.width <= thisPlatform.position.x + thisPlatform.width &&
        player.position.y + player.offset_y + player.height <= thisPlatform.position.y
    )
}

function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle= 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()

    // Handle platform logic
    player.bottomYCordsActive = 682 // re-apply base bottom Y coords
    player.bottomYCordsBetweeenLevels = 770 // re-apply base bottom Y coords
    for(const i in platforms){
        // if player x within platform && y above platform, player y does not go below platform y
        thisPlatform = platforms[i]
        if(
            checkPlatforms(thisPlatform)
        ){
            //  player y+height does not go below platform y
            player.bottomYCordsActive = thisPlatform.position.y -1
        } 
    }

    // HANDLING "INACTIVE" GAMESTATE
    if(GAMESTATE === "INACTIVE" || GAMESTATE === "TUTORIAL"){
        if(GAMESTATE === "TUTORIAL"){
            handleTutorial()
            handleCoinPlayerInteractions()
            handleFoodPlayerInteractions()
        }
        if (GAMESTATE === "INACTIVE") { // this gamestate is triggered when a level ends, after level summary is shown, but before going to BETEWEENLEVELS
            if (keys.space.pressed && todaysCoins >= minimumCoins) {
                incrementLevel()
                goBetweenLevels() // go to gamestate === BETWEENLEVELS
            } else{
                //gameover
                console.log("game over")
            }
        }
        // DRAW/UPDATE SELECT OBJECTS
        for(const i in foodTrucks){
            foodTrucks[i].update()
        }
        for (const i in platforms){
            platforms[i].update()
        }
        for (const num in customers) {
            customers[num].update()
        }
        for (const num in coins) {  
            coins[num].update()
            if (coins[num].COINSTATE === "markedForDeath") {
                console.log('delete coin: ' + coins[num])
                coins.splice(num, 1)
            }
        }
        for (const i in enemies) {
            enemies[i].update()
        }
        player.update()

        for(const i in messages){
            messages[i].update()
        }
    }

    if(GAMESTATE === "BEFORELEVEL"){
        // DRAW/UPDATE SELECT OBJECTS
        for (const i in portals) {
            portals[i].update()
        }
        for(const i in foodTrucks){
            foodTrucks[i].update()
        }
        for (const i in platforms){
            platforms[i].update()
        }
        for (const num in customers) {
            customers[num].update()
        }
        for (const num in coins) {  
            coins[num].update()
        }
        for (const i in enemies) {
            enemies[i].update()
        }
        player.update()

        if(portals.length>0){
            if(spriteCollision({rectangle1: player, rectangle2: portals[0]}) && keys.ArrowDown.pressed){
                goBetweenLevels()
                keys.ArrowDown.pressed = false
                console.log("go back to GAMESTATE = 'BETWEENLEVELS'")
            }
        }


        // if player is over foodtruck, give option to start level
        if(foodTrucks.length>0 && spriteCollision({rectangle1: player, rectangle2: foodTrucks[0]})){
            document.querySelector("#beforeLevel").style.display = 'flex'
                for(const i in messages){
                    messages[i].update()
                }
                if(keys.space.pressed){
                    keys.space.pressed = false
                    GAMESTATE = "ACTIVE"
                    // clear messages
                    document.querySelector("#beforeLevel").style.display = 'none'
                    messages = []
                    decreaseTimer()    
                }
    
                // document.getElementById("gameWindow").addEventListener("click",(startLevel) => {
                //     if(GAMESTATE === "BEFORELEVEL"){
                //         GAMESTATE = "ACTIVE"
                //         // clear messages
                //         document.querySelector("#beforeLevel").style.display = 'none'
                //         messages = []
                //         decreaseTimer()    
                //     }
                // }, {once:true})
                
            } else{
                document.querySelector("#beforeLevel").style.display = 'none'
            }

    }
    
    // HANDLING "BETWEENLEVELS" GAMESTATE
    if(GAMESTATE === "BETWEENLEVELS"){
        for (const i in portals) {
            portals[i].update()
        }
        player.update()
        for(const i in messages){
            messages[i].update()
        }

        // if(spriteCollision({rectangle1: player,
        //     rectangle2: portals[0]})){
        //         if(messages.length < 1){
        //             let nextLevelSummary = new Message({
        //                 position: {
        //                     x: 250,
        //                     y: 200
        //                 },
        //                 imageSrc: `./img/messages1/messageTemplate.png`,
        //                 scale: 0.8
        //             })
        //             messages.push(nextLevelSummary)
            
        //             document.querySelector("#nextLevel").innerHTML = `Ready to open the restaurant? <br><br>We'll need ${minimumCoins} mesos to stay afloat`
        //             document.querySelector("#nextLevel").style.display = 'flex'
            
        //         }
        //     } else{
        //         messages = []
        //         document.querySelector("#nextLevel").style.display = 'none'
        //     }
    
        if(spriteCollision({rectangle1: player,
        rectangle2: portals[0]}) && keys.ArrowDown.pressed){
            // iterate levels
            console.log("go to nextlevel")
            keys.ArrowDown.pressed = false
            nextLevel()
        }

    }
    
    // HANDLING "ACTIVE" GAMESTATE
    if(GAMESTATE === "ACTIVE" || GAMESTATE === "AFTERLEVEL"){

        // UPDATE ALL OBJECTS
        for(const i in messages){
            messages[i].update()
        }

        for(const i in foodTrucks){
            foodTrucks[i].update()
        }

        for (const i in platforms){
            platforms[i].update()
        }
         for (const num in customers) {
            customers[num].update()
            if (customers[num].position.y > canvas.height) {
                customers.splice(num, 1)
                console.log('delete cust')
            }
        }
        for (const num in coins) {  // Update Coins, splice those MarkedForDeath
            coins[num].update()
            if (coins[num].COINSTATE === "markedForDeath") {
                console.log('delete coin: ' + coins[num])
                coins.splice(num, 1)
            }
        }
        for (const i in enemies) {
            enemies[i].update()
        }
        player.update()

        // LEVEL 1 SPAWNS
        if(customers.length<5){
            let x = Math.floor(Math.random()* canvas.width)
            genCust(x, 200)
        }


        if(enemies.length<1){
            let x = Math.floor(Math.random()* canvas.width)
            genGrunt(x,200)
        }
            

        // Check if GAME OVER due to thornbush collision
        handleThornBushPlayerInteractions() // defined in utils.js

        // Detect Food Customer Collision
        // Make Food stick to Cust if Food is eaten and Cust is eating 
        handleFoodPlayerInteractions() // defined in utils.js
    
        // Check if Player collides with Coins
        // Make coin stick to Player upon pickup 
        handleCoinPlayerInteractions() // defined in utils.js

        handleEnemyPlayerInteractions()

        if(GAMESTATE === "AFTERLEVEL"){
            if (spriteCollision({ rectangle1: player, rectangle2: foodTrucks[0] })) {
                determineWinLoss()
            }
        }
    }
}

animate()

// Key listeners
window.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'd':
                case 'ArrowRight':
                keys.d.pressed = true
                player.lastKey = 'd'
                break
            case 'a':
                case 'ArrowLeft':
                keys.a.pressed = true
                player.lastKey = 'a'
                break
            case 'w':
                case 'ArrowUp':
                player.jump()
                break
            case ' ':
                player.throw()
                keys.space.pressed = true
                break
            case 'ArrowDown':
                keys.ArrowDown.pressed = true
                break
            }    
            event.preventDefault()
    }
)

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            case 'ArrowRight':
            keys.d.pressed = false
            break
        case 'a':
            case 'ArrowLeft':
            keys.a.pressed = false
            break    
        case 'ArrowDown':
            keys.ArrowDown.pressed = false
            break
        case ' ':
            keys.space.pressed = false
            break

    }
})