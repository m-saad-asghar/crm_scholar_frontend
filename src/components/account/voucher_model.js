import { Box, Button, Typography, Modal, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Table } from '@mui/material';
import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import { textAlign } from '@mui/system';
export const VoucherPopup = (props) => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const [cashAccount, setCashAccount] = useState('');
  const [cashAccountCode, setCashAccountCode] = useState('');
  const [loadCashAccount, setLoadCashAccount] = useState([]);
  const [cashAmount, setCashAmount] = useState('');
  const [payeeAccount, setPayeeAccount] = useState('');
  const [payeeAccountCode, setPayeeAccountCode] = useState('');
  const [loadPayeeAccount, setLoadPayeeAccount] = useState([]);
  const [remarks, setRemarks] = useState('');
  const [amount, setAmount] = useState('');
  const [isDebit, setIsDebit] = useState('debit');
  const [isProductLoading, setIsProductLoading] = useState(false);
  const [validationerrors, setValidationerrors] = useState({});
  const [currentId, setCurrentId] = useState('');
  const [tableData, setTableData] = useState([]);
  const [dbData, setDBData] = useState([]);
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
    /*setCurrentId((data && data.id) ? data.id : '')
    setProductBarCode((data && data.product_code != null && data.product_code != undefined) ? data.product_code : '')
    setProductShortName((data && data.product_sname != null && data.product_sname != null) ? data.product_sname : '')
    setProductName((data && data.product_name != null && data.product_name != undefined) ? data.product_name : '')
    setFacePrice((data && data.face_price != null && data.face_price != undefined) ? data.face_price : '')
    setPages((data && data.pages != null && data.pages != undefined) ? data.pages : '')
    setInnerPages((data && data.inner_pages != null && data.inner_pages != undefined) ? data.inner_pages : '')
    setRulePages((data && data.rule_pages != null && data.rule_pages != undefined) ? data.rule_pages : '')
    setFarmay((data && data.farmay != null && data.farmay != undefined) ? data.farmay : '')
    setSheetSize((data && data.book_sheet_size != null && data.book_sheet_size != undefined) ? data.book_sheet_size : 0)
    setTitleSheetSize((data && data.title_sheet_size != null && data.title_sheet_size != undefined) ? data.title_sheet_size : 0)
    setBookWeight((data && data.weight != null && data.weight != undefined) ? data.weight : '')
    setBookFor((data && data.book_for != null && data.book_for != undefined) ? data.book_for : 0)
    setCategory((data && data.category != null && data.category != undefined) ? data.category : 0)
    setSubject((data && data.subject != null && data.subject != undefined) ? data.subject : 0) */
  }, [props.currentData]);

  useEffect(() => {
   /* if(props.currentData == '' || props.currentData == null || props.currentData == undefined){
      resetForm();
    }*/
   

    getAccounts('01-01-%', true);
    getAccounts('%', false);
    
  }, []);

  const getAccounts = (atype, iscash) => {
    fetch(baseUrl + 'get_accounts_by_type/' + atype, {
      method: 'POST',
      headers: {
        'content-Type': 'application/json'
      },
    })
    .then(response => response.json())
    .then(data => {
      
      if(iscash)
      setLoadCashAccount(data.accounts);
      else
      setLoadPayeeAccount(data.accounts);
      
      
    })
    .catch(error => console.error(error));
  }
  
  useEffect(() => {
   totalCashAmount();
     
   }, [tableData]);
  const totalCashAmount = () => {
    let totalAmount = 0;
  tableData.forEach((data) => {
    totalAmount += (parseFloat(data.dr) - parseFloat(data.cr));
  });
  setCashAmount(totalAmount);
  }

  
  const closeVoucher = () => {
    resetForm();
    props.closeVoucher();
    setValidationerrors({})

  };
 const checkDrCrEqual = () => {
let drAmount = 0;
let crAmount = 0;
 tableData.forEach((data) => {
    drAmount += (parseFloat(data.dr));
    crAmount += (parseFloat(data.cr));
  });

  if(drAmount === crAmount)
  return true;
  else
  return false;
 }
  
  const validate = () => {
    let validationerrors = {};
    let isValid = true;
    if (!cashAccount || cashAccount === 0) {
      isValid = false;
      validationerrors["cashAccount"] = "Cash Account is required.";
    }
   
    if (!cashAmount) {
      isValid = false;
      validationerrors["cashAmount"] = "Cash Amount is required.";
    } else if (isNaN(cashAmount) || Number(cashAmount) <= 0) {
      isValid = false;
      validationerrors["cashAmount"] = "Cash Amount must be a positive number.";
    }
   
    
    

    setValidationerrors(validationerrors);

    return isValid;
  }

  const validateAdd = () => {
    let validationerrors = {};
    let isValid = true;
    
    if (!payeeAccount || payeeAccount === '0') {
      isValid = false;
      validationerrors["payeeAccount"] = "Payee Account is required.";
    }
  
    if (!amount) {
      isValid = false;
      validationerrors["amount"] = "Amount is required.";
    } else if (isNaN(amount) || Number(amount) <= 0) {
      isValid = false;
      validationerrors["amount"] = "Amount must be a positive number.";
    }
  
    if (!remarks) {
      isValid = false;
      validationerrors["remarks"] = "Remarks is required.";
    }
    

    setValidationerrors(validationerrors);

    return isValid;
  }

  const submitProduct = () => {
    if (validate()){
      setIsProductLoading(true);
      
      const voucher = {
        account_code: cashAccountCode,
        cash_amount: cashAmount,
      };
      const data = {
        Voucher: voucher,
        inventories: dbData,
      }
      if (currentId == ''){
        addNewProduct(data);
      }else{
        updateProduct(data);
      }
      
    }
    
    
  }

  const addNewProduct = (data) => {
    fetch(baseUrl + 'add_new_account_voucher', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        setIsProductLoading(false);
        if (data.success == 1){
          toast.success("Voucher is Successfully Saved!")
         // props.setProducts(data.products)
        props.closeProductModal();
          resetForm();
        }else{
          toast.error("Something Went Wrong!")
        }
      })
      .catch(error => toast.error("Something Went Wrong!"))
      .finally(() => {
        setIsProductLoading(false);
      });
    closeVoucher(true);
  };

  const updateProduct = (data) => {
    fetch(baseUrl + 'update_product/' + currentId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        console.log("data", data)
        setIsProductLoading(false);
        if (data.success == 1){
          toast.success("Product is Successfully Updated!")
          props.setProducts(data.products)
          props.closeProductModal();
          resetForm();
        }else{
          toast.error("Something Went Wrong!")
        }
      })
      .catch(error => toast.error("Something Went Wrong!"))
      .finally(() => {
        setIsProductLoading(false);
      });
  };

  const resetForm = () => {
    
    setValidationerrors({});
    setCurrentId('');

    setCashAccount('0');
    setPayeeAccount('0');
    setAmount('');
    setRemarks('');
    setIsDebit('debit');
    setTableData([]);
    setDBData([]);
    setCashAmount('');
  };

  const onChangeCashAccount = (e) => {
    setCashAccount(e.target.value);
  }
  const onClickCashAccount = (code) => {
    setCashAccountCode(code);
  }
  const onChangePayeeAccount = (e) => {
    setPayeeAccount(e.target.value);
  }
  const onClickPayeeAccount = (code) => {
    setPayeeAccountCode(code);
  }
  const onChangeAmount = (e) => {
    setAmount(e.target.value);
  }
  const onChangeRemarks = (e) => {
    setRemarks(e.target.value);
  }
