package com.drone_backend.controllers;

import com.drone_backend.models.armDroneModel;
import com.drone_backend.services.ArmDroneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class ArmDroneController {

    @Autowired
    ArmDroneService armDroneService;

    // sample test run ->
    @CrossOrigin(origins = "http://localhost:4200")
    @PostMapping("/armDrone")
    @ResponseBody
    public boolean armDrone(@RequestBody armDroneModel armDroneRequest){
        return armDroneService.armDrone(armDroneRequest.getArm_status());
    }


}
