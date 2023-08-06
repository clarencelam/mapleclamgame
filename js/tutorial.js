messages = []

function genTutorial(num) {
    messages = []
    if (num === 1) {
        let msg1 = new Message({
            position: {
                x: 600,
                y: 130
            },
            imageSrc: `./img/messages1/textBox.png`,
            scale: 2
        })
        messages.push(msg1)
        document.querySelector("#tutorialTextbox").innerHTML = "Hey... Hey new guy! <br><br>Get over here!<br><br>Use the arrow keys to <br>move!"
        document.querySelector("#tutorialTextbox").style.display = 'flex'
    } 
    else if (num === 1.1) {
        let msg1 = new Message({
            position: {
                x: 600,
                y: 130
            },
            imageSrc: `./img/messages1/textBox.png`,
            scale: 2
        })
        messages.push(msg1)
        document.querySelector("#tutorialTextbox").innerHTML = "Talk to us!<br><br>Interact with the SPACE<br>key!"
        document.querySelector("#tutorialTextbox").style.display = 'flex'
    }
    else if (num === 2) {
        let msg2 = new Message({
            position: {
                x: 260,
                y: 30
            },
            imageSrc: `./img/messages1/messageTemplate.png`,
            scale: .8
        })
        messages.push(msg2)
        document.querySelector("#tutorialMsg").innerHTML = "First day hey? Let me show you the ropes<br><br>Your job is to serve food to the animals of Maple Island.<br><br>We've got to move around and sell food to pay our rent."
        document.querySelector("#tutorialMsg").style.display = 'flex'
    } else if (num === 3) {
        let msg3 = new Message({
            position: {
                x: 260,
                y: 30
            },
            imageSrc: `./img/messages1/messageTemplate.png`,
            scale: .8
        })
        messages.push(msg3)
        document.querySelector("#tutorialMsg").innerHTML = "See that food on the top left?<br><br>It's your job to serve it to our hungry Maple monsters.<br><br>You do that with the SPACEBAR."
        document.querySelector("#tutorialMsg").style.display = 'flex'
    } else if (num === 4) {
        let msg4 = new Message({
            position: {
                x: 260,
                y: 30
            },
            imageSrc: `./img/messages1/messageTemplate.png`,
            scale: .8
        })
        if (customers.length < 1) {
            genCust(200, 200)
        }
        messages.push(msg4)
        document.querySelector("#tutorialMsg").innerHTML = "Hey, there's our first customer.<br><br>This is a great time to practice.<br><br>Try serving him with SPACEBAR, and come back!"
        document.querySelector("#tutorialMsg").style.display = 'flex'
    } else if (num === 4.5) {
        let msg4 = new Message({
            position: {
                x: 600,
                y: 130
            },
            imageSrc: `./img/messages1/textBox.png`,
            scale: 2
        })
        messages.push(msg4)
        document.querySelector("#tutorialTextbox").innerHTML = "Good job!<br><br>Come back for<br> another tip..."
        document.querySelector("#tutorialTextbox").style.display = 'flex'
    }
        else if (num === 5) {
        let msg5 = new Message({
            position: {
                x: 260,
                y: 30
            },
            imageSrc: `./img/messages1/messageTemplate.png`,
            scale: .8
        })
        messages.push(msg5)
        document.querySelector("#tutorialMsg").innerHTML = `Good job.<br><br>You see that coin you got?<br><br>That's 1 meso. We need ${minimumCoins} mesos to pay todays rent.<br>If you we cant pay rent, we'll close... That's GAME OVER.<br><br>Any extra, you can bring home. But rent keeps going up around here...`
        document.querySelector("#tutorialMsg").style.display = 'flex'
    }
    else if (num === 6) {
        let msg6 = new Message({
            position: {
                x: 260,
                y: 30
            },
            imageSrc: `./img/messages1/messageTemplate.png`,
            scale: .8
        })
        messages.push(msg6)
        document.querySelector("#tutorialMsg").innerHTML = "Now, get ready...<br><br>We're just about to open for the day--<br><br>Oh, forgot to mention...<br><br>Watch for THORNS on the ground.<br>Touching THORNS is GAME OVER<br><br>And be careful for bandits roaming Maple Island<br>Looking for some monster kills..."
        document.querySelector("#tutorialMsg").style.display = 'flex'
}
}

function startLevel1() {
    if (LEVEL != 1) {
        LEVEL = 1
        genLevel()
        GAMESTATE = "ACTIVE"
        decreaseTimer()
    }
}


