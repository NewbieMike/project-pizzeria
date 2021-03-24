class BaseWidget {
  constructor(wrapperElement, initialValue) {
    const thisWidget = this;

    thisWidget.removeSelection();
    thisWidget.dom = {};
    thisWidget.dom.wrapper = wrapperElement;

    thisWidget.correctValue = initialValue;
  }

  //get value jest wykonywanne przy każdej próbie odczytania wartości
  get value(){
    const thisWidget = this;

    return thisWidget.correctValue;
    //w "get'terze" wartość zwracana nie może być  
    //równa wartości pobieranej (w tym przypadku value)
  }

  //wykonywana przy każdej próbie ustawienia wartości
  set value(value) {
    const thisWidget = this;
    
    const newValue = thisWidget.parseValue(value);
    
    if(newValue != thisWidget.correctValue && thisWidget.isValid(newValue)){
    
      thisWidget.correctValue = newValue;
      thisWidget.announce();
    }
        
    thisWidget.renderValue();
  }


  setValue(value){
    const thisWidget = this;

    thisWidget.value = value;
  }

  parseValue(value){
    return parseInt(value);
  }

  isValid(value){
    return !isNaN(value);
  }

  renderValue(){
    const thisWidget = this;
    
    thisWidget.dom.wrapper.innerHTML = thisWidget.value;
  }
  removeSelection(){
    
        
    const selectedTables = document.querySelectorAll('.selected');
    for(let selected of selectedTables){
      selected.classList.remove('selected');
    }
  }
  announce() {
    const thisWidget = this;
    
    // stworzony Event nazywamy updated
    const event = new CustomEvent('updated', {
      bubbles: true
    });
    thisWidget.dom.wrapper.dispatchEvent(event);
  }
}

export default BaseWidget;