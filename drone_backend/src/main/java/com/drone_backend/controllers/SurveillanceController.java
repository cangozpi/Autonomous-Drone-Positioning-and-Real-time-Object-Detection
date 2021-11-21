package com.drone_backend.controllers;

import com.drone_backend.models.SurveillanceRequestModel;
import com.drone_backend.services.SurveillanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class SurveillanceController {

    @Autowired
    SurveillanceService surveillanceService;


    @CrossOrigin(origins = "http://localhost:4200")
    @PostMapping("/uploadSurveillance")
    @ResponseBody
    public boolean uploadMission(@RequestBody SurveillanceRequestModel surveillanceRequest){
        return surveillanceService.uploadSurveillanceService(surveillanceRequest.getPositions(),
                surveillanceRequest.getLinear_velocity(), surveillanceRequest.getAngular_velocity(),
                surveillanceRequest.getTour_num());
    }

}
