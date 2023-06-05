class InputController{
    enabled = true;
    focused = true;
    static ACTION_ACTIVATED='input-controller:action-activated';
    static ACTION_DEACTIVATED = "input-controller:action-deactivated";


    actions = {};
    target = null;
    pressedKeys = [];

    keyDownEvent = (e)=>{
        if (!this.enabled || !this.focused || this.isKeyPressed(e.keyCode)){
            return;
        }
        this.target.dispatchEvent(new CustomEvent(InputController.ACTION_ACTIVATED, {
            bubbles:true,
            detail: { target:this.target,action:Object.keys(this.actions).forEach((key)=>{
                    return this.actions[key].keys.reduce((a,current)=>{
                        return a || this.pressedKeys.includes(current)
                    },false) && key
                })}
        }));
        this.pressedKeys.push(e.keyCode);

    }

    keyUpEvent = (e)=>{
        if (!this.enabled || !this.focused || !this.isKeyPressed(e.keyCode)){
            return;
        }
        this.target.dispatchEvent(new CustomEvent(InputController.ACTION_DEACTIVATED, {
            bubbles:true,
            detail: { target:this.target}
        }));
        this.pressedKeys = this.pressedKeys.filter((key)=>key !== e.keyCode);
    };

    constructor(actionsToBind,target ) {
        window.addEventListener("blur", ()=>{
            this.focused = false;
        });
        window.addEventListener("focus", ()=>{
            this.focused = true;
        });

        this.bindActions(actionsToBind)
        this.attach(target)
    }

    bindActions(actionsToBind){
        Object.keys(actionsToBind).forEach((key)=>{
            this.actions[key] = {enabled:true,...actionsToBind[key]}
        })
    }

    enableAction(actionName ){
        this.actions[actionName].enabled = true;
    }

    disableAction(actionName){
        this.actions[actionName].enabled = false;
    }

    attach(target,dontEnable = false){
        this.target = target;
        this.enabled = !dontEnable;
        document.addEventListener('keydown',this.keyDownEvent)
        document.addEventListener('keyup',this.keyUpEvent)
    }
    detach(){
        document.removeEventListener('keydown',this.keyDownEvent);
        document.removeEventListener('keyup',this.keyUpEvent);
        this.target = null;
    }

    isActionActive(action){
        if(!this.actions[action].enabled){
          return false;
      }
      return this.actions[action].keys.reduce((a,current)=>{
          return a || this.pressedKeys.includes(current);
      },false)

    }

    isKeyPressed(keyCode){
        return this.pressedKeys.includes(keyCode);
    }

}