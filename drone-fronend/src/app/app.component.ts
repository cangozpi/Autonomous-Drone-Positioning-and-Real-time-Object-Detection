import { Component, OnInit } from '@angular/core';


//For form
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

// For Google Maps
import { Loader } from "@googlemaps/js-api-loader"
import { GlobalPositionStrategy } from '@angular/cdk/overlay';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  constructor(private http: HttpClient) {}
  


  missionFormALL = new FormGroup({
    positions: new FormControl(''),
    altitude: new FormControl(''),
    linearVelocity: new FormControl(''),
    angularVelocity: new FormControl(''),
    
  });

  surveillanceFormALL = new FormGroup({
    positions: new FormControl(''),
    altitude: new FormControl(''),
    linearVelocity: new FormControl(''),
    angularVelocity: new FormControl(''),
    numTour: new FormControl(''),
  });

  hoverFormALL = new FormGroup({
    positions: new FormControl(''),
    altitude: new FormControl(''),
    linearVelocity: new FormControl(''),
    angularVelocity: new FormControl(''),
    duration: new FormControl(''),
  });

  missionFormNED = new FormGroup({
    positions: new FormControl(''),
    linearVelocity: new FormControl(''),
    angularVelocity: new FormControl(''),
  });

  surveillanceFormNED = new FormGroup({
    positions: new FormControl(''),
    linearVelocity: new FormControl(''),
    angularVelocity: new FormControl(''),
    numTour: new FormControl(''),
  });

  hoverFormNED = new FormGroup({
    positions: new FormControl(''),
    linearVelocity: new FormControl(''),
    angularVelocity: new FormControl(''),
    duration: new FormControl(''),
  });



  onSubmitMissionALL() {
    //convert positions form value to the desired array format
    let posArray:any = [];
    let pos:any = this.missionFormALL.value.positions.split(" ")
    for(let i = 0; i < pos.length; i++){
      posArray.push(pos[i]) 
    }
    
    // POST request body
    let missionRequestTemplate = {
      positions: posArray,
      altitude: this.missionFormALL.value.altitude,
      linear_velocity: this.missionFormALL.value.linearVelocity,
      angular_velocity: this.missionFormALL.value.angularVelocity
    }
    
    //make POST request to server for /missionUpload
    let url = "http://localhost:8080/uploadALLMission"; //TODO: change localhost 
    this.http.post(url, missionRequestTemplate).toPromise().then((data:any) => {
      console.log(data)
    })

  }

  onSubmitSurveillanceALL() {
     //convert positions form value to the desired array format
    let posArray:any = [];
    let pos:any = this.surveillanceFormALL.value.positions.split(" ")
    for(let i = 0; i < pos.length; i++){
      posArray.push(pos[i]) 
    }
    
    // POST request body
    let surveillanceRequestTemplate = {
      positions: posArray,
      altitude: this.missionFormALL.value.altitude,
      linear_velocity: this.surveillanceFormALL.value.linearVelocity,
      angular_velocity: this.surveillanceFormALL.value.angularVelocity,
      tour_num: this.surveillanceFormALL.value.numTour
    }
    
    //make POST request to server for /surveillanceUpload
    let url = "http://localhost:8080/uploadALLSurveillance"; //TODO: change localhost 
    this.http.post(url, surveillanceRequestTemplate).toPromise().then((data:any) => {
      console.log(data)
    })
  }

  onSubmitHoverALL() {
    //convert positions form value to the desired array format
    let posArray:any = [];
    let pos:any = this.hoverFormALL.value.positions.split(" ")
    for(let i = 0; i < pos.length; i++){
      posArray.push(pos[i]) 
    }
    
    // POST request body
    let hoverRequestTemplate = {
      positions: posArray,
      altitude: this.missionFormALL.value.altitude,
      linear_velocity: this.hoverFormALL.value.linearVelocity,
      angular_velocity: this.hoverFormALL.value.angularVelocity,
      duration: this.hoverFormALL.value.duration
    }
    
    //make POST request to server for /hoverUpload
    let url = "http://localhost:8080/uploadALLHover"; //TODO: change localhost 
    this.http.post(url, hoverRequestTemplate).toPromise().then((data:any) => {
      console.log(data)
    })
  }



  onSubmitMissionNED() {
    //convert positions form value to the desired array format
    let posArray:any = [];
    let pos:any = this.missionFormNED.value.positions.split(" ")
    for(let i = 0; i < pos.length; i++){
      posArray.push(pos[i]) 
    }
    
    // POST request body
    let missionRequestTemplate = {
      positions: posArray,
      linear_velocity: this.missionFormNED.value.linearVelocity,
      angular_velocity: this.missionFormNED.value.angularVelocity
    }
    
    //make POST request to server for /missionUpload
    let url = "http://localhost:8080/uploadMission"; //TODO: change localhost 
    this.http.post(url, missionRequestTemplate).toPromise().then((data:any) => {
      console.log(data)
    })

  }

  onSubmitSurveillanceNED() {
     //convert positions form value to the desired array format
    let posArray:any = [];
    let pos:any = this.surveillanceFormNED.value.positions.split(" ")
    for(let i = 0; i < pos.length; i++){
      posArray.push(pos[i]) 
    }
    
    // POST request body
    let surveillanceRequestTemplate = {
      positions: posArray,
      linear_velocity: this.surveillanceFormNED.value.linearVelocity,
      angular_velocity: this.surveillanceFormNED.value.angularVelocity,
      tour_num: this.surveillanceFormNED.value.numTour
    }
    
    //make POST request to server for /surveillanceUpload
    let url = "http://localhost:8080/uploadSurveillance"; //TODO: change localhost 
    this.http.post(url, surveillanceRequestTemplate).toPromise().then((data:any) => {
      console.log(data)
    })
  }

  onSubmitHoverNED() {
    //convert positions form value to the desired array format
    let posArray:any = [];
    let pos:any = this.hoverFormNED.value.positions.split(" ")
    for(let i = 0; i < pos.length; i++){
      posArray.push(pos[i]) 
    }
    
    // POST request body
    let hoverRequestTemplate = {
      positions: posArray,
      linear_velocity: this.hoverFormNED.value.linearVelocity,
      angular_velocity: this.hoverFormNED.value.angularVelocity,
      duration: this.hoverFormNED.value.duration
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
  public missionDisabled: boolean = false;
  public surveillanceDisabled: boolean = false;
  public hoverDisabled: boolean = false;
  public selectedMissionType: String = ""

  ngOnInit(): void {
    
    const loader = new Loader({
      apiKey: "",
      version: "weekly",
      
    });
    loader.load().then(() => {
      this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        center: { lat: -25.344, lng: 131.036 },
        zoom: 19,
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

    // check for disabling upload mission select choices
    this.checkMissionUploadDisable();
  }


  // function to set disable property of misison upload select option
  checkMissionUploadDisable():void {
    if (this.markers.length < 1){
      this.missionDisabled = true;
      this.surveillanceDisabled = true;
      this.hoverDisabled = true;
    }else if(this.markers.length >1){
      this.missionDisabled = false;
      this.surveillanceDisabled = false;
      this.hoverDisabled = true;
    }else{
      this.missionDisabled = false;
      this.surveillanceDisabled = false;
      this.hoverDisabled = false;
    }
  }

  // cb function, hides or shows the given marker on the given map
  setMapOnAll(map: google.maps.Map | null):void {
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
    // check for disabling upload mission select choices
    this.checkMissionUploadDisable();
  }

  // Shows any markers currently in the array.
  showMarkers(): void {
    this.setMapOnAll(this.map);
  }

  // Removes the markers from the map, but keeps them in the array.
  hideMarkers(): void {
    this.setMapOnAll(null);
  }

  // Deletes all markers in the array by removing references to them.
  deleteMarkers(): void {
    this.hideMarkers();
    this.markers = [];
    // check for disabling upload mission select choices
    this.checkMissionUploadDisable();
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

  // Google Maps form functions below

  // transfer waypoints from Google Map marks to Custom Mission Accordion menu waypoint form input
  uploadWaypointsToMission():void{
    // transfer waypoints according to the select menu's value
    if(this.selectedMissionType == "missionMode"){
      let posStr:String = ""
      this.markers.forEach((m => {
        const cur_lat = m.getPosition()?.lat();
        const cur_lng = m.getPosition()?.lng();
        
        posStr += `${cur_lat} ${cur_lng} `
      }))
      posStr = posStr.substring(0, posStr.length-1);
      this.missionFormALL.patchValue({
        positions: posStr
      })
    }else if(this.selectedMissionType == "surveillanceMode"){
      let posStr:String = ""
      this.markers.forEach((m => {
        const cur_lat = m.getPosition()?.lat();
        const cur_lng = m.getPosition()?.lng();
        
        posStr += `${cur_lat} ${cur_lng} `
      }))
      this.surveillanceFormALL.patchValue({
        positions: posStr
      })
    }else if(this.selectedMissionType == "hoverMode"){
      let posStr:String = ""
      this.markers.forEach((m => {
        const cur_lat = m.getPosition()?.lat();
        const cur_lng = m.getPosition()?.lng();
        
        posStr += `${cur_lat} ${cur_lng} `
      }))
      this.hoverFormALL.patchValue({
        positions: posStr
      })
    }
  }

  // Google Maps code ends here

}


