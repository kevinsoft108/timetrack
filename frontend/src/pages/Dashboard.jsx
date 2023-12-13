import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../components/Spinner";
import axios from "axios";
// ---------- webcam ------------- //
import Webcam from "webcam-easy";

import { getSimilarityBetweenFaces, initializeNet } from '../js/engine.js'



const Dashboard = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const imageRef = useRef(null);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const webcam = useRef(null);

  const { user } = useSelector((state) => state.auth);

  const [working, setWorking] = useState(true)
  const [failedCnt, setFailedCnt] = useState(0)       //Count failed recognition
  const [failedTime, setFailedTime] = useState(0)     //saves the last time
  const [id, setId] = useState('');
  const [sign, setSign] = useState(1)
  const [database, setDatabase] = useState({ userid: '', flag: 1, newid: '' })
  const [mounted, setMounted] = useState(false); // Added mounted state

  useEffect(() => {
    const facedetection = localStorage.getItem('facedetection')
    // Set mounted to true when component is mounted
    if (!user || !localStorage.getItem('user') || !facedetection) {
      navigate("/");
    }
    setMounted(true);

    return () => {
      // Set mounted to false when component is unmounted
      setMounted(false);
    };
  }, [user, navigate, dispatch]);

  useEffect(() => {
    const initializeWebcam = async () => {
      if (webcamRef.current && canvasRef.current) {
        const webCamElement = webcamRef.current;
        const canvasElement = canvasRef.current;

        console.log("initializing Webcam");

        try {
          webcam.current = new Webcam(webCamElement, 'user', canvasElement, null);
          await webcam.current.start();
          console.log("Webcam started");
        } catch (error) {
          console.log(error);
        }

      }
    };

    const cleanupWebcam = () => {
      if (webcam.current) {
        webcam.current.stop(); // Stop the webcam instance
        webcam.current = null;
        console.log('Camera stopped');
      }
    };

    cleanupWebcam();
    initializeWebcam();

    //return cleanupWebcam;
  }, []);

  useEffect(() => {
    console.log("failed Cnt: ", failedCnt)
    if (working && failedCnt >= 6) {
      var curTime = parseInt(Date.now() / 60000)  //get the current time in minutes since January 1, 1970, 00:00:00 UTC.
      setFailedTime(curTime)
      console.log("failed Time: ", curTime)
      setWorking(false)
    }
  }, [failedCnt, failedTime, working])

  useEffect(() => {
    // Check if component is mounted before making API call
    if (mounted) {
      const captureImage = () => {
        return new Promise(async (resolve, reject) => {
          var data_uri = webcam.current.snap();

          try {
            const result = await getSimilarityBetweenFaces(user.image, data_uri);
            console.log("similarity: ", result.toString());
            resolve(result);
          } catch (error) {
            reject(error);
          }

          // Webcam.snap(async (data_uri) => {
          //   imageRef.current.src = data_uri;
          //   const image = data_uri;

          //   try {
          //     const result = await getSimilarityBetweenFaces(user.image, image);
          //     console.log("similarity: ", result.toString());
          //     resolve(result);
          //   } catch (error) {
          //     reject(error);
          //   }
          // });
        });
      };

      const checkworking = (similiarity) => {
        // console.log("similarity in checkworking: ", similiarity)
        if (similiarity < 0.5) {
          var curTime = parseInt(Date.now() / 60000)
          // console.log('similarity is less than 0.6')
          if (!working) {
            if (curTime > failedTime) {
              console.log("current time: ", curTime)
              console.log("failed time: ", failedTime)
              setFailedCnt(0)
              setWorking(true)
            }
          } else {
            setFailedCnt(0)
          }

        } else {
          setFailedCnt((cnt) => (cnt + 1))
        }
      }

      const captureImageInterval = async () => {
        captureImage().then((similarity) => {
          checkworking(similarity);
        });
      };

      const interval = setInterval(captureImageInterval, 10000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [working, mounted]);

  // To Initialize face-api Net when landing page is loading
  useEffect(() => {
    const initialize = async () => {
      await initializeNet()
    }

    initialize()
  }, [])

  // inform server whether user in front of PC or not.
  useEffect(() => {
    if (working) {
      console.log("user is working")
      setSign(1)
    } else {
      console.log("user is not working");
      setSign(0)
    }
  }, [working])

  useEffect(() => {
    let employ = JSON.parse(localStorage.getItem('user'));
    if (employ) {
      setDatabase({
        ...database,
        userid: employ._id,
        flag: sign
      })
    }

  }, [sign])

  useEffect(() => {
    let employ = JSON.parse(localStorage.getItem('user'));
    if (employ) {
      setDatabase({
        ...database,
        userid: employ._id,
        newid: id
      })
    }

  }, [id])

  useEffect(() => {
    // Check if component is mounted before making API call
    if (mounted) {
      const sendRequest = () => {

        axios.post('/api/timetrack/settime', database)
          .then(res => {
            if (id != res.data) {
              setId(res.data)
            }
          })
        console.log(database, new Date());
      }
      const interval = setInterval(sendRequest, 100000)

      sendRequest()

      return () => {
        clearInterval(interval)
      }
    }
  }, [database, mounted])


  return (
    <>
      <section className="heading">
        <h1>Welcome</h1>
        {user && <p>{user.name}</p>}
      </section>

      <section className="form" style={{ visibility: 'hidden' }}>
        <div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                width: "320px",
                height: "280px",
                outline: "2px solid black",
                marginBottom: "20px",
                // display: "none",
              }}
            >
              <video id="camera" ref={webcamRef} ></video>
              <canvas id="canvas" ref={canvasRef} style={{ display: "none" }}></canvas>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;