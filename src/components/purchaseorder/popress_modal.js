import { Box, Button, Typography, Modal, TextField, Stack, Autocomplete, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Table, Input } from '@mui/material';
import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import { textAlign } from '@mui/system';
import { useSelector } from 'react-redux';
export const BatchPopup = (props) => {
  const auth_token = useSelector((state) => state.token);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
 
  const [tableData, setTableData] = useState([]);
  const [dbData, setDBData] = useState([]);

  
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
  
 
  
  const [productQty, setProductQty] = useState('');
  const [productRate, setProductRate] = useState('');
  const [productAmount, setProductAmount] = useState('');
  const [totalAmount, setTotalAmount] = useState('0');
  

  const [loadBatchNos, setLoadBatchNos] = useState([]);
  const [batchNos, setBatchNos] = useState('0');

  const [printOrder, setPrintOrder] = useState('');
  const [paperQty, setPaperQty] = useState('');
  const [paperProduct, setPaperProduct] = useState('');
  const [paperProductID, setPaperProductID] = useState('');

  const [billingQty, setBillingQty] = useState('');
  const [platesQty, setPlatesQty] = useState('');
  
  const [processName, setProcessName] = useState('0');
  const [processNameID, setProcessNameID] = useState('0');
  
  const [isBatchData, setIsBatchData] = useState(false);

  const [loadBatchData, setLoadBachData] = useState([]);
  
  
  
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

  useEffect(() => {
    openBatch();
    const data = props.currentData;
    if(data && data.id){
      setCurrentId((data && data.id) ? data.id : '')
    }
  }, [props.currentData]);

  const loadBatchProcessesForUpdate = (batchNo) => {
    fetch(baseUrl + 'get_processes_of_batch/' + batchNo, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth_token}`,
      },
    })
    .then(response => response.json())
    .then(data => {
      setBatchProcess(data.processes)
    })
    .catch(error => console.error(error));
  }

  const openBatch = () => {

    fetch(baseUrl + 'get_processes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth_token}`,
        },
    })
    .then(response => response.json())
    .then(data => {
        setLoadBactProcesses(data.processes);
    })
    .catch(error => console.error(error));

    fetch(baseUrl + 'get_products_for_batch',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth_token}`,
      },
    })
    .then(response => response.json())
    .then(data => {
      setLoadProducts(data.products);     

    })
    .catch(error => console.error(error));

    fetch(baseUrl + 'get_paper_with_type',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth_token}`,
      },
    })
    .then(response => response.json())
    .then(data => {
      setLoadPaperProduct(data.papers)
    })
    .catch(error => console.error(error));

    
  };
  
  
  const closeBatch = () => {
    resetForm();
    props.closeBatch();
    setValidationerrors({})

  };
  const validate = () => {
    let validationerrors = {};
    let isValid = true;
   
   
    setValidationerrors(validationerrors);

    return isValid;
  }
  const submitBatch = () => {
    if (validate()){
      setIsDataLoading(true);

      const batchInfo = {
        for_product: productID,
        book_print_qty: printOrder,
        book_paper_qty: reamForPages,
        wastage: wastage,
        title_paper_qty: reamForTitle,
        inner_paper_qty: reamForInnerPages,
        rule_paper_qty: reamForRulePages, 
        paper_for_book: paperForBookID,
        paper_for_inner: paperForInnerID,
        paper_for_rule: paperForRuleID,
        paper_for_title: paperForTitleID,
        status: 'Open',
        created_by: 1,
        batch_processes: batchProcess,
        batch_no: batchNo,
  
      };
      if (currentId == ''){
        addNewBatch(batchInfo);
      }else{
        if(isBatchUpdateable(batchNo) == true){
          console.log('Update Submit:')
          updateBatch(batchInfo);
        }
          
      }
      setIsDataLoading(false);      
    }   
  }
const addNewPO = (data) => {
    fetch(baseUrl + 'add_new_po_press', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth_token}`,
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(dt => {
        setIsDataLoading(false);
        if (dt.success == 1){
          toast.success("Purchase Order is Successfully Saved!");
          setAddPurchaseOrderModal(false);
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
  
  const isBatchEntryUpdateable = (batchno) => {
    console.log('Batch Processes: ' + JSON.stringify(batchProcess) )
    fetch(baseUrl + 'check_po_isupdateable/' + pono, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${auth_token}`,
      },
    })
    .then(response => response.json())
    .then(data => {
      if(data.isUpdateable == 1)
      return true;
    else{
      toast.error('You can not update Batch: ' + batchno)
      setIsDataLoading(false);
      return false;
    }
    })
    .catch(error =>{
      toast.error('Something went wrong!')
      setIsDataLoading(false);
      return false;
    }) 
  }

  const updateBatch = (batchinfo) => {
    console.log('Update Batch: ' + JSON.stringify(batchinfo));
    fetch(baseUrl + 'update_batch/' + currentId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth_token}`,
      },
      body: JSON.stringify(batchinfo)
    })
      .then(response => response.json())
      .then(data => {
        console.log("data", data)
        setIsDataLoading(false);
        if (data.success == 1){
          toast.success("Batch is Successfully Updated!")
          props.setBatches(data.batches)
          props.closeBatchModal();
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
  
const getVendors = () => {
fetch(baseUrl + 'get_press_vendors',{
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${auth_token}`,
  },
})
.then(response => response.json())
.then(data => {
  setLoadVendors(data.vendors);
 

})
.catch(error => console.error(error));
};

