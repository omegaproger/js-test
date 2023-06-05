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

test.bindActions({"jump":{
        keys:[32],
        enabled:true
    }})

block.addEventListener(InputController.ACTION_ACTIVATED,({detail})=>{
    if(detail.action === 'right'){
        detail.target.style.transform = 'translate(80%,0)';
    }
    if(detail.action === 'left'){
        detail.target.style.transform = 'translate(20%,0)';
    }
    if(detail.action === 'jump'){
        detail.target.style.background = 'red';
    }
})
block.addEventListener(InputController.ACTION_DEACTIVATED,({detail})=>{
    if(detail.action === 'right'){
        detail.target.style.transform = 'translate(50%,0)';
    }
    if(detail.action === 'left'){
        detail.target.style.transform = 'translate(50%,0)';
    }
    if(detail.action === 'jump'){
        detail.target.style.background = 'black';
    }
})

