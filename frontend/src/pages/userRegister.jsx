import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUser } from "react-icons/fa";
import { register, reset } from "../features/auth/authSlice";
import Spinner from "../components/Spinner";

// ---------- webcam ------------- //
import Webcam from "webcamjs";

import { cropFaceRegion, initializeNet } from "../js/engine";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
    image: "",
  });
  const imageRef = useRef(null);
  const webcamRef = useRef(null);

  const [webcamInit, setWebcamInit] = useState(true)

  useEffect(() => {
    if (webcamRef.current) {
      Webcam.set({
        width: 317,
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

  // To Initialize face-api Net when landing page is loading
  useEffect(() => {
    const initialize = async () => {
      await initializeNet()
    }

    initialize()
  }, [])

  // capture image from webcam and send to server for authentication
  // Capture Button
  const captureImage = () => {
    Webcam.snap((data_uri) => {
      // console.log(data_uri);
      imageRef.current.src = data_uri;
      setFormData((prevState) => ({
        ...prevState,
        image: data_uri,
      }));
    });
  };

  const { name, email, password, password2, image } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
      setWebcamInit(true)
    }
    console.log(isSuccess, '--------', user);
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


    if (image) {
      const faceBuffer = await cropFaceRegion(image)
      //console.log(faceBuffer, "---------------faceBuffer")
      const result = await cropFaceRegion(image)

      if (password !== password2) {
        toast.error("Passwords do not match");
      } else if (result.state == 0) {
        toast.error("Can not detect face in captured image");
      } else if (result.state == 2) {
        toast.error("more than 2 faces detected in captured image");
      } else {
        // setFormData((prevState) => ({
        //   ...prevState,
        //   image: faceBuffer,
        // }));

        const userData = {
          name,
          email,
          password,
          image: result.face, // Include the captured image data URI in the userData
        };

        dispatch(register(userData));
      }
    } else {
      toast.error("You have to take a picture")
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
                height: "280px",
                outline: "2px solid black",
                marginBottom: "20px",
              }}
            >
              <div ref={webcamRef}></div>
            </div>
            <div
              className="form-group"
              style={{
                minWidth: "320px",
                width: "320px",
                height: "280px",
                outline: "2px solid black",
                marginBottom: "20px",
              }}
            >
              <div>
                <img
                  ref={imageRef}
                  alt="Plase Click Capture Button"
                  style={{ height: "240px", width: "320px", marginTop: "20px" }}
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
        </form>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <button onClick={captureImage} className="btn btn-block">
            Capture
          </button>
          <button type="submit" onClick={onSubmit} className="btn btn-block">
            Register
          </button>
        </div>
      </section>
    </>
  );
};

export default Register;
