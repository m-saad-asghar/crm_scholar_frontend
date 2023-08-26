import Head from 'next/head';
import NextLink from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Link, Stack, TextField, Typography } from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from '@mui/material/CircularProgress';
const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

const ResetPassword = () => {
  const router = useRouter();
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: '',
      submit: null
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required')
    }),
    onSubmit: async (values, helpers) => {
        setIsLoading(true);
        const data = {
            "email": values.email
        }
        fetch(baseUrl + 'auth/reset_password', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          })
            .then(response => response.json())
            .then(data => {
                setIsLoading(false);
              if(data.success == "unauthorize"){
                toast.error("Invalid Email!")
              }
              if(data.success == "disable"){
                toast.error("Your Account has been Disable")
              }
              if(data.success == 1){
                toast.success("Email has been send to your ID for reset password")
              }
            })
            .catch(error => {
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
          Reset Password | Scholar
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
                Reset Password
              </Typography>
            </Stack>
            <form
              noValidate
              onSubmit={formik.handleSubmit}
            >
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Email Address"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="email"
                  value={formik.values.email}
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
          <Typography
        style={{marginTop: 20}}
                color="text.secondary"
                variant="body2"
              >
                &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/login"
                  underline="hover"
                  variant="subtitle2"
                >
                  Click here to Login
                </Link>
              </Typography>

        </Box>
      </Box>
    </>
  );
};

ResetPassword.getLayout = (page) => (
  <AuthLayout>
    {page}
  </AuthLayout>
);

export default ResetPassword;