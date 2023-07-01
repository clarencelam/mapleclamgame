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

const player = new Player({
    position:{
        x: 0,
        y: 0
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

const snail = new Customer({
    position:{
        x: 200,
        y: 200
    },
    velocity: {
        x: 0,
        y: 10
    },
    imageSrc: './img/greenSnail/idle.png',
    scale: 1.4,
    framesMax: 1,
    sprites: {
        idle: {
            imageSrc: './img/greenSnail/idle.png',
            framesMax: 1
        },
        walk: {
            imageSrc: './img/greenSnail/walk.png',
            framesMax: 5
        },
        idleRight: {
            imageSrc: './img/greenSnail/idleRight.png',
            framesMax: 1
        },
        walkRight: {
            imageSrc: './img/greenSnail/walkRight.png',
            framesMax: 5
        },

    }
})

startRolls(snail, 3500, 3)

const grunt = new Enemy({
    position:{
        x: 400,
        y: 200
    },
    velocity: {
        x: 0,
        y: 10
    },
    imageSrc: './img/badGuy1/idle.png',
    scale: 1.4,
    framesMax: 6,
    sprites: {
        idle: {
            imageSrc: './img/badGuy1/idle.png',
            framesMax: 6
        },
        idleRight: {
            imageSrc: './img/badGuy1/idleRight.png',
            framesMax: 6
        },
        walk: {
            imageSrc: './img/badGuy1/walk.png',
            framesMax: 4
        },
        walkRight: {
            imageSrc: './img/badGuy1/walkRight.png',
            framesMax: 4
        },
        jump:{
            imageSrc: './img/badGuy1/jump.png',
            framesMax: 1
        },
        jumpRight:{
            imageSrc: './img/badGuy1/jumpRight.png',
            framesMax: 1
        }
    }
})

startRolls(grunt, 1000, 5)

// declaring keys state 
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
}

function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle= 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    player.update()
    snail.update()
    grunt.update()


    // Player movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -player.speed
        player.switchSprite('move')
        player.facing = -1
    }
    else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = player.speed
        player.switchSprite('move')
        player.facing = 1
    } else {
        player.switchSprite('idle')
        player.velocity.x = 0
    }

    // Jump logic
    if (player.velocity.y<0){
        console.log("jump")
        if(player.facing === 1){
            player.switchSprite('jumpRight')
            console.log(player.facing)
            return
        }
        else if(player.facing === -1){
            player.switchSprite('jump')
            console.log(player.facing)
        }
    } else if(player.velocity.y>0){
            player.switchSprite('idle')
        }

}
animate()

// Key listeners
window.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
                break
            case 'a':
                keys.a.pressed = true
                player.lastKey = 'a'
                break
            case 'w':
                player.velocity.y -= player.jumpHeight
                break
            case ' ':
                player.throw()
            }    
    }
)

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break    
    }
})