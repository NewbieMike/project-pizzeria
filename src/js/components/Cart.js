import {select, classNames, settings, templates} from '/js/settings.js';
import utils from '/js/utils.js';
import CartProduct from './CartProduct.js';

class Cart {
  constructor(element) {
    const thisCart = this;

    thisCart.products = [];

    thisCart.getElements(element);
    thisCart.initActions();
  }

  getElements(element) {
    const thisCart = this;

    thisCart.dom = {};

    thisCart.dom.wrapper = element;


    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);

    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);

    thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(select.cart.deliveryFee);

    thisCart.dom.subtotalPrice = thisCart.dom.wrapper.querySelector(select.cart.subtotalPrice);
    
    thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelectorAll(select.cart.totalPrice);

    thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(select.cart.totalNumber);
    
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    
    thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);

    thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
  }

  initActions() {
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click', function () {
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });

    thisCart.dom.productList.addEventListener('updated', function () {
      thisCart.update();
    });

    thisCart.dom.productList.addEventListener('remove', function (event) {
      thisCart.remove(event.detail.cartProduct);
    });

    thisCart.dom.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisCart.sendOrder();
    });
  }
  sendOrder(){
    const thisCart = this;

    const url = settings.db.url + '/' + settings.db.order; //Endpoint addres (http://localhost:3131/order)

    const payload = {
      address: thisCart.dom.address.value,
      phone: thisCart.dom.phone.value,
      totalPrice: thisCart.totalPrice,
      subtotalPrice: thisCart.subtotalPrice,
      totalNumber: thisCart.totalNumber,
      deliveryFee: thisCart.deliveryFee,
      products: []
    };
    console.log(payload.products);
    for(let prod of thisCart.products) {
      payload.products.push(prod.getData());
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
      
    fetch(url, options);
  }
  remove(cartProduct) {
    const thisCart = this;
    const productIndex = thisCart.products.indexOf(cartProduct);
    thisCart.products.splice(productIndex, 1);
    cartProduct.dom.wrapper.remove();
    thisCart.update();
      
  }

  add(menuProduct) {
    const thisCart = this;
    /* generate HTML based on template */

    const generatedHTML = templates.cartProduct(menuProduct);

    /* create element using utils.createElementFromHTML */

    const generatedDOM = utils.createDOMFromHTML(generatedHTML);


    /* add element to menu */

    thisCart.dom.productList.appendChild(generatedDOM);
    //console.log('adding product', menuProduct);

    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    thisCart.update();
  }


  update() {
    const thisCart = this;
    const deliveryFee = settings.cart.defaultDeliveryFee;
    let totalNumber = 0;
    let subtotalPrice = 0;
    let totalPrice = 0;

    for (thisCart.CartProduct of thisCart.products) {
      totalNumber += thisCart.CartProduct.amount;
      subtotalPrice += parseInt(thisCart.CartProduct.price);
      totalPrice = subtotalPrice + deliveryFee;

    }

    //Add to HTML
    
    thisCart.dom.subtotalPrice.innerHTML = subtotalPrice;
    thisCart.dom.totalNumber.innerHTML = totalNumber;
    thisCart.dom.deliveryFee.innerHTML = deliveryFee;
    thisCart.dom.totalPrice[0].innerHTML = totalPrice;
    thisCart.dom.totalPrice[1].innerHTML = totalPrice;
  }
}

export default Cart;