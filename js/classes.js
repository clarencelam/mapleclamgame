class Sprite {
    constructor({position, imageSrc, scale=1}){
        this.position = position
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
    }

    draw(){
        c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.image.width * this.scale,
            this.image.height * this.scale   
        )
    }

    update(){
        this.draw()
    }
}

// FOOD CLASS
class Food {
    constructor ({position, velocity, imageSrc, direction, scale=1, framesMax=1}){
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
    }

    draw(){
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

    animateFrames(){
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold ===0){
            if(this.framesElapsed % this.framesHold === 0){
                if (this.framesCurrent < this.framesMax -1){
                    this.framesCurrent ++
                } else {
                    this.framesCurrent = 0
                }
            }
        }
    }

    update(){
        this.draw()
        this.animateFrames()

        if(this.velocity.x>0){
            this.velocity.x = (this.velocity.x * 10 - this.deceleration * 10) / 10 // bypass floating point arithmetic js issue
        }
        this.position.x += this.velocity.x

        this.position.y += this.velocity.y

        // Handling platform gravity
        
        if (this.position.y + this.image.height + this.velocity.y >= (canvas.height-148)){
            this.velocity.y = 0
        } else {
            this.velocity.y += this.gravity
        }
        
    }
}

// PLAYER CLASS
class Player {
    constructor({position, velocity, imageSrc, scale =1, framesMax = 1, sprites}){
        this.position = position
        this.velocity = velocity
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.facing = -1 // 1 = right, -1 = left

        // stats
        this.speed = 5
        this.jumpHeight = 10
        this.gravity = 0.3

        this.lastkey

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
        this.cookSpeed = 1
        this.cookedFood = []
        this.cookedFoodLimit = 5
        this.foods = []
    }

