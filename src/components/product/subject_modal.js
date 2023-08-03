import { Box, Button, Typography, Modal, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Table, Input } from '@mui/material';
import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import { textAlign } from '@mui/system';
export const SubjectPopup = (props) => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const [subjectName, setSubjectName] = useState('');
  
  const [validationerrors, setValidationerrors] = useState({});
  const [currentId, setCurrentId] = useState('');
  const [isSubjectLoading, setIsSubjectLoading] = useState(false);
  
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    overflowY: 'auto',
    overflowX: 'auto',
  };
  const textFieldStyles = {
    borderColor: 'blue', // Set your desired border color
  };

  useEffect(() => {
    const data = props.currentData;
    setCurrentId((data && data.id) ? data.id : '')
    setSubjectName((data && data.subject != null && data.subject != undefined) ? data.subject : '')
    
  }, [props.currentData]);

  
  
  const closeSubject = () => {
    resetForm();
    props.closeSubject();
    setValidationerrors({})

  };
 
  
  const validate = () => {
    let validationerrors = {};
    let isValid = true;
    if (!subjectName) {
      isValid = false;
      validationerrors["subjectName"] = "Subject is required.";
    }
   
    setValidationerrors(validationerrors);

    return isValid;
  }

  

  const submitSubject = () => {
    if (validate()){
      setIsSubjectLoading(true);
      
     
      const data = {
        subject: subjectName,
      }
      if (currentId == ''){
        addNewSubject(data);
      }else{
        updateSubject(data);
      }
      
    }
    
    
  }

  const addNewSubject = (data) => {
    fetch(baseUrl + 'add_new_subject', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        setIsSubjectLoading(false);
        if (data.success == 1){
          toast.success("Subject is Successfully Saved!")
          props.setSubjects(data.subjects)
        props.closeSubjectModal();
          resetForm();
        }else{
          toast.error("Something Went Wrong!")
        }
      })
      .catch(error => toast.error("Something Went Wrong!"))
      .finally(() => {
        setIsSubjectLoading(false);
      });
    closeSubject(true);
  };

  const updateSubject = (data) => {
    fetch(baseUrl + 'update_subject/' + currentId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        console.log("data", data)
        setIsSubjectLoading(false);
        if (data.success == 1){
          toast.success("Subject is Successfully Updated!")
          props.setSubjects(data.subjects)
          props.closeSubjectModal();
          resetForm();
        }else{
          toast.error("Something Went Wrong!")
        }
      })
      .catch(error => toast.error("Something Went Wrong!"))
      .finally(() => {
        setIsSubjectLoading(false);
      });
  };

  const resetForm = () => {
    
    setValidationerrors({});
    setCurrentId('');

    setSubjectName('');
  };

  const onChangeSubjectName = (e) => {
    setSubjectName(e.target.value);
  }

  return (
  <>
    <ToastContainer />
  <Modal
        open={props.SubjectModal}
        onClose={props.closeSubject}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            + Add Subject
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 4 }}>
            {/*<FormControl>*/}
            <Grid container spacing={2}>
              {/*<Grid item xs={12} sm={4} md={4} lg={4}>*/}
              {/*  <InputLabel htmlFor="subject_id" style={{ position: 'unset' }}>Subject Id*/}
              {/*    </InputLabel>*/}
              {/*  <Input id="subject_id" aria-describedby="add-subject-id"*/}
              {/*         onChange={onChangeSubjectId} value={subjectID}/>*/}
              {/*</Grid>*/}
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <InputLabel htmlFor="subject_name" style={{ position: 'unset' }}>Subject Name</InputLabel>
                <Input id="subject_name" aria-describedby="add-subject-name"
                       onChange={onChangeSubjectName} value={subjectName}
                       error={Boolean(validationerrors.subjectName)}
                    helperText={validationerrors.subjectName || ""}/>
              </Grid>
              </Grid>
            {/*</FormControl>*/}
          </Typography>
          <Grid item xs={12} sm={4} md={4} lg={4}
                style={{ marginTop: 15, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" onClick={submitSubject}>Submit</Button>
            <Button variant="contained" onClick={closeSubject}>Cancel</Button>
          </Grid>
        </Box>
      </Modal>
  </>
  );
};