import { Box, Button, Typography, Modal, TextField, IconButton, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Table, Input, Select, FormHelperText } from '@mui/material';
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
import PaperType from 'src/pages/products/papertype';
//import { json } from 'stream/consumers';
export const PurchasePopup = (props) => {
  const jwt_token = localStorage.getItem('jwt_token');
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const [tableData, setTableData] = useState([]);
  const [dbData, setDBData] = useState([]);
  const [dbDataOld, setDBDataOld] = useState([]);
  const [vendorName, setVendorName] = useState('0');
  const [vendorCode, setVendorCode] = useState('');
  const [loadVendors, setLoadVendors] = useState([]);
  const [productType, setProductType] = useState('0');
  const [productName, setProductName] = useState('0');
  const [productID, setProductID] = useState(0);
  const [loadProducts, setLoadProducts] = useState([]);
  
  const [productGodown, setProductGodown] = useState('0');
  const [productGodownID, setProductGodownID] = useState('');
  const [loadGodowns, setLoadGodowns] = useState([]);
  const [productQty, setProductQty] = useState('');
  const [productRate, setProductRate] = useState('');
  const [productAmount, setProductAmount] = useState('');
  const [totalAmount, setTotalAmount] = useState('0');
  const [productForPlates, setProductForPlates] = useState('0');
  const [productForPlatesID, setProductForPlatesID] = useState('0');
  const [loadProductsForPlates, setLoadProductsForPlates] = useState([]);
  const [isDuplicateEntry, setIsDuplicateEntry] = useState(false);

  const [productForPlatesLabel, setProductForPlatesLabel] = useState('Select');
  
  const [voucherNo, setVoucherNo] = useState('');
  
  const [isDataLoading, setIsDataLoading] = useState(false);
  
  const [validationerrors, setValidationerrors] = useState({});
  const [currentId, setCurrentId] = useState('');
  
  
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
    setVendorName((data && data.account_name) ? data.account_name : 0)
    setVoucherNo((data && data.voucher_no)? data.voucher_no : 0)

    if(data && data.id){
      getVoucherData(data.voucher_no);
    }
    
  }, [props.currentData]);

  useEffect(() => {
    if(props.currentData == '' || props.currentData == null || props.currentData == undefined){
        resetForm();
      }
    getPaperTypes();
    getPPVendors();
}, []);

const getVoucherData = (Voucher) => {
fetch(baseUrl + 'get_pv_voucher_data/' + Voucher, {
  method: 'POST',
  headers : {
    'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt_token}`,
  },
})
.then(response => response.json())
.then(data => {
  loadDataInTable(data.inventories)
  console.log(data.inventories)
})
}
const loadDataInTable = (inventories) => {

  inventories.map((inventory) => {

    const newItem = {
      
      product_name: inventory.product_name,
      product_godown: inventory.godownName,
      product_qty: inventory.qtyin,
      product_rate: inventory.rate,
      product_amount: inventory.amount,
      produduct_for: inventory.productFor === null ? '' : inventory.productFor,
      //product_for: productForPlates === '0' ? '' : productForPlates,
    };

    const newItemDB = {
      
      product_id: inventory.description,
      godown_id: inventory.godown,
      product_qty: inventory.qtyin,
      product_rate: inventory.rate,
      product_amount: inventory.amount,
      product_for: inventory.product_for,
      inventory_id: inventory.id,
      //product_for: productForPlatesID === '0' ? 0 : productForPlatesID,
    };
console.log('Load Inventory: ' + JSON.stringify(newItemDB));
    setTableData((prevTableData) => [...prevTableData, newItem]);
    setDBData((prevDBData) => [...prevDBData, newItemDB]);
    setDBDataOld((prevDBDataOld) => [...prevDBDataOld, newItemDB]);


  });
}

