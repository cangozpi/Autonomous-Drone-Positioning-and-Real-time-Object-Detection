package com.drone_backend.controllers;

import com.drone_backend.models.MissionRequestModel;
import com.drone_backend.services.MissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
public class MissionController {

    @Autowired
    MissionService missionService;

    // sample test run ->
    // curl -i -X POST -H 'Content-Type: application/json' -d '{ "positions": [10, 10, 10, 50, 50, 20, 50, -50, 20, -50, -50, 20, 0, 0, 20], "linear_velocity":5, "angular_velocity":5 }' localhost:8080/uploadMission
    @PostMapping("/uploadMission")
    @ResponseBody
    public boolean uploadMission(@RequestBody MissionRequestModel missionRequest){
        return missionService.uploadMissionService(missionRequest.getPositions(), missionRequest.getLinear_velocity(), missionRequest.getAngular_velocity());
    }

    @GetMapping("/test")
    @ResponseBody
    public String testPath(){
        return "hello";
    }
}
