package com.drone_backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.file.FileSystems;
import java.nio.file.Path;

@Service
public class ArmDroneService {

    @Autowired
    CommandLineService commandLineService;

    public boolean armDrone(int armStatus){
        // Create the command string
        Path currentPath = FileSystems.getDefault().getPath(".").toAbsolutePath();
        String scriptPath = currentPath.toString().substring(0, currentPath.toString().length()-15);
        scriptPath += "python_control_scripts";
        scriptPath += "/my_arm_script.py";
        String cmdStr = "python2.7 " + scriptPath;
        // add --arm_status arg
        String armStatusStr = " --arm_status";
        armStatusStr += " " + String.valueOf(armStatus);

        cmdStr += armStatusStr;

        // Call the script from the command line
        return commandLineService.runOnCommandLine(cmdStr);
    }
}
