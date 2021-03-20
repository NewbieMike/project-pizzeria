import { templates, select } from '/js/settings.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking {
  //Create constructor with reference to container (element)
  constructor(element){
    const thisBooking = this;

    //Start render method 
    thisBooking.render(element);

    //Call initWidgets method (without args)
    thisBooking.initWidgets();
  }

  render(element){
    const thisBooking = this;

    //Generate html by template
    const generatedHTML = templates.bookingWidget();

    //create empty object "thisBooking.dom"
    thisBooking.dom = {};
    //add wrapper to this object and add reference agr from container
    thisBooking.dom.wrapper = element;
    //change value of wrapper to value from generatedHTML
    thisBooking.dom.wrapper.innerHTML = generatedHTML;
    //get dom.peopleAmount
    thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
    //get dom.hoursAmount
    thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);
    //get dom.datePicker
    thisBooking.dom.datePicker = document.querySelector(select.widgets.datePicker.wrapper)
    //get hourPicker
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
  }

  initWidgets(){
    const thisBooking = this;
    //Create inst. AmountWidget for peopleAmount
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    //Create inst. AmountWidget for hourAmount
    thisBooking.hourAmount = new AmountWidget(thisBooking.dom.hoursAmount);

    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);

    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
    //
    thisBooking.dom.peopleAmount.addEventListener('update', function() {

    });
    
    thisBooking.dom.hoursAmount.addEventListener('update', function() {
    });
  }

}
export default Booking;