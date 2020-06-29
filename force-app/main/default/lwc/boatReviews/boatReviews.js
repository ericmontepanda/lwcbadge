// imports
import {
  LightningElement,
  track,
  wire,
  api
} from 'lwc';
import {
  NavigationMixin
} from 'lightning/navigation';

import {
  refreshApex
} from '@salesforce/apex';


import getAllReviews from '@salesforce/apex/BoatDataService.getAllReviews';

export default class BoatReviews extends NavigationMixin(LightningElement) {
  // Private
  boatId;
  @track error;
  @track boatReviews;
  @track isLoading = false;;

  @track name;
  @track comment;
  @track rating;
  @track _boat;

  // Getter and Setter to allow for logic to run on recordId change
  @api
  get recordId() {
    return this.boatId;
  }
  set recordId(value) {
    //sets boatId attribute
    //sets boatId assignment
    //get reviews associated with boatId

    this._boat = value;
    this.boatId = value;
    this.name = value.Name;
    this.comment = value.Comment__c;
    this.rating = value.Rating__c;
    console.log('boat id... ' + this.boatId);
    this.getReviews();
  }



  // Getter to determine if there are reviews to display
  get reviewsToShow() {
    return (this.boatReviews ? true : false);
  }

  // Public method to force a refresh of the reviews invoking getReviews
  @api refresh() {

    this.getReviews();
  }

  // Imperative Apex call to get reviews for given boat
  // returns immediately if boatId is empty or null
  // sets isLoading to true during the process and false when it’s completed
  // Gets all the boatReviews from the result, checking for errors.
  getReviews() {
    this.boatReviews = [];
    console.log('entering review...' + this.boatId);
    //this.isLoading = true;
    if (this.boatId) {
      getAllReviews({
          boatId: this.boatId
        })
        .then(result => {
          console.log('result.' + JSON.stringify(result));
          this.boatReviews = result;
          this.isLoading = false;
        })
        .catch(error => {
          this.error = error;
          this.isLoading = false;
        });
    } else {
      this.boatReviews = undefined;
      this.isLoading = false;
    }

  }

  // Helper method to use NavigationMixin to navigate to a given record on click
  navigateToRecord(event) {
    let recId = event.target.dataset;
    console.log('event ' + JSON.stringify(recId));
    // View a custom object record.
    this[NavigationMixin.Navigate]({
      type: 'standard__recordPage',
      attributes: {
        recordId: event.target.dataset.recordId,
        actionName: 'view'
      }
    });
  }
}