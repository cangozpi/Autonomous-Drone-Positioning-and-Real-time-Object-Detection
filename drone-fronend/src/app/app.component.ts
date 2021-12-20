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

      this.markMap(); // puts marker on the map
    });

  }

  markMap():void{
    // The marker, positioned at Uluru
    const uluru = { lat: -25.344, lng: 131.036 };

    const marker = new google.maps.Marker({
      position: uluru,
      map: this.map,
      title: "Hello World"
    });

    //marker.setMap(this.map);
    console.log("Sorry")
  }


  // Google Maps code ends here

}


