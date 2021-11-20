import { Component } from '@angular/core';

//for form
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  
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
      angular_velocity: this.surveillanceForm.value.angularVelocity
    }

    //make POST request to server for /surveillanceUpload
    
  }

  onSubmitHover() {
    //convert positions form value to the desired array format
    let posArray:any = [];
    let pos:any = this.missionForm.value.positions.split(" ")
    for(let i = 0; i < pos.length; i++){
      posArray.push(pos[i]) 
    }
    
    // POST request body
    let hoverRequestTemplate = {
      positions: posArray,
      linear_velocity: this.hoverForm.value.linearVelocity,
      angular_velocity: this.hoverForm.value.angularVelocity
    }

    //make POST request to server for /hoverUpload

  }

  // Sample mission
//   {
//     "positions": [10, 10, 10, 50, 50, 20, 50, -50, 20, -50, -50, 20, 0, 0, 20],
//     "linear_velocity":5,
//     "angular_velocity":5
// }


}
