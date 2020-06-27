import {
    LightningElement,
    api,
    track
} from 'lwc';

export default class BoatTile extends LightningElement {
    @api boat;
    @api selectedBoatId;
    @track boatId;

    // Getter for dynamically setting the background image for the picture
    get backgroundStyle() {
        return `background-image:url(${this.boat.Picture__c})`;
        //return `background-image:url(${this.boat.Picture__c;})`;
    }

    // Getter for dynamically setting the tile class based on whether the
    // current boat is selected
    get tileClass() {
        const TILE_WRAPPER_SELECTED_CLASS = 'tile-wrapper selected';
        const TILE_WRAPPER_UNSELECTED_CLASS = 'tile-wrapper';
        if (this.selectedBoatId === this.boat.Id){
            return TILE_WRAPPER_SELECTED_CLASS;
        } else {
            return TILE_WRAPPER_UNSELECTED_CLASS;
        }
    }

    // Fires event with the Id of the boat that has been selected.
    selectBoat() {

        const selectedEvent = new CustomEvent('boatselect', {
            detail: this.boat.Id
        });
        /*this.selectedBoatId = event.detail.id;
        this.boatId = event.detail.id;
        const selectedEvent = new CustomEvent('boatselect', {
            detail: this.boatId
        });*/
        this.dispatchEvent(selectedEvent);
    }
}