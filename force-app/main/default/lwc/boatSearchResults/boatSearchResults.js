import {
    LightningElement,
    track,
    wire,
    api
} from 'lwc';

import {
    updateRecord
} from 'lightning/uiRecordApi';
import {
    refreshApex
} from '@salesforce/apex';
import {
    ShowToastEvent
} from 'lightning/platformShowToastEvent';
import {
    APPLICATION_SCOPE,
    MessageContext,
    subscribe,
} from 'lightning/messageService';

import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';

import NAME_FIELD from '@salesforce/schema/Boat__c.Name';
import LENGTH_FIELD from '@salesforce/schema/Boat__c.Length__c';
import PRICE_FIELD from '@salesforce/schema/Boat__c.Price__c';
import DESCRIPTION_FIELD from '@salesforce/schema/Boat__c.Description__c';

export default class BoatSearchResults extends LightningElement {
    @track selectedBoatId;
    @track draftValues = [];
    @track columns = [{
            label: 'Name',
            fieldName: 'Name',
            editable: true
        },
        {
            label: 'Length',
            fieldName: 'Length__c',
            type: 'number',
            editable: true
        },
        {
            label: 'Price',
            fieldName: 'Price__c',
            type: 'currency',
            editable: true
        },
        {
            label: 'Description',
            fieldName: 'Description__c',
            editable: true
        },
    ];
    @track boatTypeId = '';
    @track boats;
    @track isLoading = false;

    // wired message context
    @wire(MessageContext)
    messageContext;

    @wire(getBoats, {
        boatTypeId: '$boatTypeId'
    }) wiredBoats(result) {
        console.log('what are my results...  ' + JSON.stringify(result));
        this.boats = result;
    }

    // public function that updates the existing boatTypeId property
    // uses notifyLoading
    @api searchBoats(boatTypeId) {
        //this.boats = [];
        this.notifyLoading(true);
        console.log('BOAT>>> ' + JSON.stringify(boatTypeId));
        this.boatTypeId = boatTypeId;
        this.notifyLoading(false);
        //this.notifyLoading(true);
        /*getBoats({
            boatTypeId: '$boatTypeId'
        }).then(
            this.refresh()
        );//result => {
            //this.boats = result
            //this.notifyLoading(false);
        //});*/


    }

    // this public function must refresh the boats asynchronously
    // uses notifyLoading

    refresh() {
        console.log('BREAK');
        this.notifyLoading(false);
        return refreshApex(this.boats);

    }

    // this function must update selectedBoatId and call sendMessageService
    updateSelectedTile() {}

    // Publishes the selected boat Id on the BoatMC.
    sendMessageService(boatId) {}

    // This method must save the changes in the Boat Editor
    // Show a toast message with the title
    // clear lightning-datatable draft values

    handleSave(event) {
        const recordInputs =  event.detail.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
   
        const promises = recordInputs.map(recordInput => updateRecord(recordInput));
       
        Promise.all(promises).then(d => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'All Contacts updated',
                    variant: 'success'
                })
            );
             // Clear all draft values
             this.draftValues = [];
   
             // Display fresh data in the datatable
            this.refresh();
             // return refreshApex(this.boats);
        }).catch(error => {
            // Handle error
        });
    }
    // Check the current value of isLoading before dispatching the doneloading or loading custom event
    notifyLoading(isLoading) {
        let loadingEvent;
        if (isLoading) {
            loadingEvent = new CustomEvent('loading');
        } else {
            loadingEvent = new CustomEvent('doneloading');
        }
        console.log('what is my loading..... ' + JSON.stringify(loadingEvent));
        this.dispatchEvent(loadingEvent);
    }
}