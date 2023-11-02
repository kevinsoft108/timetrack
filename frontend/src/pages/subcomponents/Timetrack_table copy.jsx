import { useState } from "react";
import HSBar from "react-horizontal-stacked-bar-chart";
import {
  Button, TextField, Dialog, DialogActions, LinearProgress,
  DialogTitle, DialogContent, TableBody, Table,
  TableContainer, TableHead, TableRow, TableCell
} from '@material-ui/core';
const Timetrack_table = ({ timetrack }) => {

  const [showMessage, setShowMessage] = useState(false);
  const [messageTop, setMessageTop] = useState(0);
  const [messageLeft, setMessageLeft] = useState(0);
  const [messagedata, setMessagedata] = useState('');
  const timelineData = [];

  console.log(timetrack);
  // Using a for loop to cycle from 0 to 24
  for (let i = 0; i <= 23; i++) {
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
    setMessageLeft(x + 20);
    setMessagedata(event.bar.data);
  }

  document.addEventListener(
    "click",
    function (event) {
      if (!event.target.closest("#tablecell")) {
        setShowMessage(false);
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
            width: '200px',
            height: '150px',
            backgroundColor: '#FAF0E6',
            padding: '47px 0px',
            borderRadius: '30px',
            color: '#CD5C5C'
          }}
        >
          <div>Time: {messagedata.start.hour}:{messagedata.start.minute} to {messagedata.end.hour}:{messagedata.end.minute}</div>
          <div>Total Time: {messagedata.duration.hour} hr {messagedata.duration.minute} min</div>
        </div>
      )}
      <div>

        <TableContainer enablePinning>
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
              <TableRow key={10 / 27}>
                <TableCell align="center" component="th" scope="row" style={{ zIndex: 1, position: 'sticky', left: 0, backgroundColor: "#ddd", }}>
                  10/27
                </TableCell>
                <TableCell align="center" component="th" scope="row">
                  09:50h
                </TableCell>
                <TableCell id="tablecell">
                  {/* <HSBar data={[{ value: 10 }, { value: 11.89 }, { value: 48.11 }]} onClick={e => alert(e.bar)}></HSBar> */}
                  {
                    timetrack && <HSBar data={timetrack} onClick={showMessagebox}></HSBar>
                  }
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <br />
        </TableContainer>
      </div>
    </>
  );
}
export default Timetrack_table;