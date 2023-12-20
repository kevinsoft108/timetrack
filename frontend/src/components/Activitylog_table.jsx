import { useEffect, useState, useRef } from "react";
import {
  TableBody, Table,
  TableContainer, TableHead, TableRow, TableCell
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { FaVideo } from 'react-icons/fa'

const Activitylog_table = ({ logData, socket }) => {
  const per_page = 10

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [logs, setLogs] = useState(null);
  const [recording, setRecording] = useState(false)

  const imageRef = useRef(null);

  // console.log(logData)

  useEffect(() => {
    getUser();
  }, [page, pages])

  useEffect(() => {
    // console.log('seting page')
    if (logData != null) {
      const pages = Math.ceil(logData.length / per_page);
      // console.log("logData.length", logData.length);
      setPages(pages)
    }

  }, [logData])

  useEffect(() => {
    socket.on('liveCapture', data => {
      // console.log(data);
      imageRef.current = data

      // Clean up the event listener when the component unmounts
      return () => {
        socket.off('liveCapture');
      };
    })

  }, []);

  useEffect(() => {
    if (recording) {
      console.log('live capture started')
      socket.emit('response', true);
    } else {
      console.log('live capture stopped')
      socket.emit('response', false);
      imageRef.current = null
    }
  }, [recording])

  const getUser = () => {
    if (logData != null) {
      const start_index = Math.max((page - 1) * per_page, 0)
      const end_index = Math.min(page * per_page, logData.length)

      setLogs(logData.slice(start_index, end_index))
    }

  }

  const pageChange = (e, page) => {
    setPage(page);
  }

  return (
    <>
      <div>
        <TableContainer style={{ marginTop: '10px' }}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center" width="15%" style={{ backgroundColor: "#f0f0f0" }}>Date</TableCell>
                <TableCell align="center" width="15%" >Computer</TableCell>
                <TableCell align="center" width="15%" style={{ backgroundColor: "#f0f0f0" }}>Process/URL</TableCell>
                <TableCell align="center" width="15%" >Duration</TableCell>
                <TableCell align="center" width="15%" style={{ backgroundColor: "#f0f0f0" }}>App/Webpage</TableCell>
                <TableCell align="center" width="25%" >Keystrokes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs && logs.map((activitylog, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell align="center" component="th" scope="row" width="15%" style={{ backgroundColor: "#f0f0f0" }}
                    >
                      <span>
                        {activitylog['start_time']}
                      </span>
                      <span style={{ cursor: 'pointer' }}>
                        <FaVideo
                          style={{ marginLeft: '12px' }}
                          onClick={(event) => {
                            event.stopPropagation(); // Prevent the click event from propagating to the TableCell
                            // Handle the click event for the icon here
                            // Define the data URL of the video
                            setRecording(true)

                            const videoDataUrl = activitylog['screen_recording']; // Replace with your actual data URL

                            // Create a new HTML document
                            const newWindow = window.open('http://localhost:3333', '_blank', 'width=800,height=600');
                            const newDocument = newWindow.document;

                            const updateImageSrc = () => {
                              newDocument.getElementById('myImg').src = imageRef.current;
                            };



                            // Function to update the image size
                            const updateImageSize = () => {
                              const windowWidth = newWindow.innerWidth;
                              const windowHeight = newWindow.innerHeight;

                              // Calculate the desired width and height of the image based on the window size
                              const desiredWidth = windowWidth; // Adjust the factor as needed
                              const desiredHeight = windowHeight; // Adjust the factor as needed

                              // Set the width and height of the image element
                              newDocument.getElementById('myImg').style.width = `${desiredWidth}px`;
                              newDocument.getElementById('myImg').style.height = `${desiredHeight}px`;
                            };

                            // Set the content of the new document to an HTML video element with the data URL as the source
                            newDocument.open();
                            newDocument.write(`
                             <!DOCTYPE html>
                             <html>
                             <head>
                             <title>Video Player</title>
                             <style>
                              #myImg {
                                width: 100%; /* Initial width */
                                height: 100%; /* Initial height */
                              }
                            </style>
                             </head>
                             <body>
                             <img id="myImg" src="${imageRef.current}" alt="Live Capture" width="800" height="600">
                             </body>
                             </html>
                             `);
                            newDocument.close();

                            // Periodically check for changes in imageRef and update the image src
                            const intervalId = setInterval(() => {
                              updateImageSrc();

                            }, 1000); // Check every 1 second


                            // Listen for the beforeunload event on the newWindow
                            newWindow.addEventListener('beforeunload', () => {
                              // console.log('new document closed')
                              clearInterval(intervalId);
                              setRecording(false)
                            });

                            // Listen for the resize event on the newWindow
                            newWindow.addEventListener('resize', updateImageSize);

                          }}
                        />
                      </span>

                    </TableCell>
                    <TableCell width="15%" align="center" component="th" scope="row">
                      {activitylog['computer_name']}
                    </TableCell>
                    <TableCell width="15%" align="center" component="th" scope="row" style={{ backgroundColor: "#f0f0f0" }}>
                      {activitylog['process_url']}
                    </TableCell>
                    <TableCell width="15%" align="center" component="th" scope="row">
                      {activitylog['duration']}
                    </TableCell>
                    <TableCell width="15%" align="center" component="th" scope="row" style={{ backgroundColor: "#f0f0f0" }}>
                      {activitylog['app_webpage']}
                      {/* {activitylog['screen_recording']} */}
                    </TableCell>
                    <TableCell width="25%" align="center" component="th" scope="row">
                      <span className="tableCell-content">{activitylog['keystrokes']}</span>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          <br />
          <Pagination count={pages} page={page} onChange={pageChange} color="primary" />
        </TableContainer>
      </div>
    </>
  );
}
export default Activitylog_table;