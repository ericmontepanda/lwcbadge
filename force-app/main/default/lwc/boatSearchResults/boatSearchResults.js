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
    createMessageContext,
    MessageContext,
    publish,
    releaseMessageContext,
    subscribe,
    unsubscribe
} from 'lightning/messageService';

import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import getSimilarBoats from '@salesforce/apex/BoatDataService.getSimilarBoats';

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
    @api async refresh() {
        //await refreshApex(this.boats); 
        this.isLoading = true;
        await refreshApex(this.boats)
            .then(() => this.notifyLoading(false))
            .catch(() => this.notifyLoading(true));
    }

    // this function must update selectedBoatId and call sendMessageService
    updateSelectedTile(event) {
        this.selectedBoatId = event.detail.boatId;
        this.sendMessageService(this.selectedBoatId);
    }

    // Publishes the selected boat Id on the BoatMC.
    sendMessageService(boatId) {
        const payload = { recordId: boatId };
        publish(this.messageContext, BOATMC, payload);
    }

    // This method must save the changes in the Boat Editor
    // Show a toast message with the title
    // clear lightning-datatable draft values

    handleSave(event) {
        const recordInputs = event.detail.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return {
                fields
            };
        });

        const promises = recordInputs.map(recordInput => updateRecord(recordInput));

        /*Promise.all(promises).then(d => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Ship It!',
                    variant: 'success'
                })
            );
            // Clear all draft values
            this.draftValues = [];

            // Display fresh data in the datatable
            this.refresh();
            // return refreshApex(this.boats);
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: error.body.message,
                    variant: 'error'
                })
            );
            // Handle error
        });*/

        Promise.all(promises)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Ship It!',
                        variant: 'success'
                    })
                );
                // Clear all draft values
                this.draftValues = [];

                // Display fresh data in the datatable
                this.refresh();
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
                this.refresh();
            })
            .finally(() => {
                this.refresh();
            });
    }
    // Check the current value of isLoading before dispatching the doneloading or loading custom event
    notifyLoading(isLoading) {
        let loadingEvent;
        this.isLoading = isLoading;
        if (this.isLoading === true) {
            this.dispatchEvent(new CustomEvent('loading'));
            //loadingEvent = new CustomEvent('loading');
        } else {
            this.dispatchEvent(new CustomEvent('doneloading'));
            //loadingEvent = new CustomEvent('doneloading');
        }
        //console.log('what is my loading..... ' + JSON.stringify(loadingEvent));
        //this.dispatchEvent(loadingEvent);
    }
}