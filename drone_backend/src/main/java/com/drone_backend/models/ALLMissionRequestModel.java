package com.drone_backend.models;

import java.util.ArrayList;

public class ALLMissionRequestModel {

    /* equivalent JSON body ->
    {
        "positions": [latitude1 longitude1 lat2 lng2 ...],
        altitude: 15.0
        "linear_velocity":5,
        "angular_velocity":5
    }
    */

    private ArrayList<Double> positions;
    private double altitude;
    private double linear_velocity;
    private double angular_velocity;

    public ALLMissionRequestModel() {
        this.positions = new ArrayList<>();
        this.altitude = 0;
        this. linear_velocity = 0;
        this.angular_velocity = 0;
    }

    public ALLMissionRequestModel(ArrayList<Double> positions, double altitude,double linear_velocity, double angular_velocity) {
        this.positions = positions;
        this.altitude = altitude;
        this.linear_velocity = linear_velocity;
        this.angular_velocity = angular_velocity;
    }

    // getter and setters
    public ArrayList<Double> getPositions() {
        return positions;
    }

    public void setPositions(ArrayList<Double> positions) {
        this.positions = positions;
    }

    public double getAltitude() {
        return altitude;
    }

    public void setAltitude(double altitude) {
        this.altitude = altitude;
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
