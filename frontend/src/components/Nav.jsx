
import { Link, useNavigate } from 'react-router-dom'
import { useHistory } from 'react-redux'
import { Button } from '@material-ui/core'

function NavSection(props) {
    const navigate = useNavigate()

    const handleTimeTrackClick = (userId) => {
        navigate(`/admin/timetrack?_id=${userId}`);

    };

    const handleActivityLogClick = (userId) => {
        navigate(`/admin/activitylog?_id=${userId}`);

    };

    return (
        <div className='nav'>
            <div style={{ marginTop: "-60px", display: 'flex', justifyContent: 'start', padding: "10px" }}>
                <Button onClick={() => handleTimeTrackClick(props.userId)}>Time Track</Button>
                <Button onClick={() => handleActivityLogClick(props.userId)}>Activity Log</Button>
            </div>
        </div>
    )
}

export default NavSection