const setUpdatedData = () => {

  console.log('dbDataOld Length:', dbDataOld.length);
  console.log('dbData Length:', dbData.length);

  console.log('DB Data: ' + JSON.stringify(dbData));

  const deletedEntries = dbDataOld.filter(original => !dbData.some(newData => original.inventory_id == newData.inventory_id));

  console.log('Deleted Enteries: ' + JSON.stringify(deletedEntries, null, 2))

  const updatedEntries = dbData.filter(newData => newData.inventory_id != 0);

  console.log('Updated Enteries: ' + JSON.stringify(updatedEntries, null, 2))

  const insertedEntries = dbData.filter(newData => newData.inventory_id == 0);

  console.log('Insert Enteries: ' + JSON.stringify(insertedEntries, null, 2))

  const entries = {
    deletedEntries: deletedEntries,
    updatedEntries: updatedEntries,
    insertedEntries: insertedEntries,
  };

  return entries;
  
}

const getPPVendors = () => {
    fetch(baseUrl + 'get_p_p_vendors',{
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
  
      fetch(baseUrl + 'get_godowns',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt_token}`,
        },
      })
      .then(response => response.json())
      .then(data => {
        setLoadGodowns(data.godowns);
        console.log("godowns", data.godowns)
  
      })
      .catch(error => console.error(error));
}
const onClickDeleteRow = (index) => {
  const updatedTableData = [...tableData];
  updatedTableData.splice(index, 1);
  setTableData(updatedTableData);
  
  const updatedDBData = [...dbData];
  updatedDBData.splice(index, 1);
  setDBData(updatedDBData);
}
const onClickAddButton = () => {
  if(addButtonValidation()){
    const newItem = {
      
      product_name: productName,
      product_godown: productGodown,
      product_qty: productQty,
      product_rate: productRate,
      product_amount: productAmount,
      product_for: productType == '3' ? productForPlates : '' ,
    };

    const newItemDB = {
      
      product_id: productID,
      godown_id: productGodownID,
      product_qty: productQty,
      product_rate: productRate,
      product_amount: productAmount,
      product_for: productType == '3' ? productForPlates : '' ,
      inventory_id: 0,
    };
    console.log('Add Inventory: ' + JSON.stringify(newItemDB));
    if(!checkDuplicateEntry(newItemDB)){
      setTableData((prevTableData) => [...prevTableData, newItem]);
      setDBData((prevDBData) => [...prevDBData, newItemDB]);
  
      setProductName('0');
      setProductQty('');
      setProductRate('');
      setProductAmount('');
      setProductGodown('0');
      setProductGodownID('0');
      setProductForPlates('0');
      setProductForPlatesID('0');

    }
    else{
      const indexToUpdate = dbData.findIndex(data => data.product_id == newItemDB.product_id && data.godown_id == newItemDB.godown_id);
      const dataToUpdate = dbData[indexToUpdate];
      console.log('Data to Update: ' + JSON.stringify(dataToUpdate));
      dataToUpdate.product_qty = productQty;
      dataToUpdate.product_rate = productRate;
      dataToUpdate.product_amount = productAmount;

      console.log('After Data to Update: ' + JSON.stringify(dataToUpdate));

      dbData.splice(indexToUpdate, 1, dataToUpdate);
      tableData.splice(indexToUpdate, 1, newItem);

      console.log('Index: ' + indexToUpdate);
      setProductName('0');
      setProductQty('');
      setProductRate('');
      setProductAmount('');
      setProductGodown('0');
      setProductGodownID('0');
      setProductForPlates('0');
      setProductForPlatesID('0');
      

    }    
  }  
  functSetTotalAmount();
  };
  const checkDuplicateEntry = (data) => {

    dbData.forEach(dt => console.log('duplicate: ' + JSON.stringify(dt) + JSON.stringify(data)));
    const duplicateEntry = dbData.some(entry => (entry.product_id == data.product_id && entry.godown_id == data.godown_id));

    return duplicateEntry;
    

  }
  useEffect(() => {
  
    functSetTotalAmount();
    
   }, [tableData]);

   const functSetTotalAmount = () => {
    let totalAmount = 0;
    tableData.forEach((data) => {
      totalAmount += parseFloat(data.product_amount);
    });
    setTotalAmount(totalAmount);

   }

const getPaperTypes = () => {
    fetch(baseUrl + 'get_paper_types', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt_token}`,
          },
    })
    .then(response => response.json())
      .then(data => {
        console.log(data.paper_types);
        setLoadPaperTypes(data.paper_types);
      })
      .catch(error => console.error(error));
  }

  
  const closePurchaseVoucher = () => {
    resetForm();
    props.closePurchaseVoucher();
    setValidationerrors({})

  };
 
  
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
 const addButtonValidation = () => {
  let validationerrors = {};
    let isValid = true;
    if (!productType || productType == 0) {
      isValid = false;
      validationerrors["productType"] = "Product Type is required.";
    }
    if (!productType || productType == 0){
      isValid = false;
      validationerrors["productType"] = "Product Type is required.";
    }
    if (!productForPlates || productForPlates == 0){
      isValid = false;
      validationerrors["productForPlates"] = "Paper Type is required.";
    }
    if (!productName || productName == 0){
      isValid = false;
      validationerrors["productName"] = "Product Name is required.";
    }
    if (!productType || productType == 0){
      isValid = false;
      validationerrors["productType"] = "Product Type is required.";
    }
    if (!productGodown || productGodown == 0){
      isValid = false;
      validationerrors["productGodown"] = "Godown is required.";
    }
    if (!productRate){
      isValid = false;
      validationerrors["productRate"] = "Product Rate is required.";
    }
    if (isNaN(productRate) || Number(productRate) <= 0) {
      isValid = false;
      validationerrors["productRate"] = "Product Rate must be a positive number.";
    }
    if (!productQty){
      isValid = false;
      validationerrors["productQty"] = "Product Quantity is required.";
    }
    if (isNaN(productQty) || Number(productQty) <= 0) {
      isValid = false;
      validationerrors["productQty"] = "Product Quantity must be a positive number.";
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
  

  const submitVoucher = () => {
    if (validate()){
      setIsDataLoading(true);      
     
      const Voucher = {
      
        vendor_code: vendorCode,
        total_amount: totalAmount,
        voucher_no: voucherNo,
       
      };
      
      const data = {
        Voucher: Voucher,
        inventories: dbData,
      };
      if (currentId == ''){
        addNewVoucher(data);
      }else{
        const updateData = {
          Voucher: Voucher,
        inventories: setUpdatedData(),
        }
        updateNewVoucher(updateData);
      }
      
    }
    
    
  }

  const addNewVoucher = (data) => {
    const searchTerm = 'Purchase Voucher PP';
const encodedSearchTerm = encodeURIComponent(searchTerm);
    fetch(baseUrl + 'add_new_voucher/' + encodedSearchTerm, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt_token}`,
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
        if (data.success == 1){
          props.setVouchers(data.vouchers);
          toast.success("Purchase Voucher is Successfully Saved!");
          
          props.closePurchaseVoucherModal();
          resetForm();
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
      });
      closePurchaseVoucher(true);
  };

  const updateNewVoucher = (data) => {
    

    fetch(baseUrl + 'update_purchase_voucher', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt_token}`,
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success == 1){
        props.setVouchers(data.vouchers);
        toast.success("Purchase Voucher is Successfully Updated!");
        
        props.closePurchaseVoucherModal();
        resetForm();
        // Update Products
      }else{
        toast.error("Something Went Wrong!");
  }})
  .catch(error => {
    console.error("Error: ", error);
    toast.error("Something Went Wrong!");
  })  
  .finally(() => {
    //setIsPaperSizeLoading(false);
  });
  closePurchaseVoucher(true);
  };

  const resetForm = () => {
    
    setValidationerrors({});
    setCurrentId('');

    setVendorName('0');
    setProductType('0');
    setProductName('0');
    setLoadProducts([]);
    setLoadProductsForPlates([]);
    
    setProductGodownID('0');
    setProductGodown('0');
    setProductQty('');
    setProductRate('');
    setProductAmount('');
    setProductForPlates('0');
    setProductForPlatesID('0');

    setTableData([]);
    setDBData([]);
    setDBDataOld([]);
  };

  const onChangeVendorName = (e) => {
    setVendorName(e.target.value);
  };
  
  const onChangeProductType = (e) => {            // Paper: 2, Plate: 3
    
    setProductType(e.target.value);
    console.log('Product Type: ' + e.target.value);
   
    if(e.target.value === '2'){                   // Select Paper

      setProductForPlatesLabel('Select Paper Type')


      // Fetch Paper Types like Paper, Art Paer, Bleach Card, etc
      fetch(baseUrl + 'get_paper_types',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt_token}`,
        },
      })
      .then(response => response.json())
      .then(data => {
       
        // Load Paper Types like Paper Types like Paper, Art Paer, Bleach Card, etc
        setLoadProductsForPlates(data.paper_types);
        setProductForPlates('0');

      })
      .catch(error => console.error(error));
    }

    else if(e.target.value === '3'){
      setProductForPlatesLabel('Select Product For Plates')

      fetch(baseUrl + 'get_p_f_plates',{    // Get Active Product ID and Product Name
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt_token}`,
        },
      })
      .then(response => response.json())
      .then(data => {
        setLoadProductsForPlates(data.products);
        
  
      })
      .catch(error => console.error(error));

      fetch(baseUrl + 'get_plate_with_id',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt_token}`,
        },
      })
      .then(response => response.json())
      .then(data => {
        setLoadProducts(data.plates);
        
  
      })
      .catch(error => console.error(error));

      
    }
    else{
      setLoadProducts([]);
      setLoadProductsForPlates([]);
      setProductForPlatesLabel('Select');
    }

    setProductName('0');
    setProductForPlates('0');
  };

  const onChangeProductName = (e) => {
    
    setProductName(e.target.value);

    

  };
  const onClickProduct = (pid) => {
    setProductID(pid);
  }
  
  const onClickVendorName = (vid) => {
    setVendorCode(vid);
  }
  
  const onChangeProductGodown = (e) => {
    setProductGodown(e.target.value);
    console.log('Godown Name: ' + e.target.value);
    
  };
  const onClickGodown = (gid) => {
    setProductGodownID(gid);
    console.log('Godown ID: ' + gid);
  };
  function onChangeProductQty(e) {
    setProductQty(e.target.value);
  }
  const onChangeProductRate = (e) => {
    setProductRate(e.target.value);
  };
  const onChangeProductAmount = (e) => {
    setProductAmount(e.target.value);
  };
  const onChangeProductForPlates = (e) => {
    setProductForPlates(e.target.value);

    

  }
  const onClickProductForPlates = (pid) => {
    setProductForPlatesID(pid);

    console.log('Product Type: ' + pid);
    if(productType === '2'){
      
      if(pid === 0){
        setLoadProducts([]);
      }
      else{
// load Paper Products in Products
fetch(baseUrl + 'get_paper_with_id/' + pid ,{
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${jwt_token}`,
  },
})
.then(response => response.json())
.then(data => {
  setLoadProducts(data.papers);
  console.log("papers", data.papers)
 // setLoadProductsForPlates([]);

})
.catch(error => console.error(error));

      }

    }
  }

  return (
  <>
    <ToastContainer />
  <Modal
        open={props.PurchaseVoucherModal}
        onClose={props.closePurchaseVoucher}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            + Add Purchase
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 4 }}>
            {/*<FormControl>*/}
            
            <Grid container spacing={2}>
            
              
              
              <Grid item xs={12} sm={12} md={12} lg={12}>
              <TextField
                  labelId="Vendor"
                  id="Vendor"
                  label="Vendor Name"
                  select
                  style={{ minWidth: '95%' }}
                  onChange={onChangeVendorName}
                  value={vendorName}
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
                  labelId="product_type"
                  id="product_type"
                  label="Product Type"
                  select
                  style={{ minWidth: '95%' }}
                  onChange={onChangeProductType}
                  value={productType}
                  error={Boolean(validationerrors.productType)}
                  helperText={validationerrors.productType || ""}
                >
                  <MenuItem value="0">
                    <em>Select Product Type</em>
                  </MenuItem>
                  <MenuItem value="2">Paper</MenuItem>
                  <MenuItem value="3">Plate</MenuItem>
                  
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextField
                  labelId="product_for_plates"
                  id="product_for_plates"
                  label="Product for Plates"
                  select
                  style={{ minWidth: '95%' }}
                  onChange={onChangeProductForPlates}
                  value={productForPlates}
                  error={Boolean(validationerrors.productForPlates)}
                  helperText={validationerrors.productForPlates || ""}
                >
                  <MenuItem value="0"
                  onClick={() => onClickProductForPlates(0)}>
                    <em>{productForPlatesLabel}</em>
                  </MenuItem>
                  {
                   loadProductsForPlates.map((product) => (
                    <MenuItem data-key={product.id} value={product.name} 
                    onClick={() => onClickProductForPlates(product.id)}>
                      {product.name}
                    </MenuItem>
                  ))
                  }
                  
                </TextField>
              </Grid>
              
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextField
                  labelId="product_name"
                  id="product_name"
                  label="Product Name"
                  style={{ minWidth: '95%' }}
                  onChange={onChangeProductName}
                  select
                  value={productName}
                  error={Boolean(validationerrors.productName)}
                  helperText={validationerrors.productName || ""}
                >
                  <MenuItem value="0">
                    <em>Select Product Name</em>
                  </MenuItem>
                  {
                   loadProducts.map((product) => (
                    <MenuItem data-key={product.id} value={productType === '2' ? product.paper : product.plate} 
                    onClick={() => onClickProduct(product.id)}>
                      {productType === '2' ? product.paper : product.plate}
                    </MenuItem>
                  ))
                  }


  
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextField
                  labelId="product_godown"
                  id="product_godown"
                  label="Product Godown"
                  style={{ minWidth: '95%' }}
                  select
                  onChange={onChangeProductGodown}
                  value={productGodown}
                  error={Boolean(validationerrors.productGodown)}
                  helperText={validationerrors.productGodown || ""}
                >
                  <MenuItem value="0">
                    <em>Select Godown</em>
                  </MenuItem>
                  {
                   loadGodowns.map((godown) => (
                    <MenuItem data-key={godown.id} value={godown.name} 
                    onClick={() => onClickGodown(godown.id)}>
                      {godown.name}
                    </MenuItem>
                  ))
                  }
                  
                </TextField>
              </Grid>
              
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="product_qty" style={{ position: 'unset' }}>Qty
                  </InputLabel>
                <TextField id="product_qty" aria-describedby="add-product_qty"
                       onChange={onChangeProductQty} value={productQty}
                       error={Boolean(validationerrors.productQty)}
                  helperText={validationerrors.productQty || ""}/>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="product_rate" style={{ position: 'unset' }}>Rate
                  </InputLabel>
                <TextField id="product_rate" aria-describedby="add-product_rate"
                       onChange={onChangeProductRate} value={productRate}
                       error={Boolean(validationerrors.productQty)}
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
              <Table className="table table-striped"
              >
<thead>
  <tr>
    <th>Action</th>
    <th>Product Name</th>
    
    <th>Qty</th>
    <th>Rate</th>
    <th>Amount</th>
    <th>Godown</th>
    <th>For Product</th>
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
  <td>{rowData.product_name}</td>
  
  <td>{rowData.product_qty}</td>
  <td>{rowData.product_rate}</td>
  <td>{rowData.product_amount}</td>
  <td>{rowData.product_godown}</td>
  <td>{rowData.product_for}</td>
  
</tr>
))}
</tbody>


            </Table>
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
            <Button variant="contained" onClick={closePurchaseVoucher}>Cancel</Button>
            <Button variant="contained" onClick={submitVoucher}>Submit</Button>
            
          </Grid>
        </Box>
      </Modal>
  </>
  );
};