const getGodowns = () => {
fetch(baseUrl + 'get_godowns',{
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${auth_token}`,
  },
})
.then(response => response.json())
.then(data => {
  setLoadGodowns(data.godowns);
  

})
.catch(error => console.error(error));

};
 const openAddPO = () => {

    getVendors();
    getGodowns();
    
    
    setAddPurchaseOrderModal(true);

    
    
  };

 const closeAddPO = () => {
    resetForm();
    setAddPurchaseOrderModal(false);
    
  };
  const resetForm = () => {
    
    setVendorName('0');
    
    setProductName('0');
    
    
    
    setGodownID('0');
    setGodown('0');
    setProductQty('');
    setProductRate('');
    setProductAmount('');
    

    setTableData([]);
    setDBData([]);
    
  };

 const submitPO = (batchinfo) => {
    
    setIsDataLoading(true);
    const Voucher = {
      
      vendor_code: vendorCode,
      total_amount: totalAmount,
      
    };
   
    const data = {
      Voucher: Voucher,
      inventories: dbData,
    };

    
      closeAddPO(true);
    
  };


 const onClickAddButton = () => {
    const newItem = {
      
      process_name: processName,
      batch_no: batchNos,
      product_name: productName,
      paper_product: paperProduct,
      paper_qty: paperQty,
      print_order: printOrder,
      plates_qty: platesQty,
      product_rate: productRate,
      product_amount: productAmount,
      godown_name: godown,
      
    };

    const newItemDB = {
      
      process_id: processNameID,
      batch_no: batchNos,
      product_id: productNameID,
      paper_product_id: paperProductID,
      paper_qty: paperQty,
      print_order: printOrder,
      plates_qty: platesQty,
      product_rate: productRate,
      product_amount: productAmount,
      godown_id: godownID,
    };

    setTableData((prevTableData) => [...prevTableData, newItem]);
    setDBData((prevDBData) => [...prevDBData, newItemDB]);

    setProcessName('0');
    setBatchNos('0');
    setProductName('');
    setPrintOrder('');
    setPaperProduct('');
    setPaperQty('');
    setBillingQty('');
    setProductRate('');
    setProductAmount('');
    setPlatesQty('');
    setGodown('0');
    

  };


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
        'Content-Type': 'application/json'
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
    setPaperProduct('');
    setPrintOrder('');
    setPaperQty('');
    
   

  }
  const onChangeBatchNos = (e) => {
    setBatchNos(e.target.value);

    getBatchData(e.target.value, processNameID);

    
  }
  const getBatchData = (batchno, process) => {
if(batchno != 0 && process != 0){
  fetch(baseUrl + 'get_batch_data_for_press/' + batchno + '/' + process,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
  })
  .then(response => response.json())
  .then(data => {
   if(data.success === 1){
  //  setIsBatchData(true);
    setLoadBachData(data.batchData);

    setProductName(data.batchData[0]['productName']);
    setProductNameID(data.batchData[0]['productID']);
setPaperProduct(data.batchData[0]['paperProduct']);
setPaperProductID(data.batchData[0]['paperProductID']);
setPrintOrder(data.batchData[0]['order']);
setPaperQty(data.batchData[0]['paperQty']);
    
    console.log('Batch Data::: ' + loadBatchData);
   }
    
    else if(data.success === 0){
      setIsBatchData(false);
      
      setProductName('');
      setProductNameID('0');
setPaperProduct('');
setPaperProductID('0');
setPrintOrder('');
setPaperQty('');
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
setPaperProduct('');
setPaperProductID('0');
setPrintOrder('');
setPaperQty('');
  setLoadBachData([]);
  

}

  }
  const onClickBatchNos = (value) => {
  
    
  }
  const onChangePrintOrder = (e) => {
    setPrintOrder(e.target.value);
  }
  const onChangePaperQty = (e) => {
    setPaperQty(e.target.value);
  }
  const onChangePaperProduct = (e) => {
    setPaperProduct(e.target.value);
  }
  const onChangeBillingQty = (e) => {
    setBillingQty(e.target.value);
  }
  const onChangePlatesQty = (e) => {
    setPlatesQty(e.target.value);
  }
  const onChangeGodown = (e) => {
    setGodown(e.target.value);
  }
  const onClickGodown = (id) => {
setGodownID(id);
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
        open={AddPurchaseOrderModal}
        onClose={closeAddPO}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            + Add Purchase Order For Press
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 4 }}>
            {/*<FormControl>*/}
            
            <Grid container spacing={2}>
            
              
              
              <Grid item xs={12} sm={12} md={12} lg={12}>
              <Select
                  labelId="Vendor"
                  id="Vendor"
                  label="Vendor Name"
                  style={{ minWidth: '95%' }}
                  onChange={onChangeVendorName}
                  value={vendorName}
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
                  
                </Select>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
              <Select
                  labelId="process"
                  id="process"
                  label="Process"
                  style={{ minWidth: '95%' }}
                  onChange={onChangeProcessName}
                  value={processName}
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
                  
                  
                </Select>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
              <Select
                  labelId="batch"
                  id="batch"
                  label="Batch"
                  
                  style={{ minWidth: '95%' }}
                  onChange={onChangeBatchNos}
                  value={batchNos}
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
                  
                </Select>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <InputLabel htmlFor="product_name" style={{ position: 'unset' }}>Product Name
                  </InputLabel>
                <TextField id="product_name" aria-describedby="add-product_name"
                       onChange={onChangeProductName} value={productName}/>
              </Grid>
              <Grid item xs={12} sm={3} md={3} lg={3}>
                <InputLabel htmlFor="print_order" style={{ position: 'unset' }}>Print Order
                  </InputLabel>
                <TextField id="print_order" aria-describedby="add-print_order"
                       onChange={onChangePrintOrder} value={printOrder}/>
              </Grid>
              <Grid item xs={12} sm={3} md={3} lg={3}>
                <InputLabel htmlFor="Billing_qty" style={{ position: 'unset' }}>Billing Qty
                  </InputLabel>
                <TextField id="billing_qty" aria-describedby="add-billing_qty"
                       onChange={onChangeBillingQty} value={billingQty}/>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="paper_product" style={{ position: 'unset' }}>Paper Product
                  </InputLabel>
                <TextField id="paper_product" aria-describedby="add-paper_product"
                       onChange={onChangePaperProduct} value={paperProduct}/>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="paper_qty" style={{ position: 'unset' }}>Paper Qty
                  </InputLabel>
                <TextField id="paper_qty" aria-describedby="add-paper_qty"
                       onChange={onChangePaperQty} value={paperQty}/>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
              <Select
                  labelId="godown"
                  id="godown"
                  label="Godown"
                  
                  style={{ minWidth: '95%' }}
                  onChange={onChangeGodown}
                  value={godown}
                >
                  <MenuItem value="0" onClick={() => onClickGodown(0)}>
                    <em>Select Godown</em>
                  </MenuItem>
                  {
                    loadGodowns.map((godown) => (
                      <MenuItem key = {godown.id} value={godown.name}
                      onClick={() => onClickGodown(godown.id)}>{godown.name}</MenuItem>
                    ))
                  }
                  
                </Select>
              </Grid>

              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="plates_qty" style={{ position: 'unset' }}>Plates Qty
                  </InputLabel>
                <TextField id="plates_qty" aria-describedby="add-paper_qty"
                       onChange={onChangePlatesQty} value={platesQty}/>
              </Grid>
              
                           
              
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="product_rate" style={{ position: 'unset' }}>Rate
                  </InputLabel>
                <TextField id="product_rate" aria-describedby="add-product_rate"
                       onChange={onChangeProductRate} value={productRate}/>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="product_amount" style={{ position: 'unset' }}>Amount
                  </InputLabel>
                <TextField id="product_amount" aria-describedby="add-product_amount"
                       onChange={onChangeProductAmount} value={productAmount}/>
              </Grid>
             
              <Grid item xs={12} sm={2} md={2} lg={2}>
              <Button variant="contained" onClick={onClickAddButton}>Add</Button>
              </Grid>
              
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <div style={{ overflowX: 'auto' }}>

                
        <Table className="table table-striped" style={{ width: '100%' }}>
<thead>
  <tr>
    
    <th>Batch No</th>
    
    <th>Process</th>
    <th>Product Name</th>
    <th>Paper</th>
    <th>Paper Qty</th>
    <th>Print Order</th>
    <th>Plates</th>
    <th>Rate</th>
    <th>Amount</th>
    <th>Godown</th>
    
  </tr>
</thead>
<tbody>
{tableData.map((rowData, index) => (
  <tr key={index}>
  
  <td>{rowData.batch_no}</td>
  <td>{rowData.process_name}</td>
  <td>{rowData.product_name}</td>
  <td>{rowData.paper_product}</td>
  <td>{rowData.paper_qty}</td>
  <td>{rowData.print_order}</td>
  <td>{rowData.plates_qty}</td>
  <td>{rowData.product_rate}</td>
  <td>{rowData.product_amount}</td>
  <td>{rowData.godown_name}</td>
  
  
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
                        value={totalAmount} inputProps={{ style: { textAlign: 'right' } }}/>
                        </div>
              </Grid>
              
            </Grid>

            {/* Grid Table */}

            


            {/*</FormControl>*/}
          </Typography>
          <Grid item xs={12} sm={4} md={4} lg={4}
                style={{ marginTop: 15, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" onClick={closeAddPO}>Cancel</Button>
            <Button variant="contained" onClick={addPurchaseOrder}>Submit</Button>
            
          </Grid>
        </Box>
      </Modal>
    
    </>
  );
};