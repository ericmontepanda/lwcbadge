import {
    LightningElement,
    track,
    wire,
    api
} from 'lwc';
import getBoatsByLocation from '@salesforce/apex/BoatDataService.getBoatsByLocation';
import {
    ShowToastEvent
} from 'lightning/platformShowToastEvent';

const LABEL_YOU_ARE_HERE = 'You are here!';
const ICON_STANDARD_USER = 'standard:user';
const ERROR_TITLE = 'Error loading Boats Near Me';
const ERROR_VARIANT = 'error';
export default class BoatsNearMe extends LightningElement {
    @api boatTypeId;
    @track mapMarkers = [];
    @track isLoading = true;
    @track isRendered;
    @track latitude;
    @track longitude;
    @track error;
    @track locations = [];

    // Add the wired method from the Apex Class
    // Name it getBoatsByLocation, and use latitude, longitude and boatTypeId
    // Handle the result and calls createMapMarkers
    @wire(getBoatsByLocation, {
        boatTypeId: '$boatTypeId',
        latitude: '$latitude',
        longitude: '$longitude'
    }) wiredBoatsJSON({
        error,
        data
    }) {
        if (data) {
            //let parseData = JSON.parse(data);
            /*console.log('d.... ' +JSON.stringify( parseData));
            parseData.forEach(loc => {
                this.locations.push({
                    title: loc.Name,
                    location: {
                        Latitude: loc.Geolocation__Latitude__s,
                        Longitude: loc.Geolocation__Longitude__s
                    },
                    icon: 'utility:salesforce1'
                });
            });*/
            this.createMapMarkers(data);
            this.isLoading = false;
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


    // Controls the isRendered property
    // Calls getLocationFromBrowser()
    renderedCallback() {
        this.isRendered = true;
        this.getLocationFromBrowser();
    }

    // Gets the location from the Browser
    // position => {latitude and longitude}
    getLocationFromBrowser() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log(position.coords.latitude);
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                console.log(this.latitude);
                console.log(this.latitude);
            },
            (e) => {
                this.strError = e.message;
            }, {
                enableHighAccuracy: true,
            }
        );
    }

    // Creates the map markers
    createMapMarkers(boatData) {
        this.mapMarkers = [];
        console.log('what is my boatdat... ' + JSON.stringify(boatData));
        this.mapMarkers.push({
            title: LABEL_YOU_ARE_HERE,
            location: {
                Latitude: this.latitude,
                Longitude: this.longitude
            },
            icon: ICON_STANDARD_USER
        });
        console.log('boatdat 105... ' +JSON.stringify(boatData));
        let parseData = JSON.parse(boatData);
        console.log('107 ' +JSON.stringify(parseData));
        parseData.forEach(d => {
            console.log('.... boats near me... ' +d.Name);
            this.mapMarkers.push({
                title: d.Name,
                location: {
                    Latitude: d.Geolocation__Latitude__s,
                    Longitude: d.Geolocation__Longitude__s
                },
                icon: ICON_STANDARD_USER
            });
        });
        this.isLoading = false;
    }
}