const onchangeMode = (e) => {
  setIsDebit(e.target.value);
}
const onClickAddButton = () => {

  if(validateAdd()){
    const rowIndex2 = tableData.findIndex((row) => row.account_name === payeeAccount);
  if(rowIndex2 === -1){
    const newPayeeData = {
      account_name: payeeAccount,
      dr: isDebit === 'debit' ? amount : 0,
      cr: isDebit === 'credit' ? amount : 0,
      remarks: remarks,
    }
    const newPayeeDataDB = {
      account_code: payeeAccountCode,
      dr: isDebit === 'debit' ? amount : 0,
      cr: isDebit === 'credit' ? amount : 0,
      remarks: remarks,
    }
    setTableData((prevTableData) => [...prevTableData, newPayeeData]);
    setDBData((prevDBData) => [...prevDBData, newPayeeDataDB]);
  }
  else{
    const selectedRow = tableData[rowIndex2];
    const updatedTableData = [...tableData];
    const updatedTableDataDB = [...dbData];

    updatedTableData[rowIndex2] = {
      account_name: payeeAccount,
      dr: isDebit === 'debit' ? amount : 0,
      cr: isDebit === 'credit' ? amount : 0,
      remarks: remarks,
    }
    updatedTableDataDB[rowIndex2] = {
      account_code: payeeAccountCode,
      dr: isDebit === 'debit' ? amount : 0,
      cr: isDebit === 'credit' ? amount : 0,
      remarks: remarks,
    }
    setTableData(updatedTableData);
    setDBData(updatedTableDataDB);
  }
  
  
  }

  
}
  return (
  <>
    <ToastContainer />
  <Modal
        open={props.voucherModal}
        onClose={props.closeVoucher}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {currentId == '' ? "+ Add Product" : "Update Product"}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 4 }}>
            {/*<FormControl>*/}
            <Grid container spacing={2} justifyContent="flex-end" alignItems="flex-end">
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <InputLabel htmlFor="cash_account" style={{ position: 'unset' }}>Cash Account</InputLabel>
                <TextField
                  labelId="cash_account"
                  id="cash_account"
                  select
                  onChange={onChangeCashAccount}
                  value={cashAccount}
                  style={{ minWidth: '95%' }}
                  error={Boolean(validationerrors.cashAccount)}
                  helperText={validationerrors.cashAccount || ""}
                  variant="standard"
                >
                  <MenuItem value="0">
                    <em>Select Cash Account</em>
                  </MenuItem>
                  {
                    loadCashAccount.map((account) => (
                      <MenuItem key={account.code} value={account.account_name} onClick={() => onClickCashAccount(account.code)}>
                        {account.account_name}
                      </MenuItem>
                    ) )
                  }
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <InputLabel htmlFor="payee_account" style={{ position: 'unset' }}>Payee Account</InputLabel>
                <TextField
                  labelId="payee_account"
                  id="payee_account"
                  select
                  onChange={onChangePayeeAccount}
                  value={payeeAccount}
                  style={{ minWidth: '95%' }}
                  error={Boolean(validationerrors.payeeAccount)}
                  helperText={validationerrors.payeeAccount || ""}
                  variant="standard"
                >
                  <MenuItem value="0">
                    <em>Select Payee Account</em>
                  </MenuItem>
                  {
                    loadPayeeAccount.map((account) => (
                      <MenuItem key={account.code} value={account.account_name} onClick={() => onClickPayeeAccount(account.code)}>
                        {account.account_name}
                      </MenuItem>
                    ) )
                  }
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
              <InputLabel htmlFor="amount" style={{ position: 'unset' }}>Amount
                  </InputLabel>
                <TextField id="amount" aria-describedby="add-amount"
                       onChange={onChangeAmount} value={amount}
                       error={Boolean(validationerrors.amount)}
                       helperText={validationerrors.amount || ""}
                       InputProps={{ style: textFieldStyles }}/>
              </Grid>
              
              <Grid xs={12} sm={6} md={5} lg ={6}>
              <FormControl>
  <FormLabel id="is_debit">Mode</FormLabel>
  <RadioGroup
    aria-labelledby="is_debit"
    //defaultValue="debit"
    name="radio-buttons-group"
    value={isDebit}
    onChange={onchangeMode}
    row
  >
    <FormControlLabel value="debit" control={<Radio />} label="Debit" />
        <FormControlLabel value="credit" control={<Radio />} label="Credit" />
    
  </RadioGroup>
</FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
              <InputLabel htmlFor="remarks" style={{ position: 'unset' }}>Remarks
                  </InputLabel>
                <TextField id="remarks" aria-describedby="add-remarks"
                       onChange={onChangeRemarks} value={remarks}
                       error={Boolean(validationerrors.remarks)}
                       helperText={validationerrors.remarks || ""}
                       fullWidth
                       InputProps={{ style: textFieldStyles }}/>
              </Grid>
              <Grid item xs={12} sm={2} md={2} lg={2}>
              <Button variant="contained" onClick={onClickAddButton}>Add</Button>
              </Grid>
            
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Table className="table table-striped">
<thead>
  <tr>
    
    <th style={{textAlign: "left"}}>Account</th>
    
    <th style={{textAlign: "right"}}>Dr</th>
    <th style={{textAlign: "right"}}>Cr</th>
    <th style={{textAlign: "center"}}>Remarks</th>
    
  </tr>
</thead>
<tbody>
{tableData.map((rowData, index) => (
  <tr key={index}>
  
  <td style={{textAlign: "left"}}>{rowData.account_name}</td>
  
  <td style={{textAlign: "right"}}>{rowData.dr}</td>
  <td style={{textAlign: "right"}}>{rowData.cr}</td>
  <td style={{textAlign: "left"}}>{rowData.remarks}</td>
  
  
</tr>
))}
</tbody>


            </Table>
              </Grid>
              <Grid item xs={6} sm={3} md={3} lg={3}>
              <InputLabel htmlFor="cash_amount" style={{ position: 'unset' }}>Cash Amount
                  </InputLabel>
                <TextField id="cash_amount" aria-describedby="add-cash-amount"
                       value={cashAmount}
                       error={Boolean(validationerrors.cashAmount)}
                       helperText={validationerrors.cashAmount || ""}
                       InputProps={{ style: textFieldStyles }}/>
              </Grid>
        </Grid>
            {/*</FormControl>*/}
          </Typography>
          <Grid item xs={12} sm={4} md={4} lg={4}
                style={{ marginTop: 15, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" disabled={isProductLoading}  onClick={closeVoucher}>Cancel</Button>
            <Button variant="contained" disabled={isProductLoading} onClick={submitProduct}> {isProductLoading ? (
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