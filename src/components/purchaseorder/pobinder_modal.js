import { Box, Button, Typography, Modal, TextField, IconButton, Stack, Autocomplete, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Table, Input } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import { textAlign } from '@mui/system';
import { useSelector } from 'react-redux';
export const POPopup = (props) => {
  const jwt_token = localStorage.getItem('jwt_token');
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
 
  const [tableData, setTableData] = useState([]);
  const [dbData, setDBData] = useState([]);
  const [dbDataOld, setDBDataOld] = useState([]);
  
  const [validationerrors, setValidationerrors] = useState({});
  const [currentId, setCurrentId] = useState('');
  
  const [vendorName, setVendorName] = useState('0');
  const [vendorCode, setVendorCode] = useState('');
  const [loadVendors, setLoadVendors] = useState([]);
  
  const [productName, setProductName] = useState('');
  const [productNameID, setProductNameID] = useState('0');
  
  const [godown, setGodown] = useState('0');
  const [godownID, setGodownID] = useState('0');
  const [loadGodowns, setLoadGodowns] = useState([]);
  
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupLocationID, setPickupLocationID] = useState('');
  

  const [productRate, setProductRate] = useState('');
  const [productAmount, setProductAmount] = useState('');
  const [totalAmount, setTotalAmount] = useState('0');
  

  const [loadBatchNos, setLoadBatchNos] = useState([]);
  const [batchNos, setBatchNos] = useState('0');

  const [printOrder, setPrintOrder] = useState('');
 

  const [billingQty, setBillingQty] = useState('');
  const [platesQty, setPlatesQty] = useState('');
  
  const [processName, setProcessName] = useState('0');
  const [processNameID, setProcessNameID] = useState('0');
  
  const [isBatchData, setIsBatchData] = useState(false);

  const [loadBatchData, setLoadBachData] = useState([]);
 

  const [voucherNo, setVoucherNo] = useState([]);
  
  const [laminationType, setLaminationType] = useState('');
  const [laminationTypeID, setLaminationTypeID] = useState('');
  
  const [isDataLoading, setIsDataLoading] = useState(false);
  
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
  
  const processData = [
    {id: 7, process: 'Binding'},
    
    
  ];
  
  

  useEffect(() => {
    openPurchaseOrder();
    const data = props.currentData;
    if(data && data.id){
      setCurrentId((data && data.id) ? data.id : '')
      if(data && data.id){
        console.log('Voucher No: ' + data.voucher_no)
        setVoucherNo(data.voucher_no)
        setVendorName(data.account_name)
        setVendorCode(data.account_code)
        setPODetail(data.voucher_no)
      }
    }
  }, [props.currentData]);

  

 
  const openPurchaseOrder = () => {

    
      fetch(baseUrl + 'get_binder_vendors',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt_token}`,
        },
      })
      .then(response => response.json())
      .then(data => {
        setLoadVendors(data.vendors);
       
      
      })
      .catch(error => console.error(error));
      
      
      
      

  };
  
  
  const closePO = () => {
    console.log('closePO Click:')
    resetForm();
    
    setValidationerrors({})
    props.closePO();

  };
  
  
const addNewPO = (data) => {
    fetch(baseUrl + 'add_new_po_binding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt_token}`,
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(dt => {
        setIsDataLoading(false);
        if (dt.success == 1){
          toast.success("Purchase Order is Successfully Saved!");
          props.setPOs(dt.pos);
          setPOModal(false);
          // Update Products
        }else{
          toast.error("Something Went Wrong!");
        }
      })
      .catch(error => {
        console.error("Error: ", error);
        toast.error("Something Went Wrong!");
      })
  
      
      .finally(() => {
        //setIsPaperSizeLoading(false);
        setIsDataLoading(false);
      });
}
  
  

  const updatePO = (poinfo) => {
    
    fetch(baseUrl + 'update_po_binding', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt_token}`,
      },
      body: JSON.stringify(poinfo)
    })
      .then(response => response.json())
      .then(data => {
        console.log("data", data)
        setIsDataLoading(false);
        if (data.success == 1){
          toast.success("Purchase Order is Successfully Updated!")
          props.setPOs(data.pos)
          props.closePOModal();
          resetForm();
        }else{
          toast.error("Something Went Wrong!")
        }
      })
      .catch(error => toast.error("Something Went Wrong!"))
      .finally(() => {
        setIsDataLoading(false);
      });
  };

  
 
  
 //-----------------------------------------------------------
 useEffect(() => {
    addTotalAmount();
      
      
     },[tableData]);
      
 const addTotalAmount = () => {
    let totalAmount = 0;
    tableData.forEach((data) => {
      totalAmount += parseFloat(data.product_amount);
    });
    setTotalAmount(totalAmount);
  }
  
const setPODetail = (voucher_no) => {
  fetch(baseUrl + 'get_po_binding_detail/' + voucher_no, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${jwt_token}`,
    },
  })
  .then(response => response.json())
  .then(data => {
    if(data.success == 1){
      data.data.forEach(data => {
        const newItem = {
      
          process_name: data.process_name,
          batch_no: data.batch_no,
          product_name: data.product_name,
          print_order: data.print_order,
          pickup_location: data.pickup_location,
          product_rate: data.product_rate,
          product_amount: data.product_amount,
         
          temp_inventory_id: data.temp_inventory_id,
          
          process_id: data.process_id,
          product_id: data.product_id,
          pickup_location_id: data.pickup_location_id,
          
          
          isbilled: data.isbilled,
          
        };
    
        
        setTableData((prevTableData) => [...prevTableData, newItem]);
        
        setDBDataOld((prevDBDataOld) => [...prevDBDataOld, newItem]);
      })
     
    }
  })
}
const setUpdatedData = () => {

  console.log('dbDataOld Length:', dbDataOld.length);
  console.log('dbData Length:', dbData.length);

  console.log('DB Data: ' + JSON.stringify(dbData));

  const deletedEntries = dbDataOld.filter(original => !tableData.some(newData => original.temp_inventory_id == newData.temp_inventory_id));

  console.log('Deleted Enteries: ' + JSON.stringify(deletedEntries, null, 2))

  //const updatedEntries = tableData.filter(newData => newData.inventory_id != 0);

  //console.log('Updated Enteries: ' + JSON.stringify(updatedEntries, null, 2))

  const insertedEntries = tableData.filter(newData => newData.temp_inventory_id == 0);

  console.log('Insert Enteries: ' + JSON.stringify(insertedEntries, null, 2))

  const entries = {
    deletedEntries: deletedEntries,
    //updatedEntries: updatedEntries,
    insertedEntries: insertedEntries,
  };

  return entries;
  
}


 
  const resetForm = () => {
    
    setVendorName('0');
    
    setProductName('0');
    
    
    
    
    
    setProductRate('');
    setProductAmount('');
    

    setTableData([]);
    setDBData([]);
    
  };

 const submitPO = () => {
    if(!validate()){
      return;
    }
    setIsDataLoading(true);
    const Voucher = {
      voucher:voucherNo,
      vendor_code: vendorCode,
      total_amount: totalAmount,
      
    };
   
    const data = {
      Voucher: Voucher,
      inventories: tableData,
    };

    if (currentId == ''){
      addNewPO(data);
      setIsDataLoading(false)
    }
    else{
      const updateData = {
        Voucher: Voucher,
      inventories: setUpdatedData(),
      }
      updatePO(updateData)
    }
    
    
      closePO(true);
    
  };


 const onClickAddButton = () => {
  if(!addButtonValidation()){
    return;
  }
  const newItem = {
      
    process_name: processName,
    batch_no: batchNos,
    product_name: productName,
    print_order: printOrder,
    
    product_rate: productRate,
    product_amount: productAmount,
    pickup_location: pickupLocation,
    
    temp_inventory_id: 0,
    
    process_id: processNameID,
    product_id: productNameID,
    
    pickup_location_id: pickupLocationID,
    isbilled: 0,
    
  };

  
  if(!checkDuplicateEntry(newItem)){
    

    setTableData((prevTableData) => [...prevTableData, newItem]);
   // setDBData((prevDBData) => [...prevDBData, newItem]);

    setProcessName('0');
    setBatchNos('0');
    setProductName('');
    setPrintOrder('');
    setPickupLocation('');
    
    setProductRate('');
    setProductAmount('');
   
    

  }
  else{
    const indexToUpdate = tableData.findIndex(data => data.batch_no == newItem.batch_no && data.process_id == newItem.process_id);
    const dataToUpdate = tableData[indexToUpdate];
    
    
    dataToUpdate.product_rate = productRate;
    dataToUpdate.product_amount = productAmount;
    

    console.log('After Data to Update: ' + JSON.stringify(dataToUpdate));

    tableData.splice(indexToUpdate, 1, dataToUpdate);
    

    console.log('Index: ' + indexToUpdate);
    setProductName('');
    
    setProductRate('');
    setProductAmount('');
   setLaminationType('0');
   setPickupLocation('');
   setProcessName('0');
   setBatchNos('0');
   
  }    
        

  };
  const checkDuplicateEntry = (data) => {

    tableData.forEach(dt => console.log('duplicate: ' + JSON.stringify(dt) + JSON.stringify(data)));
    const duplicateEntry = tableData.some(entry => (entry.batch_no == data.batch_no && entry.process_id == data.process_id));

    return duplicateEntry;
    

  }
  const onClickDeleteRow = (index) => {
    const selectedRow = tableData[index];
    if(selectedRow['isbilled'] == 0){
      const updatedTableData = [...tableData];

      updatedTableData.splice(index, 1);
      setTableData(updatedTableData);
    }
    else{
      toast.error('Batch No could not be deleted!');
    }
    
    
    
  }
  const addButtonValidation = () => {
    let validationerrors = {};
      let isValid = true;
      if (!processName || processName == '0') {
        isValid = false;
        validationerrors["processName"] = "Process Name is required.";
      }
      if (!batchNos || batchNos == '0'){
        isValid = false;
        validationerrors["batchNos"] = "Batch No. is required.";
      }
      
    
      if (!productRate){
        isValid = false;
        validationerrors["productRate"] = "Product Rate is required.";
      }
      if (isNaN(productRate) || Number(productRate) <= 0) {
        isValid = false;
        validationerrors["productRate"] = "Product Rate must be a positive number.";
      }
      
      if (!productAmount){
        isValid = false;
        validationerrors["productAmount"] = "Product Amount is required.";
      }
      if (isNaN(productAmount) || Number(productAmount) <= 0) {
        isValid = false;
        validationerrors["productAmount"] = "Product Amount must be a positive number.";
      }
      setValidationerrors(validationerrors);
  
      return isValid;
   }
   const validate = () => {
    let validationerrors = {};
    let isValid = true;
    if (!vendorName || vendorName == 0) {
      isValid = false;
      validationerrors["vendorName"] = "Vendor is required.";
    }
    else if (tableData.length == 0){
      isValid = false;
      validationerrors["tableData"] = "Minimum One Entry is required.";
    }
    setValidationerrors(validationerrors);

    return isValid;
  }

 const onChangeVendorName = (e) => {
    setVendorName(e.target.value);
  };
  
  

  const onChangeProductName = (e) => {
    
   // setProductName(e.target.value);

    

  };
 
  
  const onClickVendorName = (vid) => {
    setVendorCode(vid);
  }
  
 
  const onChangeProductRate = (e) => {
    setProductRate(e.target.value);
  };
  const onChangeProductAmount = (e) => {
    setProductAmount(e.target.value);
  };
  
  

  const onChangeProcessName = (e) => {
    setProcessName(e.target.value);

   

  }
  const onClickProcessName = (id) => {
        setProcessNameID(id);
   console.log('Process Id: ' + id);
    fetch(baseUrl + 'get_batches_against_processes/' + id,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt_token}`,
      },
    })
    .then(response => response.json())
    .then(data => {
     
      setLoadBatchNos(data.batches)
      console.log(data.batches);
     // console.log('query: ' + data.query);
     

    })
    .catch(error => console.error(error));

    setBatchNos('0');
    setProductName('');
    
    setPrintOrder('');
   
    
   

  }
  const onChangeBatchNos = (e) => {
    setBatchNos(e.target.value);

    getBatchData(e.target.value, processNameID);

    
  }
  const getBatchData = (batchno, process) => {
if(batchno != 0 && process != 0){
  fetch(baseUrl + 'get_batch_data_for_binding/' + batchno + '/' + process,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt_token}`,
    },
  })
  .then(response => response.json())
  .then(data => {
   if(data.success === 1){
  //  setIsBatchData(true);
  setLoadBachData(data.batchData);

  setProductName(data.batchData[0]['productName']);
  setProductNameID(data.batchData[0]['productID']);
  setPickupLocation(data.batchData[0]['Received from']);
  setPickupLocationID(data.batchData[0]['Received from ID']);

setPrintOrder(data.batchData[0]['order']);

    
    console.log('Batch Data::: ' + loadBatchData);
   }
    
    else if(data.success === 0){
      setIsBatchData(false);
      
      setProductName('');
      setProductNameID('0');

setPrintOrder('');
setPickupLocation('');
      setLoadBachData([]);
      setBatchNos('0');
      
    }
    
    
  })
  .catch(error => console.error(error));
}
else{
  setIsBatchData(false);
  setProductName('');
  setProductNameID('0');

setPrintOrder('');

  setLoadBachData([]);
  

}

  }
  const onClickBatchNos = (value) => {
  
    
  }
  const onChangePrintOrder = (e) => {
    setPrintOrder(e.target.value);
  }
  
  
  
  const onChangePickupLocation = (e) => {
    // setPickupLocation(e.target.value);
   }

  return (
  <>
    <ToastContainer />
    <Modal
        open={isDataLoading}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
          {<CircularProgress
            size={100}
            style={{ position: 'absolute', top: '50%', left: '50%', marginTop: -10, marginLeft: -10, color: '#ffffff' }}
          />}
      </Modal>
      <ToastContainer />
      {/*Add Purchase Voucher Modal*/}
      <Modal
        open={props.POModal}
        onClose={closePO}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            + Add Purchase Order For Binder
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 4 }}>
            {/*<FormControl>*/}
            
            <Grid container spacing={2}>
            
              
              
              <Grid item xs={12} sm={12} md={12} lg={12}>
              <TextField
                  labelId="Vendor"
                  id="Vendor"
                  label="Vendor Name"
                  style={{ minWidth: '95%' }}
                  onChange={onChangeVendorName}
                  value={vendorName}
                  select
                  error={Boolean(validationerrors.vendorName)}
                  helperText={validationerrors.vendorName || ""}
                >
                  <MenuItem value="0">
                    <em>Select Vendor</em>
                  </MenuItem>
                  {
                    loadVendors.map((vendor) => (
                      <MenuItem key = {vendor.code} value={vendor.name}
                      onClick={() => onClickVendorName(vendor.code) }>{vendor.name}</MenuItem>
                    ))
                  }
                  
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
              <TextField
                  labelId="process"
                  id="process"
                  label="Process"
                  style={{ minWidth: '95%' }}
                  onChange={onChangeProcessName}
                  value={processName}
                  select
                  error={Boolean(validationerrors.processName)}
                  helperText={validationerrors.processName || ""}
                >
                  <MenuItem value="0" onClick={() => onClickProcessName(0) }>
                    <em>Select Process</em>
                  </MenuItem>
                  {
                    processData.map((process) => (
                      <MenuItem key = {process.id} value={process.process}
                      onClick={() => onClickProcessName(process.id) }>{process.process}</MenuItem>
                    ))
                  }
                  
                  
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
              <TextField
                  labelId="batch"
                  id="batch"
                  label="Batch"
                  select
                  style={{ minWidth: '95%' }}
                  onChange={onChangeBatchNos}
                  value={batchNos}
                  error={Boolean(validationerrors.batchNos)}
                  helperText={validationerrors.batchNos || ""}
                >
                  <MenuItem value="0" onClick={() => onClickBatchNos(0)}>
                    <em>Select Batch</em>
                  </MenuItem>
                  {
                    loadBatchNos.map((batch) => (
                      <MenuItem key = {batch.batch_no} value={batch.batch_no}
                      onClick={() => onClickBatchNos(batch.batch_no)}>{batch.batch_no}</MenuItem>
                    ))
                  }
                  
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <InputLabel htmlFor="product_name" style={{ position: 'unset' }}
                >Product Name
                  </InputLabel>
                <TextField id="product_name" aria-describedby="add-product_name"
                       onChange={onChangeProductName} value={productName}
                       error={Boolean(validationerrors.productName)}
                helperText={validationerrors.productName || ""}/>
              </Grid>
              <Grid item xs={12} sm={3} md={3} lg={3}>
                <InputLabel htmlFor="print_order" style={{ position: 'unset' }}>Print Order
                  </InputLabel>
                <TextField id="print_order" aria-describedby="add-print_order"
                       onChange={onChangePrintOrder} value={printOrder}
                       error={Boolean(validationerrors.printOrder)}
                helperText={validationerrors.printOrder || ""}/>
              </Grid>
              <Grid item xs={12} sm={3} md={3} lg={3}>
                <InputLabel htmlFor="pickup_location" style={{ position: 'unset' }}>Pickup Location
                  </InputLabel>
                <TextField id="pickup_location" aria-describedby="add-pickup_location"
                       onChange={onChangePickupLocation} value={pickupLocation}
                       error={Boolean(validationerrors.pickupLocation)}
                       helperText={validationerrors.pickupLocation || ""}/>
              </Grid>
              
              
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="product_rate" style={{ position: 'unset' }}>Rate
                  </InputLabel>
                <TextField id="product_rate" aria-describedby="add-product_rate"
                       onChange={onChangeProductRate} value={productRate}
                       error={Boolean(validationerrors.productRate)}
                helperText={validationerrors.productRate || ""}/>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="product_amount" style={{ position: 'unset' }}>Amount
                  </InputLabel>
                <TextField id="product_amount" aria-describedby="add-product_amount"
                       onChange={onChangeProductAmount} value={productAmount}
                       error={Boolean(validationerrors.productAmount)}
                helperText={validationerrors.productAmount || ""}/>
              </Grid>
             
              <Grid item xs={12} sm={2} md={2} lg={2}>
              <Button variant="contained" onClick={onClickAddButton}>Add</Button>
              </Grid>
              
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <div style={{ overflowX: 'auto' }}>

                
        <Table className="table table-striped" style={{ width: '100%' }}>
