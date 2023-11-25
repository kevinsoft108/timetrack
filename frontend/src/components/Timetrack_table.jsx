import { useEffect, useState } from "react";
import HSBar from "react-horizontal-stacked-bar-chart";
import {
  TableBody, Table,
  TableContainer, TableHead, TableRow, TableCell
} from '@material-ui/core';


const Timetrack_table = ({ timedata }) => {

  const [showMessage, setShowMessage] = useState(false);
  const [messageTop, setMessageTop] = useState(0);
  const [messageLeft, setMessageLeft] = useState(0);
  const [messagedata, setMessagedata] = useState('');
  const [result, setResult] = useState(false);
  const [time, setTime] = useState(null);
  const timelineData = [];

  // Using a for loop to cycle from 0 to 24
  for (let i = 9; i < 17; i++) {
    timelineData.push({
      value: 1,
      color: "red",
      description: `${String(i).padStart(2, '0')}:00`
    })
  };

  const showMessagebox = (event) => {
    const x = event.clientX;
    const y = event.clientY;
    setShowMessage(true);
    setMessageTop(y + 50);
    x < 1400 ? setMessageLeft(x + 20) : setMessageLeft(x - 250);
    setMessagedata(event.bar);
  }

  const showResult = (event) => {
    event.preventDefault();
    const x = event.clientX;
    const y = event.clientY;
    setTime(event.target.title);
    setMessageTop(y + 50);
    setMessageLeft(x + 20);
    setResult(true);
  }
  document.addEventListener(
    "click",
    function (event) {
      event.preventDefault();
      if (!event.target.closest("#tablecell")) {
        setShowMessage(false);
      }
      event.preventDefault();
      if (!event.target.closest("#resultMessage")) {
        setResult(false);
      }
    }
  )

  return (
    <>
      {showMessage && (
        <div
          id="messagebox"
          style={{
            position: 'absolute',
            top: messageTop,
            left: messageLeft,
            width: '250px',
            height: '120px',
            backgroundColor: '#FAF0E6',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '30px',
            color: '#CD5C5C'
          }}
        >
          <div>
            {messagedata['color'] == 'green'
              ? (<div>Login: {messagedata.data.start.hour >= 13 ? `${messagedata.data.start.hour - 12}:${messagedata.data.start.minute >= 10 ? `${messagedata.data.start.minute}` : `0${messagedata.data.start.minute}`} PM` : `${messagedata.data.start.hour}:${messagedata.data.start.minute >= 10 ? `${messagedata.data.start.minute}` : `0${messagedata.data.start.minute}`} AM`} to {messagedata.data.end.hour >= 13 ? `${messagedata.data.end.hour - 12}:${messagedata.data.end.minute >= 10 ? `${messagedata.data.end.minute}` : `0${messagedata.data.end.minute}`} PM` : `${messagedata.data.end.hour}:${messagedata.data.end.minute >= 10 ? `${messagedata.data.end.minute}` : `0${messagedata.data.end.minute}`} AM`}<br />Total Time: {messagedata.data.duration.hour} hr {messagedata.data.duration.minute} min</div>)
              : messagedata['color'] == 'red'
                ? (<div>Break: {messagedata.data.start.hour >= 13 ? `${messagedata.data.start.hour - 12}:${messagedata.data.start.minute >= 10 ? `${messagedata.data.start.minute}` : `0${messagedata.data.start.minute}`} PM` : `${messagedata.data.start.hour}:${messagedata.data.start.minute >= 10 ? `${messagedata.data.start.minute}` : `0${messagedata.data.start.minute}`} AM`} to {messagedata.data.end.hour >= 13 ? `${messagedata.data.end.hour - 12}:${messagedata.data.end.minute >= 10 ? `${messagedata.data.end.minute}` : `0${messagedata.data.end.minute}`} PM` : `${messagedata.data.end.hour}:${messagedata.data.end.minute >= 10 ? `${messagedata.data.end.minute}` : `0${messagedata.data.end.minute}`} AM`}<br />Total Time: {messagedata.data.duration.hour} hr {messagedata.data.duration.minute} min</div>)
                : (<div>Left: {messagedata.data.start.hour >= 13 ? `${messagedata.data.start.hour - 12}:${messagedata.data.start.minute >= 10 ? `${messagedata.data.start.minute}` : `0${messagedata.data.start.minute}`} PM` : `${messagedata.data.start.hour}:${messagedata.data.start.minute >= 10 ? `${messagedata.data.start.minute}` : `0${messagedata.data.start.minute}`} AM`} to {messagedata.data.end.hour >= 13 ? `${messagedata.data.end.hour - 12}:${messagedata.data.end.minute >= 10 ? `${messagedata.data.end.minute}` : `0${messagedata.data.end.minute}`} PM` : `${messagedata.data.end.hour}:${messagedata.data.end.minute >= 10 ? `${messagedata.data.end.minute}` : `0${messagedata.data.end.minute}`} AM`}<br />Total Time: {messagedata.data.duration.hour} hr {messagedata.data.duration.minute} min</div>)}
          </div>
        </div>
      )}
      <div>
        <TableContainer style={{ marginTop: '10px' }}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center" style={{ zIndex: 1, position: 'sticky', left: 0, backgroundColor: "#ddd", width: '50px' }}>Date</TableCell>
                <TableCell align="center" stype={{ width: '50px', }}>Time</TableCell>
                <TableCell align="center" style={{ zIndex: 1, position: 'sticky', left: 0, backgroundColor: "#ddd", }}>
                  <HSBar height={0} showTextUp data={timelineData}></HSBar>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {timedata && timedata.map((timetrack, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell align="center" component="th" scope="row" style={{ zIndex: 1, position: 'sticky', left: 0, backgroundColor: "#ddd", }}>
                      {timetrack[0]['data']['time']}
                    </TableCell>
                    <TableCell align="center" component="th" scope="row">
                      <div
                        title={timetrack[0]['data']['useTime']}
                        onClick={showResult}
                        id="resultMessage"
                      >
                        {Math.floor(timetrack[0]['data']['useTime'] / 60)}hr{Math.floor(timetrack[0]['data']['useTime'] % 60)}
                      </div>
                      {result && (
                        <div
                          id="messagebox"
                          style={{
                            position: 'absolute',
                            top: messageTop,
                            left: messageLeft,
                            width: '250px',
                            height: '120px',
                            backgroundColor: '#FAF0E6',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: '30px',
                            color: '#CD5C5C'
                          }}
                        >
                          <div>
                            Time: 9:00 AM to 17:00 PM<br />
                            Total: Time: 8 hr<br />
                            Productive time: {Math.floor(time / 60)} hr {Math.floor(time % 60)} min<br />
                            Un productive time: {Math.floor((480 - time) / 60)} hr {Math.floor((480 - time) % 60)} min
                          </div>
                        </div>)}
                    </TableCell>
                    <TableCell id="tablecell">
                      {
                        <HSBar data={timetrack} onClick={showMessagebox}></HSBar>
                      }
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          <br />
        </TableContainer>
      </div>
    </>
  );
}
export default Timetrack_table;