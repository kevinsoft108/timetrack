import { useState, useEffect } from 'react'
import axios from 'axios';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Activitylog_table from '../components/Activitylog_table'
import NabSection from '../components/Nav'

const Activitylog = ({ socket }) => {

  const [activitylog, setActivitylog] = useState(null);
  const [starttime, setStartTime] = useState(onChange(new Date()));
  // const [starttime, setStartTime] = useState(new Date().toISOString().split("T")[0]);
  const [endtime, setEndtime] = useState(onChange(new Date()));
  // const [endtime, setEndtime] = useState(new Date().toISOString().split("T")[0]);
  let userid = new URLSearchParams(window.location.search).get("_id");

  useEffect(() => {
    axios.post('/api/activitylog', { userid: userid })
      .then(res => {
        let data = res.data;

        function convertArr(start, end) {
          let newArray = [];

          // Iterate over the data
          data.forEach((item) => {
            const detectStart = item.start_time;
            // console.log(detectStart)

            // Extract the date from the "detect_start" string
            const date = detectStart.split("T")[0];

            if (date >= start && date <= end) {
              // console.log('pushed to newArray')
              newArray.push(item)
            }
          });

          // console.log('data length', newArray.length)
          newArray.reverse();
          return newArray;
        }
        setActivitylog(convertArr(starttime, endtime));
      })
      .catch(error => console.log(error))
  }, [starttime, endtime]);

  function onChange(e) {
    const year = e.getFullYear();
    const month = String(e.getMonth() + 1).padStart(2, "0");
    const day = String(e.getDate()).padStart(2, "0");
    const convertedDate = `${year}-${month}-${day}`;
    return convertedDate;
  }

  return (
    <div>
      <NabSection userId={userid} />
      <h2>Activity Log Dashboard</h2>
      <div style={{ marginTop: '80px' }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="From"
            name="fromDate"
            value={dayjs(starttime)}
            // onChange={(newValue) => setStartTime(newValue.$d.toISOString().split("T")[0])}
            onChange={(newValue) => setStartTime(onChange(newValue.$d))}
          />
          <DatePicker
            label="To"
            name="toDate"
            value={dayjs(endtime)}
            // onChange={(newValue) => setEndtime(`${newValue.$y}-${newValue.$M + 1
            //   }-${newValue.$D}`)}
            onChange={(newValue) => setEndtime(onChange(newValue.$d))}
          />
        </LocalizationProvider>
      </div>
      <Activitylog_table logData={activitylog} socket={socket} />
    </div>
  );
}
export default Activitylog;