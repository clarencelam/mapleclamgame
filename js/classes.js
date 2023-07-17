let drawBox = false
class Sprite {
    constructor({ position, imageSrc, scale = 1, framesMax = 1, offset = { x: 0, y: 0 } }) {
        this.position = position
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale

        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 10
        this.offset = offset
    }

    draw() {
        c.drawImage(
            this.image,
            // crop
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            // position
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            this.image.width / this.framesMax * this.scale,
            this.image.height * this.scale)
    }

    update() {
        this.draw()
    }
}

class Message extends Sprite {
    constructor({ position, imageSrc, scale }) {
        super({
            position, imageSrc, scale
        })

    }
}

class Platform extends Sprite {
    constructor({ position, imageSrc, scale }) {
        super({
            position, imageSrc, scale
        })
        // Collision detection
        this.height = 50 * scale
        this.width = 215 * scale
        this.offset_x = 0
        this.offset_y = 0
        this.offset.y = 10

    }
    draw() {
        // Draw collision box
        if (drawBox === true) {
            c.fillStyle = "black"
            c.fillRect(
                this.position.x + this.offset_x,
                this.position.y + this.offset_y,
                this.width,
                this.height
            )
        }
        c.drawImage(
            this.image,
            // crop
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            // position
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            this.image.width / this.framesMax * this.scale,
            this.image.height * this.scale)
    }
}


class Thornbush extends Sprite {
    constructor({ position, imageSrc, scale }) {
        super({
            position, imageSrc, scale
        })
        // Collision detection
        this.height = 40
        this.width = 40
        this.offset_x = 5
        this.offset_y = 10

    }
    draw() {
        // Draw collision box
        if (drawBox === true) {
            c.fillStyle = "black"
            c.fillRect(
                this.position.x + this.offset_x,
                this.position.y + this.offset_y,
                this.width,
                this.height
            )
        }
        c.drawImage(
            this.image,
            // crop
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            // position
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            this.image.width / this.framesMax * this.scale,
            this.image.height * this.scale)
    }
}

// COIN CLASS

class Coin {
    constructor({ position, velocity, imageSrc, scale = 1, framesMax = 1 }) {
        this.position = position
        this.velocity = velocity

        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale

        // Sprite Crop
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 12

        this.gravity = 0.2

        // Collision detection
        this.height = 20
        this.width = 20
        this.offset_x = 5
        this.offset_y = 5

        this.COINSTATE = "idle"
    }

    draw() {
        // Draw collision box
        if (drawBox === true) {
            c.fillStyle = "black"
            c.fillRect(
                this.position.x + this.offset_x,
                this.position.y + this.offset_y,
                this.width,
                this.height
            )
        }

        c.drawImage(
            this.image,
            // Sprite Crop
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            // Position
            this.position.x,
            this.position.y,
            this.image.width / this.framesMax * this.scale,
            this.image.height * this.scale
        )
    }

    animateFrames() {
        this.framesElapsed++
        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesElapsed % this.framesHold === 0) {
                if (this.framesCurrent < this.framesMax - 1) {
                    this.framesCurrent++
                } else {
                    this.framesCurrent = 0
                }
            }
        }
    }

    getPickedUp() {
        this.markForDeathTimeout = 70
        this.velocity.y = -5
        this.COINSTATE = 'pickedUp'
    }

    update() {
        this.draw()
        this.animateFrames()

        // TODO: upon setting COINSTATE to pickup, start a timeout to mark the coin for deletion
        switch (this.COINSTATE) {
            case 'idle':
                break
            case 'pickedUp':
                if (this.markForDeathTimeout <= 0) {
                    this.COINSTATE = "markedForDeath"
                } else {
                    this.markForDeathTimeout -= 1
                }
                break
            case 'markedForDeath':
                break
        }

        // Handling platform gravity
        if (this.position.y + this.image.height + this.velocity.y >= (canvas.height - 150)) {
            this.velocity.y = 0
        } else {
            this.velocity.y += this.gravity
        }

        // Move coin
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

    }
}

// FOOD CLASS
class Food {
    constructor({ position, velocity, imageSrc, direction, scale = 1, framesMax = 1 }) {
        this.position = position
        this.velocity = velocity
        this.direction = direction

        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale

        // Sprite Crop
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 10

        this.deceleration = .2
        this.gravity = 0.5

        // Dissapear functionality
        this.disappearTime = 500 // leave 100 for markedForDeath foods to "drop" off-screen

        // Collision detection
        this.height = 20
        this.width = 20
        this.offset_x = 0
        this.offset_y = 10

        // setting states for food 
        this.FOODSTATE = "active"
    }

