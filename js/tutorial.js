messages = []

function genTutorial(num){
    messages = []
    let tutorial = new Message({
        position:{
            x: 100,
            y: 100
        },
        imageSrc: `./img/messages1/tutorial${num}.png`,
        scale: 0.8    
    })
    messages.push(tutorial)
}

function iterateTutorial(){
    if(LEVEL === "TUTORIAL_M1"){
        // messages.push(tutorial1)
        genTutorial(1)
        window.addEventListener("click",(nextLevel) => {
            LEVEL = "TUTORIAL_M2"
        }, {once:true})
    }
     else if (LEVEL === "TUTORIAL_M2"){
        genTutorial(2)
        window.addEventListener("click",(nextLevel)=>{
            LEVEL = "TUTORIAL_M3"
        }, {once:true})
    }
    else if (LEVEL === "TUTORIAL_M3"){
        genTutorial(3)
        window.addEventListener("click", (nextLevel)=> {
            LEVEL = "LEVEL1"
            GAMESTATE = "ACTIVE"
        }, {once:true})
        }
}
