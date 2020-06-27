import {
    LightningElement,
    track,
    wire,
    api
} from 'lwc';
import {
    APPLICATION_SCOPE,
    MessageContext,
    subscribe,
} from 'lightning/messageService';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';
export default class BoatSearchResults extends LightningElement {
    @track selectedBoatId;
    @track columns = [];
    @track boatTypeId = '';
    @track boats;
    @track isLoading = false;

    // wired message context
    @wire(MessageContext)
    messageContext;
    wiredBoats(result) {}

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
    /*handleSave() {
        const recordInputs = event.detail.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return {
                fields
            };
        });
        const promises = recordInputs.map(recordInput =>
            //update boat record
        );
        Promise.all(promises)
            .then(() => {})
            .catch(error => {})
            .finally(() => {});
    }*/
    // Check the current value of isLoading before dispatching the doneloading or loading custom event
    notifyLoading(isLoading) {}
}