    getEaten(cust) {
        this.FOODSTATE = "eaten"
    }

    draw() {
        // Draw collision box
        if (drawBox === true) {
            c.fillStyle = "black"
            c.fillRect(
                this.position.x + this.offset_x,
                this.position.y + this.offset_y,
                this.width,
                this.height
            )
        }

        c.drawImage(
            this.image,
            // Sprite Crop
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            // Position
            this.position.x,
            this.position.y,
            this.image.width / this.framesMax * this.scale,
            this.image.height * this.scale
        )
    }

    animateFrames() {
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesElapsed % this.framesHold === 0) {
                if (this.framesCurrent < this.framesMax - 1) {
                    this.framesCurrent++
                } else {
                    this.framesCurrent = 0
                }
            }
        }
    }

    update() {
        this.draw()
        this.animateFrames()


        switch (this.FOODSTATE) {
            case "active":
                // Iterate dissappear time
                if (this.disappearTime > 0) {
                    this.disappearTime -= 1
                }
                // Trigger markedForDeath
                if (this.disappearTime === 200) {
                    this.markedForDeath = true
                    this.FOODSTATE = "markedForDeath"
                }

                // Apply gravity except when on bottom platform
                this.position.y += this.velocity.y
                if (this.position.y + this.image.height + this.velocity.y >= (canvas.height - 148)) {
                    this.velocity.y = 0
                } else {
                    this.velocity.y += this.gravity
                }
                break

            case 'markedForDeath':
                // IF marked for death, apply food-expiring y-axis phsyics (drop the food off screen)
                this.position.y += this.velocity.y
                this.velocity.y += this.gravity
                break

            case 'eaten':
                // IF eaten, allow food to drop food off screen
                // have food follow customer
                this.position.y += this.velocity.y
                break
        }

        // Handle x-position logic
        switch (this.FOODSTATE) {
            case "active":
            case 'markedForDeath':
                if (this.velocity.x > 0) {
                    this.velocity.x = (this.velocity.x * 10 - this.deceleration * 10) / 10 // bypass floating point arithmetic js issue
                }
                else if (this.velocity.x < 0) {     // food was thrown left
                    this.velocity.x = (this.velocity.x * 10 + this.deceleration * 10) / 10
                }
                this.position.x += this.velocity.x
                break

            case 'eaten':
                this.position.x += this.velocity.x
                break
        }


        // Handle x-position logic
    }
}


// PLAYER CLASS
class Player {
    constructor({ position, velocity, imageSrc, scale = 1, framesMax = 1, sprites }) {
        this.position = position
        this.velocity = velocity
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.facing = -1 // 1 = right, -1 = left
        this.jumping = false // calculated in update() function

        // handle gettingHit
        this.gettingHit = false
        this.hitCooldown = 0

        // stats
        this.speed = 3
        this.jumpHeight = 11 //default 10
        this.gravity = 0.3

        // movement mechanics
        this.lastkey
        this.bottomYCordsActive = 682 // base of level (where gravity should stop), set in index.js
        this.bottomYCordsBetweeenLevels
        this.lastVelocity

        // Srite Crop
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 30
        this.sprites = sprites

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }

        // Food Tracking
        this.cooking = false
        this.cookSpeed = 15 // lower = faster (value = milliseconds between cook progress increments in setInterval)
        this.cookedFood = []
        this.cookedFoodLimit = 3
        this.foods = []

