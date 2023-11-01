import HSBar from "react-horizontal-stacked-bar-chart";
import {
  Button, TextField, Dialog, DialogActions, LinearProgress,
  DialogTitle, DialogContent, TableBody, Table,
  TableContainer, TableHead, TableRow, TableCell
} from '@material-ui/core';
const Timetrack_table = () => {
  const timelineData = [];
  // Using a for loop to cycle from 0 to 24
  for (let i = 0; i <= 23; i++) {
    timelineData.push({
      value: 1,
      color: "red",
      description: `${String(i).padStart(2, '0')}:00`
    })
  };
  return (
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
              <TableCell>
                <HSBar data={[{ value: 10 }, { value: 11.89 }, { value: 48.11 }]} onClick={e => alert(e.bar)}></HSBar>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <br />
      </TableContainer>
    </div>
  );
}
export default Timetrack_table;