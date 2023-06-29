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
    constructor({position, velocity, imageSrc, scale =1, framesMax = 1}){
        this.position = position
        this.velocity = velocity
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale

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
    constructor({position, velocity, imageSrc, scale =1, framesMax = 1}){
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

class Enemy{
    constructor({position, velocity, imageSrc, scale =1, framesMax = 1}){
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
        this.framesHold = 20
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