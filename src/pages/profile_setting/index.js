import {useState, useEffect } from 'react';
import Head from 'next/head';
import { Box, Button, Container, Stack, SvgIcon, Typography, Modal, Scrollbar, Card } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfileSetting = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const jwt_token = localStorage.getItem("jwt_token")
  const [isLoading, setIsLoading] = useState(false);
  const [nameState, setNameState] = useState('');
  const [phoneState, setPhoneState] = useState('');
  const [emailState, setEmailState] = useState('');
  const [passwordState, setPasswordState] = useState('');
  const [resetPasswordState, setResetPasswordState] = useState('');
  useEffect(() => {
    const user_data = JSON.parse(localStorage.getItem("user_data"));
    setEmailState((user_data && user_data.email) ? user_data.email : "");
    setNameState((user_data && user_data.name) ? user_data.name : "");
    setPhoneState((user_data && user_data.phone) ? user_data.phone : "");
  }, []);


    const onChangeUserName = (e) => {
      setNameState(e.target.value);
    };

      const onChangeUserPhone = (e) => {
        setPhoneState(e.target.value);
      };

      const onChangeUserPassword = (e) => {
        setPasswordState(e.target.value);
      };

      const onChangeUserResetPassword = (e) => {
        setResetPasswordState(e.target.value);
      };

      const submitProfileSetting = () => {
            setIsLoading(true);
            const data = {
                "user_name": nameState,
                "user_phone": phoneState,
                "user_password": passwordState,
                "user_reset_password": resetPasswordState
            }
            console.log("data", data)
            fetch(baseUrl + 'profile_setting', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${jwt_token}`,
                },
                body: JSON.stringify(data)
              })
                .then(response => response.json())
                .then(data => {
                    setIsLoading(false);
                  if (data.success == 1){
                    toast.success("Profile Setting is Successfully Saved!")
                    localStorage.setItem('user_data', JSON.stringify(data.user_data));
                  }else if (data.success == 'mismatch'){
                    toast.error("Password and Repeat Password Must be Same!")
                  }else if (data.success == 'error'){
                    toast.error("Password must be Atleast 6 Characters Long!")
                  }else if (data.success == 'undefined_error'){
                    toast.error("Something Went Wrong!")
                  }else{
                    toast.error("Something Went Wrong!")
                  }
                })
                .catch(error => toast.error("Something Went Wrong!"))
                .finally(() => {
                    setIsLoading(false);
                });
      };
  

  return (
    <>
      <ToastContainer />
      <Head>
        <title>
          Profile Setting | Scholar CRM
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">
                  Profile Setting
                </Typography>
              </Stack>
            </Stack>
            <Card>
            <Box sx={{ minWidth: 800 }}>
                 {/*<Profile Setting Form>*/}
              <Grid container spacing={2} style={{padding: 40}}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <InputLabel htmlFor="user_name" style={{ position: 'unset' }}>Name</InputLabel>
                  <TextField
                    id="user_name"
                    aria-describedby="user-name"
                    onChange={onChangeUserName}
                    value={nameState}
                    variant="standard"
                    style={{width: "100%"}}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <InputLabel htmlFor="user_email" style={{ position: 'unset' }}>Email</InputLabel>
                  <TextField
                    id="user_email"
                    aria-describedby="user-email"
                    value={emailState}
                    disabled
                    variant="standard"
                    style={{width: "100%"}}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <InputLabel htmlFor="user_phone" style={{ position: 'unset' }}>Phone Number</InputLabel>
                  <TextField
                    id="user_phone"
                    aria-describedby="user-phone"
                    disabled
                    onChange={onChangeUserPhone}
                    value={[phoneState]}
                    variant="standard"
                    style={{width: "100%"}}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <InputLabel htmlFor="user_password" style={{ position: 'unset' }}>Password</InputLabel>
                  <TextField
                    id="user_password"
                    aria-describedby="user-password"
                    type="password"
                    onChange={onChangeUserPassword}
                    value={passwordState}
                    variant="standard"
                    style={{width: "100%"}}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <InputLabel htmlFor="user_reset_password" style={{ position: 'unset' }}>Repeat Password</InputLabel>
                  <TextField
                    id="user_reset_password"
                    aria-describedby="user-reset-password"
                    type="password"
                    onChange={onChangeUserResetPassword}
                    value={resetPasswordState}
                    variant="standard"
                    style={{width: "100%"}}
                  />
                </Grid>
              </Grid>
              {/*</Profile Setting Form>*/}
            </Box>
            <Grid item xs={12} sm={4} md={4} lg={4}
                  style={{ marginTop: 15, display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="contained" disabled={isLoading} style={{margin: 35}} onClick={submitProfileSetting}> {isLoading ? (
                <CircularProgress
                  size={20}
                  style={{ position: 'absolute', top: '50%', left: '50%', marginTop: -10, marginLeft: -10, color: '#ffffff' }}
                />
              ) : 'Submit'}</Button>
            </Grid>
            </Card>
          </Stack>
         
        </Container>
      </Box>
    </>
  );
};

ProfileSetting.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default ProfileSetting;