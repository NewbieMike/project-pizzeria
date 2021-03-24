import {templates, select,} from './../settings.js';
import app from '../app.js';

class Home {
  constructor(wrapper){

    const thisHome = this;

    thisHome.render(wrapper);
    thisHome.initWidgets();
    thisHome.initActions();
    thisHome.navigate();
  }

  render(wrapper){
    const thisHome = this;

    const generatedHTML = templates.homeWidget();

    thisHome.dom = {};
    thisHome.dom.wrapper = wrapper;
    thisHome.dom.wrapper.innerHTML = generatedHTML;

    thisHome.pages = document.querySelector(select.containerOf.pages).children;
    thisHome.navLinks = document.querySelector(select.nav.links);
    thisHome.dom.orderOnline = document.querySelector('.order-online');
    thisHome.dom.bookTable = document.querySelector('.booking');
  }

  initWidgets(){
    const thisHome = this;

    thisHome.element = document.querySelector('.carousel-section');
    //eslint-disable-next-line no-undef
    thisHome.flkty = new Flickity (thisHome.element,{
      cellAlign: 'center',
      contain: true,
      autoPlay: true,
      prevNextButtons: true,
      wrapAround: true,
    });
  }
  initActions(){
    const thisHome = this;

    thisHome.dom.orderOnline.addEventListener('click', function(event){
      event.preventDefault();
      console.log('click order');
    });

    thisHome.dom.bookTable.addEventListener('click', function(event){
      event.preventDefault();
      console.log('click booking');
    });
  }

  navigate(){
    const thisHome = this;

    thisHome.dom.orderOnline.addEventListener('click', function(){
      app.activatePage('order');
      window.location.hash = '/#order';
    });

    thisHome.dom.bookTable.addEventListener('click', function(){
      app.activatePage('booking');
      window.location.hash = '/#booking';
    });

    
  }
}

export default Home;