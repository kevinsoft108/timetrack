import { useEffect, useState } from "react";
import {
  TableBody, Table,
  TableContainer, TableHead, TableRow, TableCell
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { FaVideo } from 'react-icons/fa'

const Activitylog_table = ({ logData }) => {
  const per_page = 10

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [logs, setLogs] = useState(null);

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
                            const videoDataUrl = activitylog['screen_recording']; // Replace with your actual data URL

                            // Create a new HTML document
                            const newWindow = window.open('http://localhost:3333', '_blank', 'width=800,height=600');
                            const newDocument = newWindow.document;

                            // Set the content of the new document to an HTML video element with the data URL as the source
                            newDocument.open();
                            newDocument.write(`
                          <!DOCTYPE html>
                          <html>
                          <head>
                            <title>Video Player</title>
                          </head>
                          <body>
                            <video width="800" height="600" controls autoplay>
                              <source src="${videoDataUrl}" type="video/mp4">
                            </video>
                          </body>
                          </html>
                        `);
                            newDocument.close();
                          }}
                        />
                      </span>

                    </TableCell>
                    <TableCell width="15%" align="center" component="th" scope="row">
                      Computer
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