import { useState, useEffect } from 'react'
import axios from 'axios';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Timetrack_table from './subcomponents/Timetrack_table'
import style from './Timetrack.module.css'

const Timetrack = () => {

  const [timetrack, setTimetrack] = useState(null);
  const [database, setDataBase] = useState({});
  const [starttime, setStartTime] = useState(new Date().toISOString().split("T")[0]);
  const [endtime, setEndtime] = useState(new Date().toISOString().split("T")[0]);

  let userid = new URLSearchParams(window.location.search).get("_id");

  useEffect(() => {
    axios.post('/api/timetrack', { userid: userid })
      .then(res => {
        console.log(res.data);
        let data = res.data;
        // Object to store the divided arrays
        const dividedData = {};

        // Iterate over the data
        data.forEach((item) => {
          const detectStart = item.detect_start;

          // Extract the date from the "detect_start" string
          const date = detectStart.split("T")[0];

          // If the date does not exist as a key in dividedData, create an empty array for it
          if (!dividedData[date]) {
            dividedData[date] = [];
          }

          // Push the item into the corresponding date's array
          dividedData[date].push(item);
        });

        console.log(starttime, endtime);
        function convertArr(start, end) {
          let newArray = [];
          for (let tool in dividedData) {
            if (tool >= start && tool <= end) {


              let date = [];
              dividedData[tool].map(item => {
                date.push({
                  year: new Date(item.detect_start).getUTCFullYear(),
                  month: new Date(item.detect_start).getUTCMonth() + 1,
                  day: new Date(item.detect_start).getUTCDate(),
                  hour: new Date(item.detect_start).getUTCHours(),
                  minute: new Date(item.detect_start).getUTCMinutes(),
                  sum: new Date(item.detect_start).getUTCHours() * 60 + new Date(item.detect_start).getUTCMinutes(),
                });
                date.push({
                  year: new Date(item.detect_end).getUTCFullYear(),
                  month: new Date(item.detect_end).getUTCMonth() + 1,
                  day: new Date(item.detect_end).getUTCDate() + 1,
                  hour: new Date(item.detect_end).getUTCHours(),
                  minute: new Date(item.detect_end).getUTCMinutes(),
                  sum: new Date(item.detect_end).getUTCHours() * 60 + new Date(item.detect_end).getUTCMinutes()
                });
              });
              date.unshift({ hour: 0, minute: 0, sum: 0 });
              date.push({ hour: 23, minute: 59, sum: 1440 });
              let showMsg = [];
              for (let i = 0; i < date.length - 1; i++) {
                let hour = Math.floor((date[i + 1].sum - date[i].sum) / 60);
                let minute = (date[i + 1].sum - date[i].sum) % 60;
                let value = 100 * (date[i + 1].sum - date[i].sum) / 1440;
                let color = !(i % 2) ? 'red' : 'green';
                showMsg.push({
                  value: value,
                  color: color,
                  data: {
                    duration: {
                      hour: hour,
                      minute: minute
                    },
                    start: date[i],
                    end: date[i + 1]
                  }
                })
              }
              newArray.push(showMsg);
            }
          }
          return newArray;
        }
        setTimetrack(convertArr(starttime, endtime));
      })
      .catch(error => console.log(error))
  }, [starttime, endtime]);

  return (
    <div>
      <h2>Time Tracking Dashboard</h2>
      <div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="From"
            name="fromDate"
            value={dayjs(starttime)}
            onChange={(newValue) => setStartTime(newValue.$d.toISOString().split("T")[0])}
          />
          <DatePicker
            label="To"
            name="toDate"
            value={dayjs(endtime)}
            // onChange={(newValue) => setEndtime(`${newValue.$y}-${newValue.$M + 1
            //   }-${newValue.$D}`)}
            onChange={(newValue) => setEndtime(newValue.$d.toISOString().split("T")[0])}
          />
        </LocalizationProvider>
      </div>
      <Timetrack_table timedata={timetrack} />
    </div>
  );
}
export default Timetrack;