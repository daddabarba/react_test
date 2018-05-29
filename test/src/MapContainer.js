
import React, { Component } from 'react';
import ReactDOM from 'react-dom'

import axios from 'axios';

export default class MapContainer extends Component {

    constructor(props){
        super(props);

        this.state = {
            locations: [{location: "Esdoornlaan 248 9741kj"}]
        }
    }

    componentDidUpdate() {
        //this.getLocations();
        this.loadMap(); // call loadMap function to load the google map
    }

    getLocations= () => {

        var data = {};
        axios.post('http://127.0.0.1:5000/api/getAllLocations', data)
            .then(res => {
                console.log("Respose: " + res);
                this.setState({locations: res.data});
            })
            .catch(err => {console.log( err.toString())});
    };

    loadMap() {
        if (this.props && this.props.google) { // checks to make sure that props have been passed
            const {google} = this.props; // sets props equal to google
            const maps = google.maps; // sets maps to google maps props

            const mapRef = this.refs.map; // looks for HTML div ref 'map'. Returned in render below.
            const node = ReactDOM.findDOMNode(mapRef); // finds the 'map' div in the React DOM, names it node

            const mapConfig = Object.assign({}, {
                center: {lat: 53.219186, lng: 6.563099}, // sets center of google map to NYC.
                zoom: 11, // sets zoom. Lower numbers are zoomed further out.
                mapTypeId: 'roadmap' // optional main map layer. Terrain, satellite, hybrid or roadmap--if unspecified, defaults to roadmap.
            });

            this.map = new maps.Map(node, mapConfig); // creates a new Google map on the specified node (ref='map') with the specified configuration set above.

            var geocoder = new google.maps.Geocoder();

            if(this.state.locations){
                this.state.locations.forEach( location => { // iterate through locations saved in state
                    geocoder.geocode({address: location.location}, function (results, status) {
                        if (status === google.maps.GeocoderStatus.OK) {

                            //In this case it creates a marker, but you can get the lat and lng from the location.LatLng
                            var marker = new google.maps.Marker({
                                map: this.map,
                                position: results[0].geometry.location,
                                title: location.location
                            });
                        } else {
                            alert('Geocode was not successful for the following reason: ' + status);
                        }
                    });
                })
            }
        }
    }

    render() {
        const style = { // MUST specify dimensions of the Google map or it will not work. Also works best when style is specified inside the render function and created as an object
            width: '40vw', // 90vw basically means take up 90% of the width screen. px also works.
            height: '75vh', // 75vh similarly will take up roughly 75% of the height of the screen. px also works.
            float: 'right'
        };

        return ( // in our return function you must return a div with ref='map' and style.
            <div ref="map" style={style}>
                loading map...
            </div>
        )
    }
}