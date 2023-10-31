import { useState, useEffect } from 'react';
import axios from 'axios';
import style from './Timetrack.module.css'
const Timetrack = () => {
  const { data, setData } = useState([]);
  useEffect(() => {

  })
  return (
    <div>
      <h2>Time Tracking Dashboard</h2>
      <div className={style.table}>
        <div className={style.subtable}>
          <tr >
            <th className={style.th_date}>Date</th>
            <th className={style.th_time}>Time</th>
            <th className={style.th_mark}>
              <div>00:00</div><div>01:00</div><div>02:00</div><div>03:00</div><div>04:00</div><div>05:00</div><div>06:00</div><div>07:00</div><div>08:00</div><div>09:00</div><div>10:00</div><div>11:00</div><div>12:00</div><div>13:00</div><div>14:00</div><div>15:00</div><div>16:00</div><div>17:00</div><div>18:00</div><div>19:00</div><div>20:00</div><div>21:00</div><div>22:00</div><div>23:00</div>
            </th>
          </tr>
          <tr>
            <td>1</td>
            <td>2</td>
            <td>3</td>
          </tr>
        </div>
      </div>
    </div>
  );
}
export default Timetrack;