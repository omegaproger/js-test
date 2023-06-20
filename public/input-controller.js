class InputController{
    static ACTION_ACTIVATED='input-controller:action-activated';

    static ACTION_DEACTIVATED = "input-controller:action-deactivated";

    enabled = true;

    focused = true;

    actions = {};

    target = null;

    types = [];

    plugins = []

    constructor(actionsToBind,target ) {
        window.addEventListener("blur", ()=>{
            this.focused = false;
        });
        window.addEventListener("focus", ()=>{
            this.focused = true;
        });
        this.bindActions(actionsToBind)
        this.bindTypes()
        this.attach(target)
        this.bindPlugins()

        this.plugins.forEach((plugin)=>{
            return plugin;
        })

    }

    triggerEvent = (name,keyCode) => {
        if(!this.enabled){
            return;
        }
        this.target.dispatchEvent(new CustomEvent(name, {
            bubbles:true,
            detail: {
                target: this.target
            }}));
    }

    bindActions(actionsToBind){
        Object.keys(actionsToBind).forEach((key)=>{
            this.actions[key] = {enabled:true,...actionsToBind[key]}
        })
    }

    bindPlugins(plugins=[]){
        this.plugins = [new Keyboard(this),...plugins]
    }


    bindTypes(){
        Object.keys(this.actions).forEach((k)=>{
            Object.keys(this.actions[k]).forEach((key,index)=>{
                if (key !== 'enabled'){
                    this.types.push(key)
                }
            })
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
        this.plugins.forEach((plugin)=>{
            plugin.attach();
        })
    }
    detach(){
        this.plugins.forEach((plugin)=>{
            plugin.detach();
        })
        this.target = null;
    }

    isActionActive(action){
      if(!this.actions[action]){
          return false;
      }
      if(!this.actions[action].enabled){
          return false;
      }
      return this.plugins.reduce((a,plugin)=>{
          return a|| plugin.checkedAction(action)
      },false);
    }
}


class Keyboard{

    controller = null;
    target = null;
    enabled = false;
    pressedKeys = [];

    constructor(controller) {
        this.controller = controller
        this.isKeyboard()
        this.attach()
    }
    keyDownEvent = (e)=>{
        if (!this.enabled && !this.isKeyPressed(e.keyCode)){
            return;
        }
        if (this.pressedKeys.includes(e.keyCode)){
            return;
        }
        const action = Object.keys(this.controller.actions).find((key)=>
            this.controller.actions[key].keys.includes(e.keyCode)
        )
        this.pressedKeys.push(e.keyCode);
        if (this.checkedAction(action)){
            this.controller.triggerEvent(InputController.ACTION_ACTIVATED)
        }
    }

    keyUpEvent = (e)=>{
        if (!this.enabled  && !this.isKeyPressed(e.keyCode)){
            return;
        }
        const action = Object.keys(this.controller.actions).find((key)=>
            this.controller.actions[key].keys.includes(e.keyCode)
        )
        this.pressedKeys = this.pressedKeys.filter((key)=>key !== e.keyCode);
        if (!this.checkedAction(action)){
            this.controller.triggerEvent(InputController.ACTION_DEACTIVATED);
        }
    };


    isKeyboard(){

        if(!this.controller.types){
            return
        }
        if (this.controller.types.includes('keys')){
           this.enabled = true

        }
    }

    attach(){
        document.addEventListener('keydown',this.keyDownEvent);
        document.addEventListener('keyup',this.keyUpEvent);
    }

    detach(){
        document.removeEventListener('keydown',this.keyDownEvent);
        document.removeEventListener('keyup',this.keyUpEvent);
    }

    checkedAction(action){
        if (!action){
            return;
        }
        return this.pressedKeys.reduce((a,cur)=>{
            return a || this.controller.actions[action].keys.includes(cur)
        },false)
    }
    isKeyPressed(keyCode){
        return this.pressedKeys.includes(keyCode);
    }

}

