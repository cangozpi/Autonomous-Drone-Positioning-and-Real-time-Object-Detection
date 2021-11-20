package com.drone_backend.models;

import java.util.ArrayList;

public class MissionRequestModel {

    /* equivalent JSON body ->
    {
        "positions": [10, 10, 10, 50, 50, 20, 50, -50, 20, -50, -50, 20, 0, 0, 20],
        "linear_velocity":5,
        "angular_velocity":5
    }
    */

    private ArrayList<Integer> positions;
    private double linear_velocity;
    private double angular_velocity;

    public MissionRequestModel() {
        this.positions = new ArrayList<>();
        this. linear_velocity = 0;
        this.angular_velocity = 0;
    }

    public MissionRequestModel(ArrayList<Integer> positions, double linear_velocity, double angular_velocity) {
        this.positions = positions;
        this.linear_velocity = linear_velocity;
        this.angular_velocity = angular_velocity;
    }

    // getter and setters
    public ArrayList<Integer> getPositions() {
        return positions;
    }

    public void setPositions(ArrayList<Integer> positions) {
        this.positions = positions;
    }

    public double getLinear_velocity() {
        return linear_velocity;
    }

    public void setLinear_velocity(double linear_velocity) {
        this.linear_velocity = linear_velocity;
    }

    public double getAngular_velocity() {
        return angular_velocity;
    }

    public void setAngular_velocity(double angular_velocity) {
        this.angular_velocity = angular_velocity;
    }
}
