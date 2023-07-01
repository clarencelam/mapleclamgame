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
        this.gravity = 0.5

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
        console.log(this.facing)
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