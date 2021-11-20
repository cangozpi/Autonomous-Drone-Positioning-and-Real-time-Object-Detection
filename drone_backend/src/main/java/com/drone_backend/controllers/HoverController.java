package com.drone_backend.controllers;

import com.drone_backend.models.HoverRequestModel;
import com.drone_backend.services.HoverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HoverController {
    @Autowired
    HoverService hoverService;

    @PostMapping("/uploadHover")
    @ResponseBody
    public boolean uploadMission(@RequestBody HoverRequestModel hoverRequest){
        return hoverService.uploadHoverService(hoverRequest.getPositions(), hoverRequest.getLinear_velocity(), hoverRequest.getAngular_velocity(), hoverRequest.getDuration());
    }

}
