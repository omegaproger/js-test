const actionToBind = {
    "left": {
        keys: [37,65],
        enabled: true
    },
    "right": {
        keys: [39,68],
        enabled: true
    }
}

const block = document.querySelector('.block');
const attach = document.querySelector('#attach');
const detach = document.querySelector('#detach')
const controllerEnable = document.querySelector('#controller-enable')
const controllerDisable = document.querySelector('#controller-disable')
const addJump = document.querySelector('#add-jump')

let test = new InputController(actionToBind,block)

attach.onclick = () =>{
    test.attach(block);
}
detach.onclick = () =>{
    test.detach();
}

controllerEnable.onclick = () =>{
    test.enabled = true;
}
controllerDisable.onclick = () =>{
    test.enabled = false;
}

addJump.onclick = () => {
    test.bindActions({"jump":{
            keys:[32]
        }})
}

///Первый вариант




block.addEventListener(InputController.ACTION_ACTIVATED,({detail})=>{
    if (test.isActionActive('right')) {
        detail.target.style.left = '80%';
    }
    if (test.isActionActive('left')) {
        detail.target.style.left = '20%';
    }
   if (test.isActionActive('jump')) {
        detail.target.style.background = 'red';
    }
})

block.addEventListener(InputController.ACTION_DEACTIVATED,({detail})=>{
    if (!test.isActionActive('right')) {
        detail.target.style.left = '50%';
    }
    if (!test.isActionActive('left')) {
        detail.target.style.left = '50%';
    }
    if (!test.isActionActive('jump')) {
        detail.target.style.background = 'black';
    }
})

///Второй вариант

// block.addEventListener(InputController.ACTION_ACTIVATED,({detail})=>{
//     if(detail.action === 'right'){
//         detail.target.style.left = '80%';
//     }
//     if(detail.action === 'left'){
//         detail.target.style.left = '20%';
//     }
//     if(detail.action === 'jump'){
//         detail.target.style.background = 'red';
//     }
// })
// block.addEventListener(InputController.ACTION_DEACTIVATED,({detail})=>{
//     if(detail.action === 'right'){
//         detail.target.style.left = '50%';
//     }
//     if(detail.action === 'left'){
//         detail.target.style.left = '50%';
//     }
//     if(detail.action === 'jump'){
//         detail.target.style.background = 'black';
//     }
// })