        // For collision detection
        this.height = 50 //this.image.height * this.scale
        this.width = 40 //this.image.width / this.framesMax * this.scale
        this.offset_x = 10
        this.offset_y = 10
    }

    jump() {
        // set Jumping = true, apply jump velocity
        if (this.jumping === false) {
            this.velocity.y -= this.jumpHeight
            this.jumping = true
        }
    }

    cookFood() {
        // If not cooking and cooked limit is not reached, then add a food to cookedFood
        if (this.cooking === false && this.cookedFood.length < this.cookedFoodLimit) {
            this.cooking = true
            var progress = 0

            var id = setInterval(cook, this.cookSpeed)
            console.log("cookingstart")
            var self = this

            function cook() {
                // If the cooking progress bar is full, add a new Food to cookedFood, set cooking to false, and restart cooking progress
                if (progress >= 100) {
                    // Create food to add to cookedFood
                    const food = new Food({
                        position: {
                            x: 0,
                            y: 0
                        },
                        velocity: {
                            x: 0,
                            y: 0
                        },
                        imageSrc: './img/food/apple.png',
                        direction: 1,
                        scale: 1,
                        framesMax: 8,
                    })
                    clearInterval(id)
                    self.cooking = false

                    // Reset cooking progress bar
                    var progressBar = document.getElementById("cookingProgress")
                    progress = 0
                    progressBar.style.width = progress + "%"

                    self.cookedFood.push(food)

                } else {
                    // Still cooking-- increment cooking progress bar (id=cookingProgress)
                    var progressBar = document.getElementById("cookingProgress")
                    progressBar.style.width = progress + "%"
                    progress = progress + 1
                }
            }
        }
    }

    throw() {
        // get food from cookedFood
        if (this.cookedFood.length > 0) {
            this.cookedFood.shift()
            const food = new Food({
                position: {
                    // x: this.position.x,
                    // y: this.position.y + (this.image.height/2)
                    x: this.position.x + 20,
                    y: this.position.y - 20
                },
                velocity: {
                    x: this.facing * 10,
                    y: 0
                },
                imageSrc: './img/food/apple.png',
                direction: this.facing,
                scale: 1,
                framesMax: 8,
            })
            this.foods.push(food)
        } else {
            var progressBar = document.getElementById("cookingProgress")
            // Warn user of no cookedFood by flashing progressBar red
            progressBar.style.background = "red"
            var resetBar = setTimeout(resetBarColor, 250)
            function resetBarColor() {
                var progressBar = document.getElementById("cookingProgress")
                progressBar.style.background = "#9c84b5"
                clearTimeout(resetBar)
            }
        }
    }

    getHit(enemyFacing, damage) {
        this.gettingHit = true
        if (enemyFacing === 1) { // hit from right, move left
            this.velocity.x = damage
        } else if (enemyFacing === -1) {
            this.velocity.x = -damage
        }
        this.velocity.y -= 4
    }

    draw() {
        // Draw collision box
        if (drawBox === true) {
            c.fillStyle = "black"
            c.fillRect(
                this.position.x + this.offset_x,
                this.position.y + this.offset_y,
                this.width,
                this.height
            )
        }

        c.drawImage(
            this.image,
            // Sprite Crop
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            // Position
            this.position.x,
            this.position.y,
            this.image.width / this.framesMax * this.scale,
            this.image.height * this.scale
        )
    }

    animateFrames() {
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesElapsed % this.framesHold === 0) {
                if (this.framesCurrent < this.framesMax - 1) {
                    this.framesCurrent++
                } else {
                    this.framesCurrent = 0
                }
            }
        }
    }

    switchSprite(sprite) {
        switch (sprite) {
            case 'idle':
                if (this.facing === -1) {
                    if (this.image != this.sprites.idle.image) {
                        this.framesHold = 30
                        this.image = this.sprites.idle.image
                        this.framesMax = this.sprites.idle.framesMax
                        this.framesCurrent = 0
                    }
                } else if (this.facing === 1) {
                    if (this.image != this.sprites.idleRight.image) {
                        this.framesHold = 30
                        this.image = this.sprites.idleRight.image
                        this.framesMax = this.sprites.idleRight.framesMax
                        this.framesCurrent = 0
                    }
                }
                break
            case 'move':
                if (this.facing === -1) {
                    if (this.image != this.sprites.move.image) {
                        this.framesHold = 8
                        this.image = this.sprites.move.image
                        this.framesMax = this.sprites.move.framesMax
                        this.framesCurrent = 0
                        this.facing = -1
                    }
                } else if (this.facing === 1) {
                    if (this.image != this.sprites.moveRight.image) {
                        this.framesHold = 8
                        this.image = this.sprites.moveRight.image
                        this.framesMax = this.sprites.moveRight.framesMax
                        this.framesCurrent = 0
                        this.facing = 1
                    }
                }
                break
            case 'jump':
                if (this.image != this.sprites.jump.image) {
                    this.image = this.sprites.jump.image
                    this.framesMax = this.sprites.jump.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'jumpRight':
                if (this.image != this.sprites.jumpRight.image) {
                    this.image = this.sprites.jumpRight.image
                    this.framesMax = this.sprites.jumpRight.framesMax
                    this.framesCurrent = 0
                }
                break
        }
    }

    update() {
        this.draw()
        this.animateFrames()

        switch (GAMESTATE) {
            case 'BETWEENLEVELS':
                // Handle Gravity
                // If player is at bottom of map, stop gravity
                if (this.position.y + this.offset_y + this.height + this.velocity.y >= this.bottomYCordsBetweeenLevels) {
                    this.velocity.y = 0
                    // Player on bottom -- set jumping to false
                    this.jumping = false
                } else {
                    // If player is above bottom of map, apply gravity
                    this.velocity.y += this.gravity
                }
                break

            case 'INACTIVE':
            case 'ACTIVE':
                // Draw thrown food
                this.cookFood()

                if (this.foods.length > 0) {
                    for (const food in this.foods) {
                        this.foods[food].update()
                        // Remove expired Thrown Food
                        if (this.foods[food].position.y >= canvas.height) {
                            this.foods.splice(food, 1)
                            console.log("food drop off map! Index: " + food)
                        }
                        else if (this.foods[food].disappearTime === 0) {
                            this.foods.splice(food, 1)
                            console.log("food expiry! Index: " + food)
                        }
                    }
                }
                // Draw cooked unthrown food (ammo, essentially), setting its x & y position
                if (this.cookedFood.length > 0) {
                    for (let i in this.cookedFood) {
                        this.cookedFood[i].scale = 1.2
                        this.cookedFood[i].position.x = 20 + (30 * i)
                        this.cookedFood[i].position.y = 15
                        this.cookedFood[i].draw()
                    }
                    this.cookedFood[0].position.x = this.position.x + 20
                    this.cookedFood[0].position.y = this.position.y - 20
                    this.cookedFood[0].scale = 1
                    this.cookedFood[0].draw()
                }

                // Handle Gravity
                // If player is at bottom of map, stop gravity
                if (this.position.y + this.offset_y + this.height + this.velocity.y >= this.bottomYCordsActive) {
                    this.velocity.y = 0
                    // Player on bottom -- set jumping to false
                    this.jumping = false
                } else {
                    // If player is above bottom of map, apply gravity
                    this.velocity.y += this.gravity
                }
                break
        }

        // Move PLayer
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        // Apply hit cooldown of 20
        if (this.gettingHit === true && this.hitCooldown < 20) {
            this.hitCooldown += 1
            console.log(this.hitCooldown)
        } else if (this.gettingHit === true && this.hitCooldown >= 20) {
            this.gettingHit = false
            this.hitCooldown = 0
        }


        // Handle Player Left/Right Movement
        if (this.gettingHit === false) {
            if (keys.a.pressed && this.lastKey === 'a') {
                if (this.position.x <= 0) {
                    this.velocity.x = 0
                } else {
                    this.velocity.x = -this.speed
                }
                this.switchSprite('move')
                this.facing = -1
            }
            else if (keys.d.pressed && this.lastKey === 'd') {
                if ((this.position.x + this.width) >= canvas.width) {
                    this.velocity.x = 0
                }
                else {
                    this.velocity.x = this.speed
                }
                this.switchSprite('move')
                this.facing = 1
            } else {
                this.switchSprite('idle')
                this.velocity.x = 0
            }
        } else {
            if (this.position.x <= 0 || (this.position.x + this.width) >= canvas.width) {
                this.velocity.x = 0
            }
        }

        // Handle Player Jump Sprite Updating
        if (this.jumping === true) {
            if (this.facing === 1) {
                this.switchSprite('jumpRight')
                return
            }
            else if (this.facing === -1) {
                this.switchSprite('jump')
            }
        } else if (this.velocity.y > 0) {
            this.switchSprite('idle')
        }

    }
}

