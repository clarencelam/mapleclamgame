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
    imageSrc: './img/player/stand.png',
    scale: 1.4,
    framesMax: 4,
})

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


    // Player movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -player.speed
    }
    else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = player.speed
    } else {
        player.velocity.x = 0
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