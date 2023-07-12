const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')

// will use 16:9 aspect ratio (1440 x 810)
canvas.width = (480*3)
canvas.height = (270*3)

//c.fillRect(0,0, canvas.width, canvas.height)

const background = new Sprite({
    position:{
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png',
    scale: 1.41
})

// DEFINE PLAYER
const player = new Player({
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

const customers = []
const enemies = []
const coins = []
const thornBushes = []
const platforms = []
let coinCointer = 0


// declaring keys state 
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
}

// DECLARE STARTING GAMESTATE & LEVEL
// GAMESTATES DETERMINE WHAT GAME FUNCTIONALITY IS ACTIVE
// LEVEL DETERMINES WHAT MESSAGES ARE SHOWN ON THE SCREEN, CORRESPONDING TO EACH "STAGE" OF THE GAME
let GAMESTATE = "TUTORIAL"
let LEVEL = "TUTORIAL_M1"

genThornBush(700, 630)
genPlatform(220,380)
genPlatform(100,380)
genPlatform(600,520)
genPlatform(1100,200)
genPlatform(1400,550)
genPlatform(1400,380)


// function addResidents(list, residents){
//     for(const i in list){
//         residents.push(list[i])
//     }
// }

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

    mapleResidents = []
    // addResidents(customers, mapleResidents)
    // addResidents(enemies, mapleResidents)
    // addResidents(coins, mapleResidents)
    // mapleResidents.push(player)
    // console.log(mapleResidents)

    // Handle platform logic
    player.bottomYCords = 682
    for(const i in platforms){
        // if player x within platform && y above platform, player y does not go below platform y
        thisPlatform = platforms[i]
        if(
            checkPlatforms(thisPlatform)
        ){
            //  player y+height does not go below platform y
            console.log("player on platform!!!")
            player.bottomYCords = thisPlatform.position.y -1
        } 
    }


    // HANDLING "TUTORIAL" GAMESTATE
    if(GAMESTATE === "TUTORIAL"){
        for(const i in messages){
            messages[i].update()
        }
        iterateTutorial()
        player.draw()
    }
    
    // HANDLING "ACTIVE" GAMESTATE
    if(GAMESTATE === "ACTIVE"){

        // UPDATE ALL OBJECTS
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
        if(customers.length<1){
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
            }    
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
    }
})