    cookFood(){
        // if not cooking and cooked limit is not reached, then add a food to cookedFood
        if(this.cooking === false && this.cookedFood.length<this.cookedFoodLimit){
            this.cooking = true
            var progress = 0

            // every x milliseconds, 
            var id = setInterval(cook, 100)
            console.log("cookingstart")
            var self = this

            function cook(){
                if(progress >= 100){
                    // Create food in cookedFood
                    const food = new Food({
                        position:{
                        x: 10,
                        y: canvas.height - (50 * (self.cookedFood.length+1)) 
                    },
                    velocity:{
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
                progress = 0

                self.cookedFood.push(food)
                console.log("order up!: " + self.cookedFood)

                } else{
                    progress = progress + 10
                    console.log("progress: " + progress)
                }
            }
        }
    }

    throw(){
        // create new food object

        // if cookedFood > 0, then throw
        const food = new Food({
                position:{
                x: this.position.x,
                y: this.position.y
            },
            velocity:{
                x: 10,
                y: 0
            },
            imageSrc: './img/food/apple.png', 
            direction: this.facing,
            scale: 1,
            framesMax: 8,
        })
        this.foods.push(food)
        console.log(food)
        console.log(this.foods)
    }

    draw(){
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

    animateFrames(){
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold ===0){
            if(this.framesElapsed % this.framesHold === 0){
                if (this.framesCurrent < this.framesMax -1){
                    this.framesCurrent ++
                } else {
                    this.framesCurrent = 0
                }
            }
        }
    }

    switchSprite(sprite) {
        switch (sprite) {
            case 'idle':
                if(this.facing === -1){
                    if(this.image != this.sprites.idle.image){
                        this.framesHold = 30
                        this.image = this.sprites.idle.image
                        this.framesMax = this.sprites.idle.framesMax
                        this.framesCurrent = 0    
                    }    
                } else if(this.facing === 1){
                    if(this.image != this.sprites.idleRight.image){
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
                    if(this.image != this.sprites.jump.image){
                    this.image = this.sprites.jump.image
                    this.framesMax = this.sprites.jump.framesMax
                    this.framesCurrent = 0
                    }
                    break
                case 'jumpRight':
                    if(this.image != this.sprites.jumpRight.image){
                    this.image = this.sprites.jumpRight.image
                    this.framesMax = this.sprites.jumpRight.framesMax
                    this.framesCurrent = 0
                    }
                    break    
        }
    }

    update(){
        this.draw()
        this.animateFrames()
        this.cookFood()

        // Draw thrown food
        if(this.foods.length > 0){
            for (const food in this.foods) {
                this.foods[food].update()
            }
        }
        // Draw cooked foods (not thrown)
        if(this.cookedFood.length > 0){
            for (const food in this.cookedFood) {
                this.cookedFood[food].draw()
            }
        }

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        // Handling platform gravity
        if (this.position.y + this.image.height + this.velocity.y >= (canvas.height-148)){
            this.velocity.y = 0
        } else {
            this.velocity.y += this.gravity
        }
    }
}

class Customer{
    constructor({position, velocity, imageSrc, scale =1, framesMax = 1, sprites}){
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
    }

    draw(){
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

    animateFrames(){
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold ===0){
            if(this.framesElapsed % this.framesHold === 0){
                if (this.framesCurrent < this.framesMax -1){
                    this.framesCurrent ++
                } else {
                    this.framesCurrent = 0
                }
            }
        }
    }

    movementDecision(num){
        if(num===0){
            if(this.velocity>1){
                this.switchSprite('idleRight')
            } else{
                this.switchSprite('idle')
            }
            this.velocity.x = 0
        } else if(num===1){
            this.velocity.x = -1
            this.switchSprite('walk')
        } else if(num===2){
            this.velocity.x = 1
            this.switchSprite('walkRight')
        }
    }

    switchSprite(sprite) {
        switch (sprite) {
            case 'idle':
                this.image = this.sprites.idle.image
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

    update(){
        this.draw()
        this.animateFrames()

        // Prevent walking off map
        if(this.position.x <=0){
            this.velocity.x = 1
            this.switchSprite('walkRight')
        } else if (this.position.x + this.image.width >= canvas.width){
            this.velocity.x = -1
            this.switchSprite('walk')
        }
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        // Handling platform gravity
        if (this.position.y + this.image.height + this.velocity.y >= (canvas.height-140)){
            this.velocity.y = 0
        } else {
            this.velocity.y += this.gravity
        }
    }

}

class Enemy{
    constructor({position, velocity, imageSrc, scale =1, framesMax = 1, sprites}){
        this.position = position
        this.velocity = velocity
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.facing = -1 // 1 = right, -1 = left

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
    }

    draw(){
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

    animateFrames(){
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold ===0){
            if(this.framesElapsed % this.framesHold === 0){
                if (this.framesCurrent < this.framesMax -1){
                    this.framesCurrent ++
                } else {
                    this.framesCurrent = 0
                }
            }
        }
    }

    movementDecision(num){
        if(num===0){
            this.switchSprite('idle')
            this.velocity.x = 0
        } else if(num===1){
            this.velocity.x = -1
            this.facing = -1
            this.switchSprite('walk')
        } else if(num===2){
            this.velocity.x = 1
            this.facing = 1
            this.switchSprite('walk')
        } else if(num===3){
            this.velocity.y = -10
            this.switchSprite('jump')
        } else if(num===4){
            this.velocity.y = -10
            this.switchSprite('jump')
        }
    }

    switchSprite(sprite) {
        let idleFramesHold = 40
        let walkFramesHold = 18
        let jumpFramesHold = 30
        switch (sprite) {
            case 'idle':
                if(this.facing === -1){
                    if(this.image != this.sprites.idle.image){
                        this.framesHold = idleFramesHold
                        this.image = this.sprites.idle.image
                        this.framesMax = this.sprites.idle.framesMax
                        this.framesCurrent = 0    
                    }    
                } else if(this.facing === 1){
                    if(this.image != this.sprites.idleRight.image){
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
        }
    }


    update(){
        this.draw()
        this.animateFrames()

        // Prevent walking off map
        if(this.position.x <=0){
            this.velocity.x = 1
            this.facing = 1
            this.switchSprite('walk')
        } else if (this.position.x + this.image.width >= canvas.width){
            this.velocity.x = -1
            this.facing = -1
            this.switchSprite('walk')
        }
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        // Reset sprites after Jump
        if((this.image === this.sprites.jump.image || this.image === this.sprites.jumpRight.image)
        && this.velocity.y === 0){
            if(this.velocity.x === 0){
                this.switchSprite('idle')
            } else if(
                this.velocity.x !=0){
                    this.switchSprite('walk')
                }
        }
        // Handling platform gravity 
        if (this.position.y + this.image.height + this.velocity.y >= (canvas.height-148)){
            this.velocity.y = 0
        } else {
            this.velocity.y += this.gravity
        }
    }

}