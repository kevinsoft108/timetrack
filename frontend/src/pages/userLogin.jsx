import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login, reset } from "../features/auth/authSlice";
import Spinner from "../components/Spinner";

// ---------- webcam ------------- //
import Webcam from 'webcam-easy';

import { getSimilarityBetweenFaces, initializeNet } from '../js/engine.js'


const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    image: "",
  });

  const [snap, setSnap] = useState("");

  const { email, password, image } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const webcam = useRef(null);

  const [webcamInit, setWebcamInit] = useState(true)


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

        setWebcamInit(false);
      }
    };

    const cleanupWebcam = () => {
      if (webcam.current) {
        webcam.current.stop(); // Stop the webcam instance
        webcam.current = null;
        console.log('Camera stopped');
      }
    };

    if (webcamInit) {
      cleanupWebcam();
      initializeWebcam();
    }

    //return cleanupWebcam;
  }, [webcamInit]);

  const captureImage = () => {

    var data_uri = webcam.current.snap();

    setSnap(data_uri)

  };



  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );



  useEffect(() => {

    const saveText = (text, file_name) => {

      // create new link element
      const link = document.createElement("a");
      const file = new Blob([text], { type: 'text/plain' });
      link.href = URL.createObjectURL(file);
      link.download = file_name;
      link.click();
      URL.revokeObjectURL(link.href);
    };

    const compareImages = async () => {
      if (isError) {
        toast.error("Invalid Credentials.");
        setWebcamInit(true);
      } else if (isSuccess || user) {
        console.log(user.image)
        const result = await getSimilarityBetweenFaces(user.image, snap);

        console.log(user._id)
        if (result < 0.5) {
          // saveText(user._id, 'userid.txt')
          localStorage.setItem('facedetection', true);
          navigate("/dashboard");
        } else {
          toast.error("Face Recognition Failed.");
          setWebcamInit(true);
        }
      }

      dispatch(reset());
    };

    // Only execute compareImages if isSuccess or isError is true
    if (isSuccess || isError) {
      compareImages();
    }
  }, [user, isError, isSuccess, message, navigate, dispatch]);


  // To Initialize face-api Net when landing page is loading
  useEffect(() => {
    const initialize = async () => {
      await initializeNet()
    }

    initialize()

    // Delete user and facedetection stored in localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('facedetection');
  }, [])

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
      image
    };
    dispatch(login(userData));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <section className="heading">
        <h1>Login</h1>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div
                style={{
                  width: "640px",
                  height: "400px",
                  marginBottom: "20px",
                  paddingTop: "auto",
                  paddingBottom: "auto",
                }}
              >
                <div>
                  <video id="camera" ref={webcamRef} style={{ outline: "solid" }}></video>
                  <canvas id="canvas" ref={canvasRef} style={{ display: "none" }}></canvas>
                </div>
              </div>
            </div>
          </div>
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={password}
              placeholder="Enter password"
              onChange={onChange}
            />
          </div>

          <div className="form-group" style={{ display: "flex", justifyContent: "space-around" }}>
            <button
              type="submit"
              onClick={captureImage}
              className="btn btn-block"
              disabled={isLoading} // Disable the button when isLoading is true
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
            <Link to='/register' className="btn btn-block">
              Register
            </Link>
          </div>
        </form>
      </section >
    </>
  );
};

export default Login;
