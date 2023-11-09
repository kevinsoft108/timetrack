import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login, reset } from "../features/auth/authSlice";
import Spinner from "../components/Spinner";

// ---------- webcam ------------- //
import Webcam from "webcamjs";

import { getSimilarityBetweenFaces, initializeNet } from '../js/engine.js'

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    image: "",
  });

  const { email, password, image } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const webcamRef = useRef(null);

  const [webcamInit, setWebcamInit] = useState(false)

  useEffect(() => {
    if (webcamRef.current) {
      Webcam.set({
        width: 319,
        height: 280,
        image_format: "jpeg",
        jpeg_quality: 90,
      });
      Webcam.attach(webcamRef.current);
      setWebcamInit(false)
    }
    return () => {
      Webcam.reset();
    };
  }, [webcamInit]);

  const captureImage = () => {
    Webcam.snap((data_uri) => {
      setFormData((prevState) => ({
        ...prevState,
        image: data_uri,
      }));
    });
  };



  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );



  useEffect(() => {
    const compareImages = async () => {
      if (isError) {
        toast.error("Invalid Credentials.");
        setWebcamInit(true);
      } else if (isSuccess || user) {
        const result = await getSimilarityBetweenFaces(user.image, formData.image);

        if (result < 0.6) {
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
                  width: "320px",
                  height: "280px",
                  outline: "2px solid black",
                  marginBottom: "20px",
                }}
              >
                <div ref={webcamRef}></div>
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

          <div className="form-group">
            <button
              type="submit"
              onClick={captureImage}
              className="btn btn-block"
              disabled={isLoading} // Disable the button when isLoading is true
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default Login;