function handleStartScreen(){
    background = new Sprite({
        position:{
            x: 150,
            y: 0
        },
        imageSrc: './img/backgrounds/login.jpeg',
        scale: .8
    })
    background.update()

    // put dark overlay over login screen
    c.globalAlpha = 0.6
    c.fillStyle = "black"
    c.fillRect(0,0,canvas.width,canvas.height)

    // "Press SPACEBAR to start game"
    c.globalAlpha = 1
    c.font = "40px Arial";
    c.fillStyle = "white";
    c.textAlign = "center";
    c.fillText(
      "Press SPACEBAR to start game",
      canvas.width / 2,
      canvas.height / 2 + 50
    );
    
    if(keys.space.pressed){
        GAMESTATE = "TUTORIAL"
        c.globalAlpha = 1
        LEVEL = "TUTORIAL_M1"
         background = new Sprite({
            position:{
                x: 0,
                y: 0
            },
            imageSrc: './img/background.png',
            scale: 1.41
        })
    }
}


function handleTutorial() {
    if (LEVEL === "STARTSCREEN"){
        if(keys.space.pressed){
            GAMESTATE = "TUTORIAL"
            c.globalAlpha = 1
            LEVEL = "TUTORIAL_M1"
             background = new Sprite({
                position:{
                    x: 0,
                    y: 0
                },
                imageSrc: './img/background.png',
                scale: 1.41
            })
            
        }
    }

    else if (LEVEL === "TUTORIAL_M1") {
        if (foodTrucks.length < 1) {
            genLevel()
            genTutorial(1)
        }
        if (spriteCollision({ rectangle1: player, rectangle2: foodTrucks[0] })) {
            messages = []
            LEVEL = "TUTORIAL_M1.1"
            document.querySelector("#tutorialTextbox").style.display = 'none'
        }

    }
    else if(LEVEL === "TUTORIAL_M1.1"){

        if(messages.length <1){
            genTutorial(1.1)
                }
        if(keys.space.pressed){
            messages = []
            LEVEL = "TUTORIAL_M2"
            document.querySelector("#tutorialTextbox").style.display = 'none'
        }
    }
    else if (LEVEL === "TUTORIAL_M2") {
        // "welcome diologue"
        if (spriteCollision({ rectangle1: player, rectangle2: foodTrucks[0] })) {
            // if space pressed, show dialogue, suppress player movement
            if(keys.space.pressed){
                keys.space.pressed = false
                genTutorial(2)
                LEVEL = "TUTORIAL_M3"
            }
        } else {
            messages = []
            document.querySelector("#tutorialMsg").style.display = 'none'
        }
    }
    else if (LEVEL === "TUTORIAL_M3") {
        if (spriteCollision({ rectangle1: player, rectangle2: foodTrucks[0] })) {
            // if space pressed, show dialogue, suppress player movement
            if(keys.space.pressed){
                keys.space.pressed = false
                genTutorial(3)
                LEVEL = "TUTORIAL_M4"
            }
        } else {
            messages = []
            document.querySelector("#tutorialMsg").style.display = 'none'
        }
    }
    else if (LEVEL === "TUTORIAL_M4") {
        if (spriteCollision({ rectangle1: player, rectangle2: foodTrucks[0] })) {
            if(keys.space.pressed){
                keys.space.pressed = false
                genTutorial(4)
                LEVEL = "TUTORIAL_M4.5"
            }
         } 
    } 
    else if(LEVEL === "TUTORIAL_M4.5"){
        // time to hunt tutorial snail
        if(keys.space.pressed){
            keys.space.pressed = false
            messages = []
            document.querySelector("#tutorialMsg").style.display = 'none'
        }
        if (todaysCoins === 1) {
            LEVEL = "TUTORIAL_M5"
            genTutorial(4.5)
        }
    }
    else if (LEVEL === "TUTORIAL_M5") {
        if (spriteCollision({ rectangle1: player, rectangle2: foodTrucks[0] })) {
            if(keys.space.pressed){
                keys.space.pressed = false
                messages = []
                document.querySelector("#tutorialTextbox").style.display = 'none'
                genTutorial(5)
                LEVEL = "TUTORIAL_M6"
            }
     } 
    }
    else if(LEVEL === "TUTORIAL_M6"){
        if (spriteCollision({ rectangle1: player, rectangle2: foodTrucks[0] })) {
            if(keys.space.pressed){
                keys.space.pressed = false
                messages = []
                genTutorial(6)
                LEVEL = "TUTORIAL_M7"
            }
        }
    }
    else if(LEVEL === "TUTORIAL_M7"){
        if(keys.space.pressed){
            keys.space.pressed = false
            startLevel1()
            messages = []
            document.querySelector("#tutorialMsg").style.display = 'none'
        }
    }

}