<thead>
  <tr>
  <th>Action</th>
    <th>Batch No</th>
    
    <th>Process</th>
    <th>Product Name</th>
    
    <th>Print Order</th>
    <th>Rate</th>
    <th>Amount</th>
    <th>Pickup Location</th>
    
  </tr>
</thead>
<tbody>
{tableData.map((rowData, index) => (
  <tr key={index}>
  <td>
  <IconButton onClick={() => onClickDeleteRow(index)} aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </td>
  <td>{rowData.batch_no}</td>
  <td>{rowData.process_name}</td>
  <td>{rowData.product_name}</td>
  <td>{rowData.print_order}</td>
  <td>{rowData.product_rate}</td>
  <td>{rowData.product_amount}</td>
  <td>{rowData.pickup_location}</td>
  
  
</tr>
))}
</tbody>


            </Table>
            </div>
              </Grid>
              
              <Grid item xs={12} sm={12} md={12} lg={12}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <InputLabel htmlFor="total_amount" style={{ position: 'unset', textAlign: 'right'  }}>Total Amount
                  </InputLabel>
                <Input id="total_amount" aria-describedby="add-total_amount"
                        value={totalAmount} inputProps={{ style: { textAlign: 'right' } }}
                        error={Boolean(validationerrors.tableData)}
                helperText={validationerrors.tableData || ""}/>
                        </div>
              </Grid>
              
            </Grid>

            {/* Grid Table */}

            


            {/*</FormControl>*/}
          </Typography>
          <Grid item xs={12} sm={4} md={4} lg={4}
                style={{ marginTop: 15, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" onClick={closePO}>Cancel</Button>
            <Button variant="contained" onClick={submitPO}>Submit</Button>
            
          </Grid>
        </Box>
      </Modal>
    
    </>
  );
};