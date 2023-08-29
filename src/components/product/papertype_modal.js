import { Box, Button, Typography, Modal, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Table, Input } from '@mui/material';
import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import { textAlign } from '@mui/system';
import { useSelector } from 'react-redux';
export const PaperTypePopup = (props) => {
  const jwt_token = localStorage.getItem('jwt_token');
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const [paperType, setPaperType] = useState('');
  
  const [validationerrors, setValidationerrors] = useState({});
  const [currentId, setCurrentId] = useState('');
  const [isPaperTypeLoading, setIsPaperTypeLoading] = useState(false);
  
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
    setPaperType((data && data.name != null && data.name != undefined) ? data.name : '')
    
  }, [props.currentData]);

  
  
  const closePaperType = () => {
    resetForm();
    props.closePaperType();
    setValidationerrors({})

  };
 
  
  const validate = () => {
    let validationerrors = {};
    let isValid = true;
    if (!paperType) {
      isValid = false;
      validationerrors["paperType"] = "Paper Type is required.";
    }
   
    setValidationerrors(validationerrors);

    return isValid;
  }

  

  const submitPaperType = () => {
    if (validate()){
      setIsPaperTypeLoading(true);
      
     
      const data = {
        paper_type: paperType,
      }
      if (currentId == ''){
        addNewPaperType(data);
      }else{
        updatePaperType(data);
      }
      
    }
    
    
  }

  const addNewPaperType = (data) => {
    fetch(baseUrl + 'add_new_paper_type', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt_token}`,
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        setIsPaperTypeLoading(false);
        if (data.success == 1){
          toast.success("Paper Type is Successfully Saved!")
          props.setPaperTypes(data.paper_types)
        props.closePaperTypeModal();
          resetForm();
        }else{
          toast.error("Something Went Wrong!")
        }
      })
      .catch(error => toast.error("Something Went Wrong!"))
      .finally(() => {
        setIsPaperTypeLoading(false);
      });
    closePaperType(true);
  };

  const updatePaperType = (data) => {
    fetch(baseUrl + 'update_paper_type/' + currentId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt_token}`,
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        console.log("data", data)
        setIsPaperTypeLoading(false);
        if (data.success == 1){
          toast.success("Paper Type is Successfully Updated!")
          props.setPaperTypes(data.paper_types)
          props.closePaperTypeModal();
          resetForm();
        }else{
          toast.error("Something Went Wrong!")
        }
      })
      .catch(error => toast.error("Something Went Wrong!"))
      .finally(() => {
        setIsPaperTypeLoading(false);
      });
  };

  const resetForm = () => {
    
    setValidationerrors({});
    setCurrentId('');

    setPaperType('');
  };

  const onChangePaperType = (e) => {
    setPaperType(e.target.value);
  }

  return (
  <>
    <ToastContainer />
  <Modal
        open={props.PaperTypeModal}
        onClose={props.closePaperType}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            + Add Paper Type
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 4 }}>
            {/*<FormControl>*/}
            <Grid container spacing={2}>
              {/*<Grid item xs={12} sm={4} md={4} lg={4}>*/}
              {/*  <InputLabel htmlFor="subject_id" style={{ position: 'unset' }}>PaperType Id*/}
              {/*    </InputLabel>*/}
              {/*  <Input id="subject_id" aria-describedby="add-subject-id"*/}
              {/*         onChange={onChangePaperTypeId} value={subjectID}/>*/}
              {/*</Grid>*/}
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <InputLabel htmlFor="subject_name" style={{ position: 'unset' }}>Paper Type</InputLabel>
                <Input id="paper_type" aria-describedby="add-paper_type"
                       onChange={onChangePaperType} value={paperType}
                       error={Boolean(validationerrors.paperType)}
                    helperText={validationerrors.paperType || ""}/>
              </Grid>
              </Grid>
            {/*</FormControl>*/}
          </Typography>
          <Grid item xs={12} sm={4} md={4} lg={4}
                style={{ marginTop: 15, display: 'flex', justifyContent: 'space-between' }}>
            
            <Button variant="contained" onClick={closePaperType}>Cancel</Button>
            <Button variant="contained" onClick={submitPaperType}>Submit</Button>
          </Grid>
        </Box>
      </Modal>
  </>
  );
};