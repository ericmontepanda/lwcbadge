// imports

import {
    LightningElement,
    api,
    track
} from 'lwc';

import {
    ShowToastEvent
} from 'lightning/platformShowToastEvent';

const TOAST_TITLE = 'Review Created!';
const TOAST_SUCCESS_VARIANT = 'success';


export default class BoatAddReviewForm2 extends LightningElement {
    // Private
    boatId;
    @track rating;

    @track _boat;

    // Public Getter and Setter to allow for logic to run on recordId change
    @api
    get recordId() {
        return this.boatId;
    }
    set recordId(value) {
        console.log('VAL....' +JSON.stringify(value));
        //sets boatId attribute
        //sets boatId assignment
        this._boat = value;
        this.boatId = value.Boat__c;
        this.name = value.Name;
        this.comment = value.Comment__c;
        this.rating = value.Rating__c;
    }

    // Gets user rating input from stars component
    handleRatingChanged(event) {
        this.rating = event.detail.rating;
    }

    // Custom submission handler to properly set Rating
    // This function must prevent the anchor element from navigating to a URL.
    // form to be submitted: lightning-record-edit-form
    handleSubmit(event) {
        console.log('...event detail...  ' +JSON.stringify(event.detail));
        console.log('onsubmit: ' + event.detail.fields);
        event.preventDefault(); // stop the form from submitting
        const fields = event.detail.fields;
        console.log('this... boat... ' +this._boat);
        console.log('this... rating... ' +this.rating);

        fields.Boat__c = this._boat;
        fields.Rating__c = this.rating;
        console.log(JSON.stringify(fields));
        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }
    // Shows a toast message once form is submitted successfully
    // Dispatches event when a review is created
    handleSuccess() {
        // TODO: dispatch the custom event and show the success message
        this.dispatchEvent(
            new ShowToastEvent({
                title: TOAST_TITLE,
                message: 'SUCCESS',
                variant: TOAST_SUCCESS_VARIANT
            })
        );

        const fireEvent = new CustomEvent('createreview');
        this.dispatchEvent(fireEvent); 
        this.handleReset();





    }

    // Clears form data upon submission
    // TODO: it must reset each lightning-input-field
    handleReset() {
        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
    }
}