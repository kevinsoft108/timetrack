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
  const [starttime, setStartTime] = useState(onChange(new Date()));
  // const [starttime, setStartTime] = useState(new Date().toISOString().split("T")[0]);
  const [endtime, setEndtime] = useState(onChange(new Date()));
  // const [endtime, setEndtime] = useState(new Date().toISOString().split("T")[0]);

  let userid = new URLSearchParams(window.location.search).get("_id");

  useEffect(() => {
    axios.post('/api/timetrack', { userid: userid })
      .then(res => {
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
        function convertArr(start, end) {
          let newArray = [];
          for (let tool in dividedData) {
            if (tool >= start && tool <= end) {
              console.log(dividedData[tool]);
              let date = [];
              let useTime = 0;
              dividedData[tool].map(item => {
                useTime += (new Date(item.detect_end).getUTCHours() * 60 + new Date(item.detect_end).getUTCMinutes()) - (new Date(item.detect_start).getUTCHours() * 60 + new Date(item.detect_start).getUTCMinutes());

                function sum(item) {
                  return new Date(item).getUTCHours() * 3600 + new Date(item).getUTCMinutes() * 60 + new Date(item).getUTCSeconds()
                }
                date.push({
                  year: new Date(item.detect_start).getUTCFullYear(),
                  month: new Date(item.detect_start).getUTCMonth() + 1,
                  day: new Date(item.detect_start).getUTCDate(),
                  hour: new Date(item.detect_start).getUTCHours(),
                  minute: new Date(item.detect_start).getUTCMinutes(),
                  sum: sum(item.detect_start)
                });
                date.push({
                  year: new Date(item.detect_end).getUTCFullYear(),
                  month: new Date(item.detect_end).getUTCMonth() + 1,
                  day: new Date(item.detect_end).getUTCDate(),
                  hour: new Date(item.detect_end).getUTCHours(),
                  minute: new Date(item.detect_end).getUTCMinutes(),
                  sum: sum(item.detect_end)
                });
              });
              date.unshift({ hour: 0, minute: 0, sum: 0 });
              date.push({ hour: 23, minute: 59, sum: 86400 });

              let showMsg = [];
              for (let i = 0; i < date.length - 1; i++) {
                let hour = Math.floor((date[i + 1].sum - date[i].sum) / 3600);
                let minute = Math.floor(Math.floor((date[i + 1].sum - date[i].sum) % 3600) / 60);
                let value = 100 * (date[i + 1].sum - date[i].sum) / 86400;
                let color = !(i % 2) ? 'red' : 'green';
                showMsg.push({
                  value: value,
                  color: color,
                  data: {
                    useTime: useTime,
                    time: `${date[1].year}/${date[1].month}/${date[1].day}`,
                    duration: {
                      hour: hour,
                      minute: minute
                    },
                    start: date[i],
                    end: date[i + 1]
                  }
                })
              }
              console.log(showMsg);
              newArray.push(showMsg);
            }
          }
          return newArray;
        }
        setTimetrack(convertArr(starttime, endtime));
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
      <h2>Time Tracking Dashboard</h2>
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
      <Timetrack_table timedata={timetrack} />
    </div>
  );
}
export default Timetrack;