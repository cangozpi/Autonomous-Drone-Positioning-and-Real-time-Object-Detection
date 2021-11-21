package com.drone_backend.controllers;

import com.drone_backend.models.HoverRequestModel;
import com.drone_backend.services.HoverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class HoverController {
    @Autowired
    HoverService hoverService;

    @CrossOrigin(origins = "http://localhost:4200")
    @PostMapping("/uploadHover")
    @ResponseBody
    public boolean uploadMission(@RequestBody HoverRequestModel hoverRequest){
        return hoverService.uploadHoverService(hoverRequest.getPositions(), hoverRequest.getLinear_velocity(), hoverRequest.getAngular_velocity(), hoverRequest.getDuration());
    }

}
