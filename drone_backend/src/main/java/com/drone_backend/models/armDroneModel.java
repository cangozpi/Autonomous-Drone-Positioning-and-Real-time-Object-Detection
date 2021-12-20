package com.drone_backend.models;

public class armDroneModel {

    private int arm_status;

    public armDroneModel(){

    }

    public armDroneModel(int arm_status) {
        this.arm_status = arm_status;
    }

    public int getArm_status() {
        return arm_status;
    }

    public void setArm_status(int arm_status) {
        this.arm_status = arm_status;
    }
}
