import { FaSignOutAlt } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'

function Header() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const facedetection = localStorage.getItem('facedetection')

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate('/')
  }

  return (
    <header className='header'>
      <div className='logo'>
        <Link to='/admin'>Time track</Link>
      </div>
      <ul>
        {(user) ? (
          <li>
            <Link to='#' onClick={onLogout}>
              <FaSignOutAlt /> Logout
            </Link>
          </li>
        ) : (
          <>
          </>
        )}
      </ul>
    </header>
  )
}

export default Header