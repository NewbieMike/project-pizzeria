/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };

  class Product {
    constructor(id, data){
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrdersForm();
      thisProduct.processOrder();
      console.log('new Product:', thisProduct);
    }

    renderInMenu() {
      const thisProduct = this;

      /* generate HTML based on template */
      const generatedHTML = templates.menuProduct(thisProduct.data);
      /* create element using utils.createElementFromHTML */
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);
      /* find menu container */
      const menuContainer = document.querySelector(select.containerOf.menu);
      /* add element to menu */
      menuContainer.appendChild(thisProduct.element);
    }

    getElements(){
      const thisProduct = this;

      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    }

    initAccordion() {
      const thisProduct = this;

      /* find the clickable trigger (the element that should react to clicking) */
      const clickableTrigger = thisProduct.accordionTrigger;
      console.log(clickableTrigger);

      /* START: add event listener to clickable trigger on event click */
      clickableTrigger.addEventListener('click', function(event) {
      /* prevent default action for event */
        event.preventDefault();
        /* find active product (product that has active class) */
        const activeProducts = document.querySelectorAll('.product.active');
        console.log(activeProducts);
        /* START: loop for each active product */
        for (let activeProduct of activeProducts){
        /* START: if activeProduct is not element of thisProduct */
          if(activeProduct != thisProduct.element){
          /*  if it is true remove class active from it */
            activeProduct.classList.remove('active');
          /* END: if activeProduct is not element of thisProduct */
          }
        /* END: loop for each active product */
        }
        /* toggle active class on thisProduct.element */
        thisProduct.element.classList.toggle('active');
      /* END: add event listener to clickable trigger on event click */
      });

    }

    initOrdersForm(){
      const thisProduct = this;
      console.log(thisProduct);
      thisProduct.form.addEventListener('submit', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });

      for(let input of thisProduct.formInputs){
        input.addEventListener('change', function(){
          thisProduct.processOrder();
        });
      }

      thisProduct.cartButton.addEventListener('click', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });
    }

    processOrder() {
      const thisProduct = this;

      // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}
      const formData = utils.serializeFormToObject(thisProduct.form); //Dostęp do formularza z HTML
      console.log('formData', formData);

      // set price to default price
      let price = thisProduct.data.price; //Zmienna price, path: dane konkretnego obiektu -> jego cena z data.js

      // for every category (param)...
      for(let paramId in thisProduct.data.params) { // Dla każdego parametru w tym obiekcie -> jego parametry z data.js
        // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
        const param = thisProduct.data.params[paramId]; // Wejście wewnątrz opcji i wyświetlenie jej danych  latte {label: 'Latte', price: 1, default: true} i innych wariantów
        console.log(paramId, param); //paramId - klasyfikacja ogólna (np. cofee lub toppings) i ich elementy, natomiast "param" to każdy z tych elementów osobno

        // for every option in this category
        for(let optionId in param.options) {

          const selectImg = thisProduct.imageWrapper.querySelector('.' + paramId + '-' + optionId);
          console.log(selectImg);

          // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
          const option = param.options[optionId];
          console.log(optionId, option);// wyświetlenie samej pod opcji z dokładnie jej parametrami np. olives {label: "Olives", price: 2, default: true}

          // check if there is param with a name of paramId in formData and if it includes optionId
          if(formData[paramId] && formData[paramId].includes(optionId)) {
            // check if the option is not default

            //Do opisania!!
            if (selectImg != null){
              selectImg.classList.add('active');
            }
            if(!option.default) {
              // add option price to price variable
              price += option.price;
            }
          } else {
            if (selectImg != null){
              selectImg.classList.remove('active');
            }
            // check if the option is default
            if(option.default) {
              // reduce price variable
              price -= option.price;
            }
          }

        }
      }
      // update calculated price in the HTML
      thisProduct.priceElem.innerHTML = price;


    }


  }

  const app = {
    initMenu: function(){
      const thisApp = this;

      console.log('thisApp.data:', thisApp.data);
      for (let productData in thisApp.data.products) {
        new Product(productData, thisApp.data.products[productData]);
      }

    },

    initData: function(){
      const thisApp = this;

      thisApp.data = dataSource;
    },

    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);

      thisApp.initData();
      thisApp.initMenu();
    },
  };

  app.init();
}
