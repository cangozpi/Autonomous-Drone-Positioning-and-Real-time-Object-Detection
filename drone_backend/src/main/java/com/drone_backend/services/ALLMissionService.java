package com.drone_backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.file.FileSystems;
import java.nio.file.Path;
import java.util.ArrayList;

@Service
public class ALLMissionService {

    @Autowired
    CommandLineService commandLineService;

    public boolean uploadALLMissionService(ArrayList<Double> positions, double altitude, double linearVelocity,
                                     double angularVelocity){
        // Create the command string
        Path currentPath = FileSystems.getDefault().getPath(".").toAbsolutePath();
        String scriptPath = currentPath.toString().substring(0, currentPath.toString().length()-15);
        scriptPath += "python_control_scripts";
        scriptPath += "/my_LLAmission_script.py";
        String cmdStr = "python2.7 " + scriptPath;
        // add --positions args
        String posStr = " --positions";
        for(int i = 0; i < positions.size(); i++){ //note that order of position elements matters
            posStr += " " + String.valueOf(positions.get(i));
        }
        //add --altitude arg
        String altStr = " --altitude";
        altStr += " " + String.valueOf(altitude);;
        //add --linear_velocity args
        String linVelStr = " --linear_velocity";
        linVelStr += " " + String.valueOf(linearVelocity);
        //add --angular_velocity args
        String angVelStr = " --angular_velocity";
        angVelStr += " " + String.valueOf(angularVelocity);

        cmdStr += posStr + altStr + linVelStr + angVelStr;

        // Call the script from the command line
        return commandLineService.runOnCommandLine(cmdStr);
    }
}
