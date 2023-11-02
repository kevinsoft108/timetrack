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
  let userid = new URLSearchParams(window.location.search).get("_id");
  console.log(userid);
  useEffect(() => {
    axios.post('/api/timetrack', { userid: userid })
      .then(res => {
        console.log(res.data);
        let date = [];
        res.data.map(item => {
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
        setTimetrack(showMsg);
      })
      .catch(error => console.log(error))
  }, []);

  return (
    <div>
      <h2>Time Tracking Dashboard</h2>
      <div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="From"
            name="fromDate"
            value={dayjs(new Date())}
            // onChange={this.onChange}
            onChange={(newValue) => console.log(newValue.$y)}
          />
          <DatePicker
            label="To"
            name="toDate"
            value={dayjs(new Date())}
            // onChange={this.onChange}
            onChange={(newValue) => console.log(newValue)}
          />
        </LocalizationProvider>
      </div>
      <Timetrack_table timetrack={timetrack} />
    </div>
  );
}
export default Timetrack;