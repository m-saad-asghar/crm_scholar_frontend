import { Box, Button, Typography, Modal, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Table, Input, Select } from '@mui/material';
import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import { textAlign } from '@mui/system';
export const PaperPopup = (props) => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const [paperName, setPaperName] = useState('');
  const [paperLength, setPaperLength] = useState('');
  const [paperWidth, setPaperWidth] = useState('');
  const [paperWeight, setPaperWeight] = useState('');
  const [paperType, setPaperType] = useState('0');
  const [loadPaperTypes, setLoadPaperTypes] = useState([]);
  
  const [validationerrors, setValidationerrors] = useState({});
  const [currentId, setCurrentId] = useState('');
  const [isPaperLoading, setIsPaperLoading] = useState(false);
  
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
    setPaperName((data && data.paper != null && data.paper != undefined) ? data.paper : '')
    setPaperLength((data && data.length != null && data.length != undefined) ? data.length : '')
    setPaperWidth((data && data.width != null && data.width != undefined) ? data.width : '')
    setPaperWeight((data && data.weight != null && data.weight != undefined) ? data.weight : '')
    setPaperType((data && data.ptype_id != null && data.ptype_id != undefined) ? data.ptype_id : '0')
    
  }, [props.currentData]);

  useEffect(() => {
    if(props.currentData == '' || props.currentData == null || props.currentData == undefined){
        resetForm();
      }
    getPaperTypes();
}, []);

const getPaperTypes = () => {
    fetch(baseUrl + 'get_paper_types', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
    })
    .then(response => response.json())
      .then(data => {
        
        setLoadPaperTypes(data.paper_types);
      })
      .catch(error => console.error(error));
  }

  
  const closePaper = () => {
    resetForm();
    props.closePaper();
    setValidationerrors({})

  };
 
  
  const validate = () => {
    let validationerrors = {};
    let isValid = true;
    if (!paperName) {
      isValid = false;
      validationerrors["paperName"] = "Paper is required.";
    }
    else if (!paperLength) {
        isValid = false;
        validationerrors["paperLength"] = "Paper Length is required.";
      }
      else if (!paperWidth) {
        isValid = false;
        validationerrors["paperWidth"] = "Paper Width is required.";
      }
      else if (!paperWeight) {
        isValid = false;
        validationerrors["paperWeight"] = "Paper Weight is required.";
      }
      else if (!paperType) {
        isValid = false;
        validationerrors["paperType"] = "Paper Type is required.";
      }
    setValidationerrors(validationerrors);

    return isValid;
  }

  

  const submitPaper = () => {
    if (validate()){
      setIsPaperLoading(true);
      
     
      const data = {
        paper: paperName,
        length: paperLength,
        width: paperWidth,
        weight: paperWeight,
        paper_type: paperType,
      }
      if (currentId == ''){
        addNewPaper(data);
      }else{
        updatePaper(data);
      }
      
    }
    
    
  }

  const addNewPaper = (data) => {
    fetch(baseUrl + 'add_new_paper', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        setIsPaperLoading(false);
        if (data.success == 1){
          toast.success("Paper is Successfully Saved!")
          props.setPapers(data.papers)
        props.closePaperModal();
          resetForm();
        }else{
          toast.error("Something Went Wrong!")
        }
      })
      .catch(error => toast.error("Something Went Wrong!"))
      .finally(() => {
        setIsPaperLoading(false);
      });
    closePaper(true);
  };

  const updatePaper = (data) => {
    fetch(baseUrl + 'update_paper/' + currentId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        console.log("data", data)
        setIsPaperLoading(false);
        if (data.success == 1){
          toast.success("Paper is Successfully Updated!")
          props.setPapers(data.papers)
          props.closePaperModal();
          resetForm();
        }else{
          toast.error("Something Went Wrong!")
        }
      })
      .catch(error => toast.error("Something Went Wrong!"))
      .finally(() => {
        setIsPaperLoading(false);
      });
  };

  const resetForm = () => {
    
    setValidationerrors({});
    setCurrentId('');

    setPaperName('');
    setPaperLength('');
    setPaperWidth('');
    setPaperWeight('');
    setPaperType('0');
  };

  const onChangePaperName = (e) => {
    setPaperName(e.target.value);
  };
  const onChangePaperLength = (e) => {
    setPaperLength(e.target.value);
  }
  const onChangePaperWidth = (e) => {
    setPaperWidth(e.target.value);
  }
  const onChangePaperWeight = (e) => {
    setPaperWeight(e.target.value);
  }
  const onChangePaperType = (e) => {
    setPaperType(e.target.value);
  }

  return (
  <>
    <ToastContainer />
  <Modal
        open={props.PaperModal}
        onClose={props.closePaper}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            + Add Paper
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 4 }}>
            {/*<FormControl>*/}
            <Grid container spacing={2}>

              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="paper_size" style={{ position: 'unset' }}>Paper Size</InputLabel>
                <Input id="paper_size" aria-describedby="add-paper-size"
                       onChange={onChangePaperName} value={paperName}
                       error={Boolean(validationerrors.paperName)}
                    helperText={validationerrors.paperName || ""}/>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="paper_length" style={{ position: 'unset' }}>Paper Length</InputLabel>
                <Input id="paper_length" aria-describedby="add-paper-length"
                       onChange={onChangePaperLength} value={paperLength}
                       error={Boolean(validationerrors.paperLength)}
                    helperText={validationerrors.paperLength || ""}/>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="paper_width" style={{ position: 'unset' }}>Paper Width</InputLabel>
                <Input id="paper_width" aria-describedby="add-paper-width"
                       onChange={onChangePaperWidth} value={paperWidth}
                       error={Boolean(validationerrors.paperWidth)}
                    helperText={validationerrors.paperWidth || ""}/>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="paper_weight" style={{ position: 'unset' }}>Paper Weight</InputLabel>
                <Input id="paper_weight" aria-describedby="add-paper-weight"
                       onChange={onChangePaperWeight} value={paperWeight}
                       error={Boolean(validationerrors.paperWeight)}
                    helperText={validationerrors.paperWeight || ""}/>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <Select
                  labelId="paper_type"
                  id="paper_type"
                  label="Paper Type"
                  style={{ minWidth: '95%' }}
                  onChange={onChangePaperType}
                  value={paperType}
                  error={Boolean(validationerrors.paperType)}
                    helperText={validationerrors.paperType || ""}
                >
                  <MenuItem value="0">
                    <em>Select Paper Type</em>
                  </MenuItem>
                  {
                    loadPaperTypes.map((ptypes) => (
                      <MenuItem key={ptypes.id} value={ptypes.id}>
                        {ptypes.name}
                      </MenuItem>
                    ))
                  }
                </Select>
              </Grid>
              </Grid>
            
            {/*</FormControl>*/}
          </Typography>
          <Grid item xs={12} sm={4} md={4} lg={4}
                style={{ marginTop: 15, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" onClick={closePaper}>Cancel</Button>
            <Button variant="contained" onClick={submitPaper}>Submit</Button>
            
          </Grid>
        </Box>
      </Modal>
  </>
  );
};