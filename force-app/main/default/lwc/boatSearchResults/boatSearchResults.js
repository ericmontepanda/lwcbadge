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
    @track columns = [{
            label: 'Name',
            fieldName: 'name',
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
    searchBoats(boatTypeId) {}

    // this public function must refresh the boats asynchronously
    // uses notifyLoading
    refresh() {}

    // this function must update selectedBoatId and call sendMessageService
    updateSelectedTile() {}

    // Publishes the selected boat Id on the BoatMC.
    sendMessageService(boatId) {}

    // This method must save the changes in the Boat Editor
    // Show a toast message with the title
    // clear lightning-datatable draft values
    handleSave() {
        const recordInputs = event.detail.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return {
                fields
            };
        });
        const promises = recordInputs.map(recordInput =>
            updateRecord(recordInput));
        Promise.all(promises)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Ship It!',
                        variant: 'success'
                    })
                );
            })
            .catch(error => {})
            .finally(() => {});
    }
    // Check the current value of isLoading before dispatching the doneloading or loading custom event
    notifyLoading(isLoading) {}
}