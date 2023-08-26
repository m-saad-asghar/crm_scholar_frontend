import { Box, Button, Typography, Modal, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import { useSelector } from 'react-redux';
export const UserPopup = (props) => {
  const auth_token = useSelector((state) => state.token);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [validationerrors, setValidationerrors] = useState({});
  const [currentId, setCurrentId] = useState('');
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
  };

  useEffect(() => {
    const data = props.currentData;
    setCurrentId((data && data.id) ? data.id : '')
    setUserName((data && data.name != null && data.name != undefined) ? data.name : '')
    setEmail((data && data.email != null && data.email != null) ? data.email : '')
    setPhone((data && data.phone != null && data.phone != undefined) ? data.phone : '')
  }, [props.currentData]);

  useEffect(() => {
    if(props.currentData == '' || props.currentData == null || props.currentData == undefined){
      resetForm();
    }
  }, []);

  const closeUser = () => {
    props.closeUser();
    setValidationerrors({})
  };

  const onChangeUserName = (e) => {
    setUserName(e.target.value);
  };
  const onChangeemail = (e) => {
    setEmail(e.target.value);
  };
  const onChangephone = (e) => {
    setPhone(e.target.value);
  };

  const validate = () => {
    let validationerrors = {};
    let isValid = true;
    if (userName === null || userName === "" || userName === undefined) {
      isValid = false;
      validationerrors["userName"] = "Name is required.";
    }
    if (email === null || email === "" || email === undefined) {
      isValid = false;
      validationerrors["email"] = "Email is required.";
    }

    setValidationerrors(validationerrors);
    return isValid;
  }
  const submitUser = () => {
    if (validate()){
      setIsUserLoading(true);
      const data = {
        name: userName,
        email: email,
        phone: phone
      };
      if (currentId == ''){
        addNewUser(data);
      }else{
        updateUser(data);
      }
    }
  }

  const addNewUser = (data) => {
    fetch(baseUrl + 'add_new_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth_token}`,
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        if (data.success == "repeat"){
          toast.warning("Email is already exist, please try another email!")
        }
        else if (data.success == 1){
          setIsUserLoading(false);
          toast.success("User is Successfully Saved!")
          props.setUsers(data.users)
        props.closeUserModal();
          resetForm();
          closeUser(true);
        }else{
          toast.error("Something Went Wrong!")
        }
      })
      .catch(error => toast.error("Something Went Wrong!"))
      .finally(() => {
        setIsUserLoading(false);
      });
  };
  const updateUser = (data) => {
    fetch(baseUrl + 'update_user/' + currentId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth_token}`,
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
      if (data.success == 1){
          toast.success("User is Successfully Updated!")
          props.setUsers(data.users)
          props.closeUserModal();
          resetForm();
          setIsUserLoading(false);
        }else{
          toast.error("Something Went Wrong!")
        }
      })
      .catch(error => toast.error("Something Went Wrong!"))
      .finally(() => {
        setIsUserLoading(false);
      });
  };

  const resetForm = () => {
    setUserName('');
    setEmail('');
    setPhone('');
    setValidationerrors({});
    setCurrentId('');
  };
  return (
  <>
    <ToastContainer />
  <Modal
        open={props.UserModal}
        onClose={props.closeUser}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {currentId == '' ? "+ Add User" : "Update User"}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 4 }}>
            {/*<FormControl>*/}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <InputLabel htmlFor="user_name" style={{ position: 'unset' }}>Name</InputLabel>
                <TextField
                style={{width: '100%'}}
                  id="user_name"
                  aria-describedby="user-name"
                  error={Boolean(validationerrors.userName)}
                  onChange={onChangeUserName}
                  value={userName}
                  helperText={validationerrors.userName || ""}
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <InputLabel htmlFor="email" style={{ position: 'unset' }}>Email</InputLabel>
                <TextField
                style={{width: '100%'}}
                  id="email"
                  aria-describedby="email"
                  onChange={onChangeemail}
                  value={email}
                  error={Boolean(validationerrors.email)}
                  helperText={validationerrors.email || ""}
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <InputLabel htmlFor="phone" style={{ position: 'unset' }}>Phone Number</InputLabel>
                <TextField
                  id="phone"
                  style={{width: '100%'}}
                  aria-describedby="phone"
                  onChange={onChangephone}
                  value={phone}
                  variant="standard"
                />
              </Grid>
            </Grid>
            {/*</FormControl>*/}
          </Typography>
          <Grid item xs={12} sm={4} md={4} lg={4}
                style={{ marginTop: 15, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" disabled={isUserLoading}  onClick={closeUser}>Cancel</Button>
            <Button variant="contained" disabled={isUserLoading} onClick={submitUser}> {isUserLoading ? (
              <CircularProgress
                size={20}
                style={{ position: 'absolute', top: '50%', left: '50%', marginTop: -10, marginLeft: -10, color: '#ffffff' }}
              />
            ) : 'Submit'}</Button>
          </Grid>
        </Box>
      </Modal>
  </>
  );
};