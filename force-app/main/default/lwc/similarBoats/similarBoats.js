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
    getRecord,
    getFieldValue
} from 'lightning/uiRecordApi';

import {
    refreshApex
} from '@salesforce/apex';
import getSimilarBoats from '@salesforce/apex/BoatDataService.getSimilarBoats';

const ERROR_TITLE = 'Error loading Similar Boats';
const ERROR_VARIANT = 'error';
export default class SimilarBoats extends NavigationMixin(LightningElement) {
    boatId;
    // Private
    @track currentBoat;
    @track relatedBoats;
    @track boatId;
    @track error;

    //public
    @api
    get recordId() {
        return this.boatId;
    }
    set recordId(value) {
        // sets the boatId value
        // sets the boatId attribute
        this.boatId = value;
        this.type = value.BoatType__c;
        this.length = value.Length__c;
        this.price = value.Price__c;
    }
    @track type;
    @track price;
    @track length;
    // public
    @api similarBy;

    // Wire custom Apex call, using the import named getSimilarBoats
    // Populates the relatedBoats list
    @wire(getSimilarBoats, {
        boatId: '$boatId',
        similarBy: '$similarBy'
    }) similarBoats({
        error,
        data
    }) {
        if (data) {
            console.log('JSON>>> ' +JSON.stringify(data));
            this.relatedBoats = data;
            console.log('JSON 1234' +JSON.stringify(relatedBoats));
        } else if (error) {
            this.error = error;
            console.warn(this.error);
            const evt = new ShowToastEvent({
                title: ERROR_TITLE,
                message: this.error,
                variant: ERROR_VARIANT
            });
            this.dispatchEvent(evt);
            this.isLoading = false;
        }
    }
    get getTitle() {
        return 'Similar boats by ' + this.similarBy;
    }
    get noBoats() {
        return !(this.relatedBoats && this.relatedBoats.length > 0);
    }

    // Navigate to record page
    openBoatDetailPage(event) {
        // View a custom object record.
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: event.detail.boatId,
                actionName: 'view'
            }
        });
    }
}