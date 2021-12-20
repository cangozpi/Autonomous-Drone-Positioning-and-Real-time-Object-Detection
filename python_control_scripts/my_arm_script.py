#!/usr/bin/env python

import rospy
import mavros
from geometry_msgs.msg import PoseStamped, Twist, Vector3
from mavros_msgs.msg import State, ParamValue
from mavros_msgs.srv import CommandBool, SetMode, ParamSet
#import math
import numpy as np
import argparse



class CustomController:

    def __init__(self):
        mavros.set_namespace()

        rospy.init_node('offb_node', anonymous=True)

        self.freq = 20 # in Hz
        self.rate = rospy.Rate(self.freq) # MUST be more then 2Hz

        self.current_state = State()
        self.local_position = PoseStamped()
        self.initial_pos_acquired = False
        self.initial_position = PoseStamped()
        #Determines if a setpoint location is assumed to be reached if drone is withing this distance
        self.arrive_offset = 1 # in meters

    
    def position_control(self, arm_status):
        self.armDrone(arm_status) # arm the drone before takeoff


    def state_cb(self, state):
        """
        callback function for the 'State' topic subscriber
        """
        self.current_state = state


    def local_position_pose_callback(self, data):
        self.local_position = data
        if not self.initial_pos_acquired:
            self.initial_position = data
            self.initial_pos_acquired = True


    def armDrone(self, arm_status):
        """
        Tries to arm the drone
        """
        arm_status = bool(arm_status)
        rospy.loginfo("drone arming status: " + str(arm_status))
        if self.current_state.armed != arm_status:
            res = self.arming_client(arm_status)
            if not res.success:
                rospy.logerr("failed to send arm command")
            else:
                rospy.loginfo("successfully arming status set to: " + str(arm_status))

    def disarmDrone(self):
        """
        Tries to arm the drone
        """
        rospy.loginfo("disarming the drone")
        if not self.current_state.armed:
            res = self.arming_client(False)
            if not res.success:
                rospy.logerr("failed to send disarm command")
            else:
                rospy.loginfo("drone successfully disarmed")


    # makes sure to connect to services before hand
    def checkForServices(self):
        """
        Tries to initialize the services
        """
        service_timeout = 30
        rospy.loginfo("waiting for ROS services")
        try:
            #rospy.wait_for_service('mavros/param/get', service_timeout)
            #rospy.wait_for_service('mavros/param/set', service_timeout)
            #rospy.wait_for_service('mavros/mission/push', service_timeout)
            #rospy.wait_for_service('mavros/mission/clear', service_timeout)
            rospy.wait_for_service('mavros/cmd/arming', service_timeout)
            rospy.wait_for_service('mavros/set_mode', service_timeout)
            rospy.wait_for_service('mavros/param/set', service_timeout)
            self.arming_client = rospy.ServiceProxy('mavros/cmd/arming', CommandBool) # mavros/cmd/arming
            self.set_mode_client = rospy.ServiceProxy('mavros/set_mode', SetMode) # mavros/set_mode
            self.set_param_srv = rospy.ServiceProxy('mavros/param/set', ParamSet)
        except rospy.ROSException:
            rospy.logerr("failed to connect to services")
        rospy.loginfo("ROS services are up")
        rospy.loginfo("successfully connected to the ROS services.")


    # makes sure to connect to topics before hand
    def checkForTopics(self):
        """
        Tries to initialize the Subscribers/Publishers
        """
        try:
            self.local_pos_pub = rospy.Publisher('mavros/setpoint_position/local', PoseStamped, queue_size=10)
            self.vel_pub = rospy.Publisher('mavros/setpoint_velocity/cmd_vel_unstamped', Twist, queue_size=10)
            self.state_sub = rospy.Subscriber(mavros.get_topic('state'), State, self.state_cb)
            self.local_pos_sub = rospy.Subscriber('mavros/local_position/pose', PoseStamped, self.local_position_pose_callback)
        except rospy.ROSException:
            rospy.logerr("failed to initialize Publishers/Subscribers")

    def checkForFCU(self):
        """
        Tries to establish a FCU connection
        """
        # wait for FCU connection
        rospy.loginfo("waiting for FCU connection")
        while not self.current_state.connected:
            self.rate.sleep()
        rospy.loginfo("FCU connection established")

#=========================================================

def parsePositions():
    """
    Parses position arguments passed in as command line arguments with --positions flag.
    e.g. --positions x1 y1 z1 x2 y2 z2 ... xn yn zn ; where x,y,z are floats

    Sample call:
        $python2.7 my_mission_script.py --positions 10 10 10 --linear_velocity 5 --angular_velocity 5 --duration 3
    this flies drone to coordinate [(10.0, 10.0, 10.0)] in OFFBOARD mode
    with linear velocity of 5 and angular velocity of 5 and holds it there for 3 seconds, then returns and lands to initial take off position.

    """
    CLI=argparse.ArgumentParser()

    CLI.add_argument( # 0 to disarm, 1 to arm
    "--arm_status",  # name on the CLI - drop the `--` for positional/required parameters
    type=int,
    required=True,
    )

    args = CLI.parse_args()
    

    return args.arm_status

#=========================================================

if __name__ == '__main__':
    """
    Sample call:
        $python2.7 my_arm_script.py --arm_status 0 # to disarm the drone
        $python2.7 my_arm_script.py --arm_status 1 # to arm the drone
    """
    try:
        arm_status = parsePositions()
        customController = CustomController()
        customController.checkForServices()
        customController.checkForTopics()
        customController.checkForFCU()
        customController.position_control(arm_status)
    except rospy.ROSInterruptException:
        rospy.logerr("Something went wrong!")
        pass
