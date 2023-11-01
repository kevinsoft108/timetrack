import { useState } from 'react';
import {
  Button, TextField, Dialog, DialogActions, LinearProgress,
  DialogTitle, DialogContent, TableBody, Table,
  TableContainer, TableHead, TableRow, TableCell
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import swal from 'sweetalert';
// import { withRouter } from './utils';
const Landing = () => {
  const [openUserModal, setOpenUserModal] = useState('');
  const [openUserEditModal, setOpenUserEditModal] = useState(false);
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [confirm_password, setConfirm_password] = useState('');
  const [file, setFile] = useState('');
  const [fileName, setFileName] = useState('');
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');

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

  const handleUserEditOpen = () => {
    setOpenUserEditModal(true)
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
        <Button
          className="button_style"
          variant="contained"
          size="small"
        // onClick={logOut}
        >
          Log Out
        </Button>
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
            disabled={username == '' || email == '' || password == '' || confirm_password == ''}
            // onClick={(e) => this.updateUser()}
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
          <TextField
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
          /><br /><br />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleUserClose}
            color="primary">
            Cancel
          </Button>
          <Button
            disabled={username == '' || email == '' || password == '' || confirm_password == ''}
            // onClick={(e) => this.addUser()} 
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
          // onChange={this.onChange}
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
            <TableRow>
              <TableCell align="center" component="th" scope="row">
                1
              </TableCell>
              <TableCell align="center">hello</TableCell>
              <TableCell align="center">hello@gmail.com</TableCell>
              <TableCell align="center">img</TableCell>
              <TableCell align="center">
                <Button
                  className="button_style"
                  variant="outlined"
                  color="secondary"
                  size="small"
                // onClick={(e) => this.handleTrackOpen(row)}
                >
                  View
                </Button>
                <Button
                  className="button_style"
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={(e) => handleUserEditOpen()}
                >
                  Edit
                </Button>
                <Button
                  className="button_style"
                  variant="outlined"
                  color="secondary"
                  size="small"
                // onClick={(e) => this.deleteUser(row._id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Landing;