import Head from 'next/head';
import NextLink from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useRouter as useRouterNavigation } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Link, Stack, TextField, Typography } from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from '@mui/material/CircularProgress';
import { Route } from '@mui/icons-material';
const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

const ChangePassword = () => {
  const router = useRouter();
  const routerNavigation = useRouterNavigation();
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      password: '',
      repeat_password: '',
      submit: null
    },
    validationSchema: Yup.object({
        password: Yup
        .string()
        .max(255)
        .required('Password is required'),
        repeat_password: Yup
        .string()
        .max(255)
        .required('Repeat Password is required')
    }),
    onSubmit: async (values, helpers) => {
        setIsLoading(true);
        const data = {
            "password": values.password,
            "repeat_password": values.repeat_password,
            "token": router.query.token
        }
        fetch(baseUrl + 'auth/change_password', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          })
            .then(response => response.json())
            .then(data => {
                setIsLoading(false);
              if(data.success == "mismatch"){
                toast.error("Password and Repeat Password do not match")
              }
              if(data.success == 1){
                routerNavigation.push('/auth/login');
                toast.success("Password has been Successfully Change")
              }
            })
            .catch(error => {
                toast.error("Something Went Wrong")
                setIsLoading(false);
              helpers.setStatus({ success: false });
            helpers.setErrors({ submit: error.message });
            helpers.setSubmitting(false);
            });
    }
  });

  return (
    <>
      <ToastContainer />
      <Head>
        <title>
          Change Password | Scholar
        </title>
      </Head>
      <Box
        sx={{
          flex: '1 1 auto',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: '100px',
            width: '100%'
          }}
        >
          <div>
            <Stack
              spacing={1}
              sx={{ mb: 3 }}
            >
              <Typography variant="h4">
                Change Password
              </Typography>
            </Stack>
            <form
              noValidate
              onSubmit={formik.handleSubmit}
            >
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="New Password"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password}
                />
                <TextField
                  error={!!(formik.touched.repeat_password && formik.errors.repeat_password)}
                  fullWidth
                  helperText={formik.touched.repeat_password && formik.errors.repeat_password}
                  label="Repeat Password"
                  name="repeat_password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.repeat_password}
                />
              </Stack>
              {formik.errors.submit && (
                <Typography
                  color="error"
                  sx={{ mt: 3 }}
                  variant="body2"
                >
                  {formik.errors.submit}
                </Typography>
              )}
              <Button
                fullWidth
                style={{minHeight: 50}}
                size="large"
                sx={{ mt: 3 }}
                disabled={isLoading}
                type="submit"
                variant="contained"
              >
                {isLoading && <CircularProgress
              size={40}
              style={{ position: 'absolute', color: '#ffffff' }}
            />}

            {!isLoading && 'Continue'}
                
              </Button>
            </form>
          </div>
        </Box>
      </Box>
    </>
  );
};

// ChangePassword.getLayout = (page) => (
//   <AuthLayout>
//     {page}
//   </AuthLayout>
// );

export default ChangePassword;