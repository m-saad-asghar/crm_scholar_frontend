import { Box, Button, Typography, Modal, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Table, Input, Select } from '@mui/material';
import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import { textAlign } from '@mui/system';
export const PlatePopup = (props) => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const [plate, setPlate] = useState('');
 
  const [loadPlate, setLoadPlate] = useState([]);
  
  const [validationerrors, setValidationerrors] = useState({});
  const [currentId, setCurrentId] = useState('');
  const [isPlateLoading, setIsPlateLoading] = useState(false);
  
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
    setPlate((data && data.plate != null && data.plate != undefined) ? data.plate : '')
    
    
  }, [props.currentData]);

  useEffect(() => {
    if(props.currentData == '' || props.currentData == null || props.currentData == undefined){
        resetForm();
      }
    getPlate();
}, []);

const getPlate = () => {
    fetch(baseUrl + 'get_plates', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
    })
    .then(response => response.json())
      .then(data => {
        
        setLoadPlate(data.plates);
      })
      .catch(error => console.error(error));
  }

  
  const closePlate = () => {
    resetForm();
    props.closePlate();
    setValidationerrors({})

  };
 
  
  const validate = () => {
    let validationerrors = {};
    let isValid = true;
    if (!plate) {
      isValid = false;
      validationerrors["plate"] = "Plate is required.";
    }
    
    setValidationerrors(validationerrors);

    return isValid;
  }

  

  const submitPlate = () => {
    if (validate()){
      setIsPlateLoading(true);
      
     
      const data = {
        plate: plate,
        
      }
      if (currentId == ''){
        addNewPlate(data);
      }else{
        updatePlate(data);
      }
      
    }
    
    
  }

  const addNewPlate = (data) => {
    fetch(baseUrl + 'add_new_plate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        setIsPlateLoading(false);
        if (data.success == 1){
          toast.success("Plate is Successfully Saved!")
          props.setPlates(data.plates)
        props.closePlateModal();
          resetForm();
        }else{
          toast.error("Something Went Wrong!")
        }
      })
      .catch(error => toast.error("Something Went Wrong!"))
      .finally(() => {
        setIsPlateLoading(false);
      });
    closePlate(true);
  };

  const updatePlate = (data) => {
    fetch(baseUrl + 'update_plate/' + currentId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        console.log("data", data)
        setIsPlateLoading(false);
        if (data.success == 1){
          toast.success("Plate is Successfully Updated!")
          props.setPlates(data.plates)
          props.closePlateModal();
          resetForm();
        }else{
          toast.error("Something Went Wrong!")
        }
      })
      .catch(error => toast.error("Something Went Wrong!"))
      .finally(() => {
        setIsPlateLoading(false);
      });
  };

  const resetForm = () => {
    
    setValidationerrors({});
    setCurrentId('');

    setPlate('');
    
  };

  const onChangePlate = (e) => {
    setPlate(e.target.value);
  };
  

  return (
  <>
    <ToastContainer />
  <Modal
        open={props.PlateModal}
        onClose={props.closePlate}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            + Add Plate
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 4 }}>
            {/*<FormControl>*/}
            <Grid container spacing={2}>

              <Grid item xs={12} sm={12} md={12} lg={12}>
                <InputLabel htmlFor="plate" style={{ position: 'unset' }}>Plate</InputLabel>
                <Input id="plate" aria-describedby="add-plate"
                       onChange={onChangePlate} value={plate}
                       error={Boolean(validationerrors.plate)}
                    helperText={validationerrors.plate || ""}/>
              </Grid>
              
              </Grid>
            
            {/*</FormControl>*/}
          </Typography>
          <Grid item xs={12} sm={4} md={4} lg={4}
                style={{ marginTop: 15, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" onClick={closePlate}>Cancel</Button>
            <Button variant="contained" onClick={submitPlate}>Submit</Button>
            
          </Grid>
        </Box>
      </Modal>
  </>
  );
};