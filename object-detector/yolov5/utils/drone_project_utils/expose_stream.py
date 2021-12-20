"""
Sample Call $python3.8 expose_stream.py --source 0 --droneLiveStream 
can@can-ubuntu-18:~/drone_project/object-detector/yolov5/utils/drone_project_uls$ python3.8 expose_stream.py --source 0 --droneLiveStream --weight ../../best.pt

"""
from flask import Flask, render_template, Response
import cv2
import threading

# -- import detect.py from upper directory
import sys
from pathlib import Path

sys.path.append(str(Path('.').absolute().parent.parent))
from detect import *
# -- end


#Initialize the Flask app
app = Flask(__name__)

'''
for ip camera use - rtsp://username:password@ip_address:554/user=username_password='password'_channel=channel_number_stream=0.sdp' 
for local webcam use cv2.VideoCapture(0)
'''

def gen_frames():  
    # loop over frames from the output stream
    while True:
        # wait until the lock is acquired
        with StreamConfig.lock:
            # check if the output frame is available, otherwise skip
            # the iteration of the loop
            if StreamConfig.outputFrame is None:
                continue
            # encode the frame in JPEG format{{ url_for('video_feed') }}" 
            (flag, encodedImage) = cv2.imencode(".jpg", StreamConfig.outputFrame)
            if not flag:
                continue
            encodedImage = encodedImage.tobytes()
        yield (b'--frame\r\n'
            b'Content-Type: image/jpeg\r\n\r\n' + encodedImage + b'\r\n')


## test start--

def detect(opt):
	# run object detector on live stream and update StreamConfig.output using the annotated frame of the video
    main(opt)
            

## test end--

#
#@app.route('/')
#def index():
#    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == '__main__':
    # parse the parameters for object detector
    opt = parse_opt()

    # start to live stream
    t = threading.Thread(target=detect, args=(
		opt,))
    t.daemon = True
    t.start()
	# start the flask app
    app.run(debug=False, threaded=True, use_reloader=False)
