import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUser } from "react-icons/fa";
import { register, reset } from "../features/auth/authSlice";
import Spinner from "../components/Spinner";
import Webcam from "webcam-easy";

import { cropFaceRegion, initializeNet } from "../js/engine";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const [snap, setSnap] = useState("");

  const imageRef = useRef(null);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const webcam = useRef(null);

  const [webcamInit, setWebcamInit] = useState(true);

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

  useEffect(() => {
    const initialize = async () => {
      await initializeNet();
    };

    initialize();
  }, []);

  const captureImage = () => {

    var data_uri = webcam.current.snap();
    imageRef.current.src = data_uri;


    setSnap(data_uri)

  };

  const { name, email, password, password2 } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
      setWebcamInit(true);
    }

    if (isSuccess && user) {
      navigate("/");
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (snap) {
      const faceBuffer = await cropFaceRegion(snap);
      const result = await cropFaceRegion(snap);

      if (password !== password2) {
        toast.error("Passwords do not match");
      } else if (result.state === 0) {
        toast.error("Cannot detect face in captured image");
      } else if (result.state === 2) {
        toast.error("More than 2 faces detected in captured image");
      } else {
        const userData = {
          name,
          email,
          password,
          image: result.face,
        };

        dispatch(register(userData));
      }
    } else {
      toast.error("You have to take a picture");
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <section className="heading">
        <h1>
          <FaUser /> Register
        </h1>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                width: "320px",
                height: "240px",
                outline: "2px solid black",
                marginBottom: "20px",
              }}
            >
              <video id="camera" width="320" height="240" ref={webcamRef}></video>
              <canvas id="canvas" ref={canvasRef} style={{ display: "none" }}></canvas>
            </div>
            <div
              className="form-group"
              style={{
                minWidth: "320px",
                width: "320px",
                height: "240px",
                outline: "2px solid black",
                marginBottom: "20px",
              }}
            >
              <div>
                <img
                  ref={imageRef}
                  alt="Please Click Capture Button"
                  style={{ height: "240px", width: "320px" }}
                ></img>
              </div>
            </div>
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={name}
              placeholder="Enter your name"
              onChange={onChange}
            />
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
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="password2"
              name="password2"
              value={password2}
              placeholder="Confirm password"
              onChange={onChange}
            />
          </div>
          <div className="form-group"></div>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <button type="button" onClick={captureImage} className="btn btn-block">
              Capture
            </button>
            <button type="submit" className="btn btn-block">
              Register
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default Register;