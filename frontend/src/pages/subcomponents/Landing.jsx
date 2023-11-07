import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom";
import {
  Button, TextField, Dialog, DialogActions, LinearProgress,
  DialogTitle, DialogContent, TableBody, Table,
  TableContainer, TableHead, TableRow, TableCell
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import swal from 'sweetalert';
import { cleanDigitSectionValue } from '@mui/x-date-pickers/internals/hooks/useField/useField.utils';
// import { withRouter } from './utils';

const axios = require('axios');



const Landing = ({ socket }) => {

  // const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [openUserModal, setOpenUserModal] = useState(false);
  const [openUserEditModal, setOpenUserEditModal] = useState(false);
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [confirm_password, setConfirm_password] = useState('');
  const [file, setFile] = useState('');
  const [fileName, setFileName] = useState('');
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [flag, setFlag] = useState('');
  //-------------------------------add Section-----------

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { isError, message } = useSelector(
    (state) => state.goals
  )

  useEffect(() => {

    socket.on('avatarUpdate', data => {
      setFlag(data)
    })
    //-------------add Section------------
    if (isError) {
      console.log(message)
    }
    if (!user) {
      navigate('/login')
    }
    getUser()
  }, [user, navigate, isError, message, dispatch]);

  useEffect(() => {
    getUser();
  }, [search, page, flag])



  const handleUserOpen = () => {
    setOpenUserModal(true)
    setId('')
    setUsername('')
    setEmail('')
    setPassword('')
    setConfirm_password('')
    setFileName('')
  }

  const handleUserClose = () => {
    setOpenUserModal(false)
  }

  const handleUserEditClose = () => {
    setOpenUserEditModal(false)
  }

  const handleUserEditOpen = (data) => {
    setId(data._id);
    setUsername(data.username);
    setEmail(data.email);
    setPassword(data.password);
    setConfirm_password(data.password);
    setOpenUserEditModal(true);
  }
  const handleTrackOpen = (subdata) => {
    console.log(subdata._id);
    navigate(`/timetrack?_id=${subdata._id}`);
  }
  const pageChange = (e, page) => {
    setPage(page);
  }

  const onChange = (e) => {
    // if (e.target.files && e.target.files[0] && e.target.files[0].name) {
    //   setFileName(e.target.files[0].name);
    // }
    setSearch(e.target.value);
  }
  const getUser = async () => {
    setLoading(true);
    let data = '?';
    data = `${data}page=${page}`;
    if (search) {
      data = `${data}&search=${search}`;
    }
    await axios.get(`/api/employ/get-employ${data}`, {
      headers: {
        'token': token
      }
    }).then((res) => {
      setLoading(false);
      setUsers(res.data.users);
      setPages(res.data.pages);
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      setLoading(false);
      setUsers([]);
      setPages(0)
    });
  }
  const updateUser = () => {
    axios.post('/api/employ/update-employ', {
      id: id,
      username: username,
      email: email,
      password: password,
      confirm_password: confirm_password
    }, {
      headers: {
        'token': token
      }
    }).then((res) => {

      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });

      handleUserEditClose();
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirm_password('');
      setFile(null);
      getUser();
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      handleUserEditClose();
    });
  }

  const addUser = () => {
    axios.post('/api/employ/add-employ', {
      username: username,
      email: email,
      password: password,
      confirm_password: confirm_password
    }, {
      headers: {
        'token': token
      }
    }).then((res) => {

      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });

      handleUserClose();
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirm_password('');
      setFile(null);
      setPage(1);
      getUser();
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      handleUserClose();
    });
  }

  const deleteUser = (id) => {
    axios.post('/api/employ/delete-employ', {
      id: id
    }, {
      headers: {
        'Content-Type': 'application/json',
        'token': token
      }
    }).then((res) => {

      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });

      setPage(1);
      pageChange(null, 1);

    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      handleUserClose();
    });
    getUser();
  }

  return (
    <div>
      {loading && <LinearProgress size={40} />}
      <div>
        <h2>Dashboard</h2>
        <Button
          className="button_style"
          variant="contained"
          color="primary"
          size="small"
          onClick={handleUserOpen}
        >
          Add User
        </Button>
        {/* <Button
          className="button_style"
          variant="contained"
          size="small"
        // onClick={logOut}
        >
          Log Out
        </Button> */}
      </div>

      {/* Edit User */}
      <Dialog
        open={openUserEditModal}
        onClose={handleUserClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Edit User</DialogTitle>
        <DialogContent>
          <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="User Name"
            required
          /><br />
          <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          /><br />
          <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          /><br />
          <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="confirm_password"
            value={confirm_password}
            onChange={(e) => setConfirm_password(e.target.value)}
            placeholder="Confirm Password"
            required
          /><br />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleUserEditClose}
            color="primary">
            Cancel
          </Button>
          <Button
            disabled={username == '' || email == ''}
            // disabled={username == '' || email == '' || password == '' || confirm_password == ''}
            onClick={(e) => updateUser()}
            color="primary" autoFocus>
            Edit User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add User */}
      <Dialog
        open={openUserModal}
        onClose={handleUserClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Add User</DialogTitle>
        <DialogContent>
          <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="User Name"
            required
          /><br />
          <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            required
          /><br />
          {/* <TextField
            id="standard-basic"
            type="password"
            autoComplete="off"
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
          /><br />
          <TextField
            id="standard-basic"
            type="password"
            autoComplete="off"
            name="confirm_password"
            value={confirm_password}
            onChange={e => setConfirm_password(e.target.value)}
            placeholder="Confirm Password"
            required
          /><br /><br /> */}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleUserClose}
            color="primary">
            Cancel
          </Button>
          <Button
            // disabled={username == '' || email == '' || password == '' || confirm_password == ''}
            disabled={username == '' || email == ''}
            onClick={(e) => addUser()}
            color="primary" autoFocus>
            Add User
          </Button>
        </DialogActions>
      </Dialog>

      <TableContainer>
        <TextField
          id="standard-basic"
          type="search"
          autoComplete="off"
          name="search"
          value={search}
          onChange={onChange}
          placeholder="Search by name or email"
          required
        />
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">No</TableCell>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Face</TableCell>
              <TableCell align="center">Operations</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              users && users.map((row, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell align="center" component="th" scope="row">
                      {users.indexOf(row) + 1}
                    </TableCell>
                    <TableCell align="center">{row.username}</TableCell>
                    <TableCell align="center">{row.email}</TableCell>
                    <TableCell align="center">
                      <img src={row.face} width="70" height="70" />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        className="button_style"
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={(e) => handleTrackOpen(row)}
                      >
                        View
                      </Button>
                      <Button
                        className="button_style"
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={(e) => handleUserEditOpen(row)}
                      >
                        Edit
                      </Button>
                      <Button
                        className="button_style"
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={(e) => deleteUser(row._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>
        <br />
        <Pagination count={pages} page={page} onChange={pageChange} color="primary" />
      </TableContainer>
    </div>
  );
}

export default Landing;