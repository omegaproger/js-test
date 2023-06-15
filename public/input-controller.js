class InputController{
    enabled = true;
    focused = true;
    static ACTION_ACTIVATED='input-controller:action-activated';
    static ACTION_DEACTIVATED = "input-controller:action-deactivated";

    activated = [];
    actions = {};
    target = null;
    types = [];
    plugins = []

    triggerEvent = (name,keyCode) => {
        if(!this.enabled){
            return;
        }
        //Воторой вариант

        // const action = Object.keys(this.actions).find((key)=>
        //     this.actions[key].keys.includes(keyCode)
        // )
        // if(!action){
        //     return
        // }
        this.target.dispatchEvent(new CustomEvent(name, {
            bubbles:true,
            detail: {
                target: this.target
            }}));
    }

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
      return this.activated.includes(action);
    }
}


class Keyboard{

    controller = null;
    target = null;
    enabled = false;
    pressedKeys = [];

    keyDownEvent = (e)=>{
        if (!this.enabled && !this.isKeyPressed(e.keyCode)){
            return;
        }
        const action = Object.keys(this.controller.actions).find((key)=>
            this.controller.actions[key].keys.includes(e.keyCode)
        )
        this.controller.activated.push(action)
        this.pressedKeys.push(e.keyCode);
        this.controller.triggerEvent(InputController.ACTION_ACTIVATED)
    }

    keyUpEvent = (e)=>{
        if (!this.enabled  && !this.isKeyPressed(e.keyCode)){
            return;
        }
        const action = Object.keys(this.controller.actions).find((key)=>
            this.controller.actions[key].keys.includes(e.keyCode)
        )
        this.controller.activated = this.controller.activated.filter((item)=>item !== action)
        this.pressedKeys = this.pressedKeys.filter((key)=>key !== e.keyCode);
        this.controller.triggerEvent(InputController.ACTION_DEACTIVATED)

    };
    constructor(controller) {
        this.controller = controller
        this.isKeyboard()
        this.attach()
    }


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


    isKeyPressed(keyCode){
        return this.pressedKeys.includes(keyCode);
    }

}