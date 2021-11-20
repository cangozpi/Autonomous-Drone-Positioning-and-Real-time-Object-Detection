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


    def setModeOFFBoard(self):
        """
        Tries to set Flight Mode to OFFBOARD mode
        NOTE: Before entering Offboard mode, you must have already started streaming setpoints. Otherwise the mode switch will be rejected.
        """
        # exempting failsafe from lost RC to allow offboard
        param_id = "COM_RCL_EXCEPT"
        param_value = ParamValue(1<<2, 0.0)
        res = self.set_param_srv(param_id, param_value)
        if not res.success:
            rospy.logerr("failure during setting param in setModeOFFBoard")

        # set the flight mode
        rospy.loginfo("setting FCU mode: {0}".format("OFFBOARD"))
        if self.current_state.mode != "OFFBOARD" : # set flight mode to 'OFFBOARD'
            res = self.set_mode_client(base_mode=0, custom_mode="OFFBOARD")
            if not res.mode_sent:
                rospy.logerr("failed to send mode command")
            else:
                rospy.loginfo("successfully set Flight Mode to OFFBOARD")


    def setLandMode(self):
        """
        Tries to set Flight Mode to OFFBOARD mode
        NOTE: Before entering Offboard mode, you must have already started streaming setpoints. Otherwise the mode switch will be rejected.
        """
        # set the flight mode
        rospy.loginfo("setting FCU mode: {0}".format("AUTO.LAND"))
        if self.current_state.mode != "AUTO.LAND" : # set flight mode to 'OFFBOARD'
            res = self.set_mode_client(base_mode=0, custom_mode="AUTO.LAND")
            if not res.mode_sent:
                rospy.logerr("failed to send mode command")
            else:
                rospy.loginfo("successfully set Flight Mode to AUTO.LAND")


    def armDrone(self):
        """
        Tries to arm the drone
        """
        rospy.loginfo("arming the drone")
        if not self.current_state.armed:
            res = self.arming_client(True)
            if not res.success:
                rospy.logerr("failed to send arm command")
            else:
                rospy.loginfo("drone successfully armed")

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


    def is_at_position(self, x, y, z, offset):
        """
        checks if drone(self.local_position) is at the given x, y, x coordinate
        NOTE: offset: meters
        """

        desired = np.array((x, y, z))
        pos = np.array((self.local_position.pose.position.x,
                        self.local_position.pose.position.y,
                        self.local_position.pose.position.z))
        return np.linalg.norm(desired - pos) < offset


    def reach_position(self, x, y, z, vel_lin, vel_ang):
        """
        commands drone to reach the given x, y, z coordinates
        """
        # set a position setpoint
        pose = PoseStamped()
        # std_msgs/Header header
        pose.header.stamp = rospy.Time.now()
        # geometry_msgs/Pose pose
        pose.pose.position.x = x
        pose.pose.position.y = y
        pose.pose.position.z = z

        # create local_position_velocity message to be published
        vel = Twist()
        vel.linear = Vector3(vel_lin, vel_lin, vel_lin)
        vel.angular = Vector3(vel_ang, vel_ang, vel_ang)

        # uncomment if you want to lock yaw/heading to north.
        # yaw_degrees = 0  # North
        # yaw = math.radians(yaw_degrees)
        # quaternion = quaternion_from_euler(0, 0, yaw)
        # pose.pose.orientation = Quaternion(*quaternion)


        while not rospy.is_shutdown(): # wait for drone to reach the desired setpoint position
            self.local_pos_pub.publish(pose)#publish position
            self.vel_pub.publish(vel)#publish velocity
            if self.is_at_position(pose.pose.position.x,
                                   pose.pose.position.y,
                                   pose.pose.position.z,
                                   self.arrive_offset):
                break
            self.rate.sleep() # rate must be higher than 2Hz or else OFFBOARD will be aborted



    def position_control(self, positions, vel_lin, vel_ang, duration):
        prev_state = self.current_state

        # NOTE: Before entering Offboard mode, you must have already started streaming setpoints. Otherwise the mode switch will be rejected.
        # send a few setpoints before starting
        for i in range(100):
            self.local_pos_pub.publish(self.local_position)
            self.rate.sleep()
        self.setModeOFFBoard() # set Flight mode to OFFBOARD

        self.armDrone() # arm the drone before takeoff

        while not rospy.is_shutdown():#TODO: get rid of this while loop we only want to traverse wp's once!

            # log changes in the arm status & flight mode status
            if prev_state.armed != self.current_state.armed:
                rospy.loginfo("Vehicle armed: %r" % self.current_state.armed)
            if prev_state.mode != self.current_state.mode:
                rospy.loginfo("Current mode: %s" % self.current_state.mode)
            prev_state = self.current_state


            # check if the drone is armed and in OFFBOARD flight mode before flying to setpoints
            if self.current_state.armed and self.current_state.mode == "OFFBOARD":
                # set out to reach waypoints one by one in order
                for i in range(len(positions)):
                    rospy.loginfo(
                        "attempting to reach position | x: {0}, y: {1}, z: {2} | current position x: {3:.2f}, y: {4:.2f}, z: {5:.2f} | linear speed: {6:.2f}, angular speed: {7:.2f} ".
                        format(positions[i][0], positions[i][1], positions[i][2],
                            self.local_position.pose.position.x,
                            self.local_position.pose.position.y,
                            self.local_position.pose.position.z,
                            vel_lin,
                            vel_ang))
                    self.reach_position(positions[i][0], positions[i][1], positions[i][2], vel_lin, vel_ang) # reach the hovering position
                    rospy.loginfo("target position reached. Starting to hold position for "+ str(duration)+ " seconds.")
                    for t in range(duration * self.freq): # hover in position for duration many times after reaching the position
                        self.reach_position(positions[i][0], positions[i][1], positions[i][2], vel_lin, vel_ang)
                        self.rate.sleep()
                    rospy.loginfo("returning to initial take off position for landing")
                    rospy.loginfo(
                        "attempting to reach position | x: {0}, y: {1}, z: {2} | current position x: {3:.2f}, y: {4:.2f}, z: {5:.2f} | linear speed: {6:.2f}, angular speed: {7:.2f} ".
                        format(self.initial_position.pose.position.x,
                            self.initial_position.pose.position.y,
                            self.initial_position.pose.position.z,
                            self.local_position.pose.position.x,
                            self.local_position.pose.position.y,
                            self.local_position.pose.position.z,
                            vel_lin,
                            vel_ang))
                    self.reach_position(self.initial_position.pose.position.x, self.initial_position.pose.position.y, self.initial_position.pose.position.z, vel_lin, vel_ang)#return to initial take off position
                # land the drone
                self.setLandMode()
                # disarm the drone
                self.disarmDrone()
                break
            self.rate.sleep()


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
    CLI.add_argument(
    "--positions",  # name on the CLI - drop the `--` for positional/required parameters
    nargs="*",  # 0 or more values expected => creates a list
    type=float,
    default=[],  # default if nothing is provided,
    required=True,
    )

    CLI.add_argument(
    "--linear_velocity",  # name on the CLI - drop the `--` for positional/required parameters
    type=float,
    required=True
    )

    CLI.add_argument(
    "--angular_velocity",  # name on the CLI - drop the `--` for positional/required parameters
    type=float,
    required=True,
    )

    CLI.add_argument(
    "--duration",  # name on the CLI - drop the `--` for positional/required parameters
    type=int,
    required=True,
    )

    args = CLI.parse_args()
    positions = args.positions
    if len(positions) > 0 and len(positions)%3 == 0:
        pos = []
        for i in range(0,len(positions)-2, 3):
            x = positions[i]
            y = positions[i+1]
            z = positions[i+2]
            pos.append((x,y,z))

    else:
        print("terminating the script. Couldn't parse command line arguments")
        exit()

    return pos, args.linear_velocity, args.angular_velocity, args.duration

#=========================================================

if __name__ == '__main__':
    """
    Sample call:
        $python2.7 my_hover_script.py --positions 10 10 10 --linear_velocity 5 --angular_velocity 5 --duration 3

    this flies drone to coordinate [(10.0, 10.0, 10.0)] in OFFBOARD mode
    with linear velocity of 5 and angular velocity of 5 and holds it there for 3 seconds, then returns and lands to initial take off position.
    """
    try:
        positions, vel_lin, vel_ang, duration = parsePositions()
        customController = CustomController()
        customController.checkForServices()
        customController.checkForTopics()
        customController.checkForFCU()
        customController.position_control(positions, vel_lin, vel_ang, duration)
    except rospy.ROSInterruptException:
        rospy.logerr("Something went wrong!")
        pass
