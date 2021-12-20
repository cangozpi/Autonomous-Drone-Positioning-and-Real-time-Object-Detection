import { Component, OnInit } from '@angular/core';


//For form
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

// For Google Maps
import { Loader } from "@googlemaps/js-api-loader"


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  constructor(private http: HttpClient) {}
  
  missionForm = new FormGroup({
    positions: new FormControl(''),
    linearVelocity: new FormControl(''),
    angularVelocity: new FormControl(''),
  });

  surveillanceForm = new FormGroup({
    positions: new FormControl(''),
    linearVelocity: new FormControl(''),
    angularVelocity: new FormControl(''),
    numTour: new FormControl(''),
  });

  hoverForm = new FormGroup({
    positions: new FormControl(''),
    linearVelocity: new FormControl(''),
    angularVelocity: new FormControl(''),
    duration: new FormControl(''),
  });

  onSubmitMission() {
    //convert positions form value to the desired array format
    let posArray:any = [];
    let pos:any = this.missionForm.value.positions.split(" ")
    for(let i = 0; i < pos.length; i++){
      posArray.push(pos[i]) 
    }
    
    // POST request body
    let missionRequestTemplate = {
      positions: posArray,
      linear_velocity: this.missionForm.value.linearVelocity,
      angular_velocity: this.missionForm.value.angularVelocity
    }
    
    //make POST request to server for /missionUpload
    let url = "http://localhost:8080/uploadMission"; //TODO: change localhost 
    this.http.post(url, missionRequestTemplate).toPromise().then((data:any) => {
      console.log(data)
    })

  }

  onSubmitSurveillance() {
     //convert positions form value to the desired array format
    let posArray:any = [];
    let pos:any = this.surveillanceForm.value.positions.split(" ")
    for(let i = 0; i < pos.length; i++){
      posArray.push(pos[i]) 
    }
    
    // POST request body
    let surveillanceRequestTemplate = {
      positions: posArray,
      linear_velocity: this.surveillanceForm.value.linearVelocity,
      angular_velocity: this.surveillanceForm.value.angularVelocity,
      tour_num: this.surveillanceForm.value.numTour
    }
    
    //make POST request to server for /surveillanceUpload
    let url = "http://localhost:8080/uploadSurveillance"; //TODO: change localhost 
    this.http.post(url, surveillanceRequestTemplate).toPromise().then((data:any) => {
      console.log(data)
    })
  }

  onSubmitHover() {
    //convert positions form value to the desired array format
    let posArray:any = [];
    let pos:any = this.hoverForm.value.positions.split(" ")
    for(let i = 0; i < pos.length; i++){
      posArray.push(pos[i]) 
    }
    
    // POST request body
    let hoverRequestTemplate = {
      positions: posArray,
      linear_velocity: this.hoverForm.value.linearVelocity,
      angular_velocity: this.hoverForm.value.angularVelocity,
      duration: this.hoverForm.value.duration
    }
    
    //make POST request to server for /hoverUpload
    let url = "http://localhost:8080/uploadHover"; //TODO: change localhost 
    this.http.post(url, hoverRequestTemplate).toPromise().then((data:any) => {
      console.log(data)
    })
  }

  onSubmitArmDrone(arm_status:number) {
    
    // POST request body
    let armStatusTemplate = {
      arm_status: arm_status,
    }
    
    //make POST request to server for /missionUpload
    let url = "http://localhost:8080/armDrone"; //TODO: change localhost 
    this.http.post(url, armStatusTemplate).toPromise().then((data:any) => {
      console.log(data)
    })

  }

  // Google Maps code starts here

  public map:any
  public infoWindow:any
  public markers: google.maps.Marker[] = []; // holds the markers placed on the Google Map

  ngOnInit(): void {
    
    const loader = new Loader({
      apiKey: "",
      version: "weekly",
      
    });
    loader.load().then(() => {
      this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        center: { lat: -25.344, lng: 131.036 },
        zoom: 8,
      });

      this.infoWindow = new google.maps.InfoWindow();

      this.centerMapToCurrentPosition(); // automatically center the map on the user geolocation

      // read for click DOM events on the Google Map to add markers using callback
      this.map.addListener("click", (e:any) => {
        this.placeMarkerAndPanTo(e.latLng, this.map);
      });

    });

    
  }



  // callback function that draws markers on the clicked position
  placeMarkerAndPanTo(latLng: google.maps.LatLng, map: google.maps.Map):void {
    // put the marker on the map
    const marker = new google.maps.Marker({
      position: latLng,
      map: map,
      label: `${this.markers.length + 1}`, // number each marker
      draggable: true,
    });

    // center the map wrt marker
    map.panTo(latLng);

    // add newly added marker to the array
    this.markers.push(marker);
  }


  // cb function, hides or shows the given marker on the given map
  setMapOnAll(map: google.maps.Map | null):void {
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  }

  // Shows any markers currently in the array.
  showMarkers(): void {
    this.setMapOnAll(this.map);
    this.markers.forEach((m => {
      console.log(m.getPosition()?.lat())
      console.log(m.getPosition()?.lng())
      console.log(m.getPosition()?.toJSON())
    }))
  }

  // Removes the markers from the map, but keeps them in the array.
  hideMarkers(): void {
    this.setMapOnAll(null);
  }

  // Deletes all markers in the array by removing references to them.
  deleteMarkers(): void {
    this.hideMarkers();
    this.markers = [];
  }


  // centers map to the users geolocation
  centerMapToCurrentPosition():void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          this.infoWindow.setPosition(pos);
          this.infoWindow.setContent("Location found.");
          this.infoWindow.open(this.map);
          this.map.setCenter(pos);
        },
        () => {
          this.handleLocationError(true, this.infoWindow, this.map.getCenter()!);
        }
      );
    } else {
      // Browser doesn't support Geolocation
      this.handleLocationError(false, this.infoWindow, this.map.getCenter()!);
    }
  }

  // handles centerMapToCurrentPosition function's errors
  handleLocationError(
    browserHasGeolocation: boolean,
    infoWindow: google.maps.InfoWindow,
    pos: google.maps.LatLng
  ):void {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(this.map);
  }


  // Google Maps code ends here

}