class Customer {
    constructor({ position, velocity, imageSrc, scale = 1, framesMax = 1, sprites }) {
        this.position = position
        this.velocity = velocity
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale

        // stats
        this.speed = 5
        this.jumpHeight = 10
        this.gravity = 0.5

        // Srite Crop
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 30
        this.sprites = sprites
        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }

        // Movement
        this.roll = 0

        // Collision detection
        this.height = 40
        this.width = 50
        this.offset_x = 5
        this.offset_y = 5

        this.eating = false
        this.facing = -1 // 1 = right, -1 = left
    }

    eat() {
        this.eating = true
        this.velocity.y -= 5
    }

    draw() {
        // Draw collision box
        if (drawBox === true) {
            c.fillStyle = "black"
            c.fillRect(
                this.position.x + this.offset_x,
                this.position.y + this.offset_y,
                this.width,
                this.height
            )
        }

        c.drawImage(
            this.image,
            // Sprite Crop
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            // Position
            this.position.x,
            this.position.y,
            this.image.width / this.framesMax * this.scale,
            this.image.height * this.scale
        )
    }

    animateFrames() {
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesElapsed % this.framesHold === 0) {
                if (this.framesCurrent < this.framesMax - 1) {
                    this.framesCurrent++
                } else {
                    this.framesCurrent = 0
                }
            }
        }
    }

    movementDecision(num) {
        if (num === 0) {
            if (this.velocity > 1) {
                this.switchSprite('idleRight')
            } else {
                this.switchSprite('idle')
            }
            this.velocity.x = 0
        } else if (num === 1) {
            this.velocity.x = -1
            this.facing = -1
            this.switchSprite('walk')
        } else if (num === 2) {
            this.velocity.x = 1
            this.facing = 1
            this.switchSprite('walkRight')
        }
    }

    switchSprite(sprite) {
        switch (sprite) {
            case 'idle':
                if (this.facing === 1) {
                    this.image = this.sprites.idleRight.image
                } else {
                    this.image = this.sprites.idle.image
                }
                this.framesMax = this.sprites.idle.framesMax
                this.framesCurrent = 0
                break
            case 'walk':
                this.image = this.sprites.walk.image
                this.framesMax = this.sprites.walk.framesMax
                this.framesCurrent = 0
                break
            case 'walkRight':
                this.image = this.sprites.walkRight.image
                this.framesMax = this.sprites.walkRight.framesMax
                this.framesCurrent = 0
                break

        }
    }

    update() {
        this.draw()
        this.animateFrames()

        // Prevent walking off map
        if (this.position.x <= 0) {
            this.velocity.x = 1
            this.switchSprite('walkRight')
        } else if (this.position.x + this.image.width >= canvas.width) {
            this.velocity.x = -1
            this.switchSprite('walk')
        }
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        // Handling platform gravity
        // If eating, apply gravity at all times
        if (this.eating === true) {
            this.velocity.y += this.gravity / 2
        } else {
            // If not eating, stop gravity when at floor of map
            if (this.position.y + this.image.height + this.velocity.y >= (canvas.height - 140)) {
                this.velocity.y = 0
            } else {
                this.velocity.y += this.gravity
            }
        }
    }

}

