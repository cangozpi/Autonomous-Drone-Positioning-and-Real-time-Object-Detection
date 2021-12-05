from flask import Flask, render_template, Response
import cv2
import threading


outputFrame = None
lock = threading.Lock()

#Initialize the Flask app
app = Flask(__name__)

#camera = cv2.VideoCapture(0)
from imutils.video import VideoStream
vs = VideoStream(src=0).start()
import time
time.sleep(2.0)
'''
for ip camera use - rtsp://username:password@ip_address:554/user=username_password='password'_channel=channel_number_stream=0.sdp' 
for local webcam use cv2.VideoCapture(0)
'''

def gen_frames():  
    # grab global references to the output frame and lock variables
    global outputFrame, lock
        # loop over frames from the output stream
    while True:
        # wait until the lock is acquired
        with lock:
            # check if the output frame is available, otherwise skip
            # the iteration of the loop
            if outputFrame is None:
                continue
            # encode the frame in JPEG format
            (flag, encodedImage) = cv2.imencode(".jpg", outputFrame)
            if not flag:
                continue
            encodedImage = encodedImage.tobytes()
            yield (b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n' + encodedImage + b'\r\n')

   
        

def detect():
	# grab global references to the video stream, output frame, and
	# lock variables
    global camera, outputFrame, lock, vs
	
    # loop over frames from the video stream
    while True:
		# read the next frame from the video stream, resize it,
		# convert the frame to grayscale, and blur it
        success = True
        frame =vs.read()
        #success, frame = camera.read()
        if not success:
            break
        else:
            # acquire the lock, set the output frame, and release the
            # lock
            with lock:
                outputFrame = frame.copy()


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == '__main__':
	t = threading.Thread(target=detect)
	t.daemon = True
	t.start()
	# start the flask app
	app.run(debug=False, threaded=True, use_reloader=False)
