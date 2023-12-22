class Component{
    static parse(component){
        const element = document.createElement(component.tag);
        if(component.id) element.id = component.id;
        if(component.class) element.className = component.class;
        if(component.child){
            component.child.forEach(child => {
                element.appendChild(Component.parse(child));
            });
        }
        return element;
    }
}

export default Component;