const actionToBind = {
    "left": {
        keys: [37,65],
        enabled: true
    },
    "right": {
        keys: [39,68],
        enabled: true
    },
}

const block = document.querySelector('.block');

let test = new InputController(actionToBind,block)

document.addEventListener('keydown',(e)=>{
    console.log(test.isActionActive('left'),'ACTIVE');
})