class Enemy {
    constructor({ position, velocity, imageSrc, scale = 1, framesMax = 1, sprites }) {
        this.position = position
        this.velocity = velocity
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.facing = -1 // 1 = right, -1 = left

        this.isAttacking = false

        // stats
        this.speed = 5
        this.jumpHeight = 10
        this.gravity = 0.5

        // Srite Crop
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 20

        this.sprites = sprites
        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }

        // Movement
        this.roll = 0

        // Collision detection
        this.height = 100
        this.width = 50
        this.offset_x = 5
        this.offset_y = 5
    }

    draw() {
        // Draw collision box
        if (drawBox === true) {
            c.fillStyle = "black"
            c.fillRect(
                this.position.x + this.offset_x,
                this.position.y + this.offset_y,
                this.width,
                this.height
            )
        }

        c.drawImage(
            this.image,
            // Sprite Crop
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            // Position
            this.position.x,
            this.position.y,
            this.image.width / this.framesMax * this.scale,
            this.image.height * this.scale
        )
    }

    animateFrames() {
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesElapsed % this.framesHold === 0) {
                if (this.framesCurrent < this.framesMax - 1) {
                    this.framesCurrent++
                } else {
                    this.framesCurrent = 0
                }
            }
        }
    }

    movementDecision(num) {
        if (this.isAttacking === true) { // do not make new movements if enemy is currently attacking
            return
        } else if (num === 0) {
            this.switchSprite('idle')
            this.velocity.x = 0
        } else if (num === 1) {
            this.velocity.x = -1
            this.facing = -1
            this.switchSprite('walk')
        } else if (num === 2) {
            this.velocity.x = 1
            this.facing = 1
            this.switchSprite('walk')
        } else if (num === 3) {
            this.velocity.y = -10
            this.switchSprite('jump')
        } else if (num === 4) {
            this.velocity.y = -10
            this.switchSprite('jump')
        }
    }

    attack() {
        this.switchSprite('attack')
        this.isAttacking = true
    }

    switchSprite(sprite) {
        let idleFramesHold = 40
        let walkFramesHold = 18
        let jumpFramesHold = 30
        let attackFramesHold = 12

        if (this.isAttacking === true) return // if isAttacking = true, do not switch sprites

        switch (sprite) {
            case 'idle':
                if (this.facing === -1) {
                    if (this.image != this.sprites.idle.image) {
                        this.framesHold = idleFramesHold
                        this.image = this.sprites.idle.image
                        this.framesMax = this.sprites.idle.framesMax
                        this.framesCurrent = 0
                    }
                } else if (this.facing === 1) {
                    if (this.image != this.sprites.idleRight.image) {
                        this.framesHold = idleFramesHold
                        this.image = this.sprites.idleRight.image
                        this.framesMax = this.sprites.idleRight.framesMax
                        this.framesCurrent = 0
                    }
                }
                break
            case 'walk':
                if (this.facing === -1) {
                    if (this.image != this.sprites.walk.image) {
                        this.framesHold = walkFramesHold
                        this.image = this.sprites.walk.image
                        this.framesMax = this.sprites.walk.framesMax
                        this.framesCurrent = 0
                        this.facing = -1
                    }
                } else if (this.facing === 1) {
                    if (this.image != this.sprites.walkRight.image) {
                        this.framesHold = walkFramesHold
                        this.image = this.sprites.walkRight.image
                        this.framesMax = this.sprites.walkRight.framesMax
                        this.framesCurrent = 0
                        this.facing = 1
                    }
                }
                break
            case 'jump':
                if (this.facing === -1) {
                    if (this.image != this.sprites.jump.image) {
                        this.framesHold = jumpFramesHold
                        this.image = this.sprites.jump.image
                        this.framesMax = this.sprites.jump.framesMax
                        this.framesCurrent = 0
                    }
                } else if (this.facing === 1) {
                    if (this.image != this.sprites.jumpRight.image) {
                        this.framesHold = jumpFramesHold
                        this.image = this.sprites.jumpRight.image
                        this.framesMax = this.sprites.jumpRight.framesMax
                        this.framesCurrent = 0
                    }
                }
                break
            case 'attack':
                if (this.facing === -1) {
                    if (this.image != this.sprites.attack.image) {
                        this.framesHold = attackFramesHold
                        this.image = this.sprites.attack.image
                        this.framesMax = this.sprites.attack.framesMax
                        this.framesCurrent = 0
                    }
                } else if (this.facing === 1) {
                    if (this.image != this.sprites.attackRight.image) {
                        this.framesHold = attackFramesHold
                        this.image = this.sprites.attackRight.image
                        this.framesMax = this.sprites.attackRight.framesMax
                        this.framesCurrent = 0
                    }
                }
        }
    }


    update() {
        this.draw()
        this.animateFrames()

        // Prevent walking off map
        if (this.position.x <= 0) {
            this.velocity.x = 1
            this.facing = 1
            this.switchSprite('walk')
        } else if (this.position.x + this.image.width >= canvas.width) {
            this.velocity.x = -1
            this.facing = -1
            this.switchSprite('walk')
        }

        // if this is attacking and in the attack sprite, finish attack sprite and set isAttacking to false
        if (this.isAttacking === true) {
            this.velocity.x = 0
            if (this.image !== this.sprites.attack.image && this.image !== this.sprites.attackRight.image) {
                this.switchSprite('attack')
            }
            if (this.framesCurrent === 5) {
                this.isAttacking = false
                this.movementDecision(0)
            }
        }

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        // Reset sprites after Jump
        if ((this.image === this.sprites.jump.image || this.image === this.sprites.jumpRight.image)
            && this.velocity.y === 0) {
            if (this.velocity.x === 0) {
                this.switchSprite('idle')
            } else if (
                this.velocity.x != 0) {
                this.switchSprite('walk')
            }
        }
        // Handling platform gravity 
        if (this.position.y + this.image.height + this.velocity.y >= (canvas.height - 148)) {
            this.velocity.y = 0
        } else {
            this.velocity.y += this.gravity
        }
    }

}