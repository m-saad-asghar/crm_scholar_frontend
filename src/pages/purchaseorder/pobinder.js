import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography, Modal, Table, TextField } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CustomersTable } from 'src/sections/customer/customers-table';
import { VoucherTable } from 'src/sections/purchase/pv_table';
import { ProductsSearch } from 'src/sections/products/products-search';
import { applyPagination } from 'src/utils/apply-pagination';
import FilledInput from '@mui/material/FilledInput';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Paper from '@mui/material/Paper';
import 'bootstrap/dist/css/bootstrap.min.css';
import { borderColor, textAlign } from '@mui/system';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from '@mui/material/CircularProgress';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

const now = new Date();

const data = [
  {
    id: '5e887ac47eed253091be10cb',
    address: {
      city: 'Cleveland',
      country: 'USA',
      state: 'Ohio',
      street: '2849 Fulton Street'
    },
    avatar: '/assets/avatars/avatar-carson-darrin.png',
    createdAt: subDays(subHours(now, 7), 1).getTime(),
    email: 'carson.darrin@devias.io',
    name: 'Carson Darrin',
    phone: '304-428-3097'
  },
  {
    id: '5e887b209c28ac3dd97f6db5',
    address: {
      city: 'Atlanta',
      country: 'USA',
      state: 'Georgia',
      street: '1865  Pleasant Hill Road'
    },
    avatar: '/assets/avatars/avatar-fran-perez.png',
    createdAt: subDays(subHours(now, 1), 2).getTime(),
    email: 'fran.perez@devias.io',
    name: 'Fran Perez',
    phone: '712-351-5711'
  },
  
];

const processData = [
  {id: 7, process: 'Binding'},
 
  
];




const useCustomers = (page, rowsPerPage) => {
  return useMemo(
    () => {
      return applyPagination(data, page, rowsPerPage);
    },
    [page, rowsPerPage]
  );
};
{/*
const useVoucherItems = (page, rowsPerPage) => {
  return useMemo(
    () => {
      const iData = itemData;
      return applyPagination(iData, page, rowsPerPage);
    },
    [page, rowsPerPage]
  );
};
*/}
const useCustomerIds = (customers) => {
  return useMemo(
    () => {
      return customers.map((customer) => customer.id);
    },
    [customers]
  );
};
const useItemIds = (voucherItems) => {
return useMemo( () => {
  return voucherItems.map((voucherItems) => voucherItems.id);
})
};

const Page = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const [tableData, setTableData] = useState([]);
  const [dbData, setDBData] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [addPurchaseOrderModal, setAddPurchaseOrderModal] = useState(false);
  
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
 
  const [processName, setProcessName] = useState('0');
  const [processNameID, setProcessNameID] = useState('0');

  const [laminationType, setLaminationType] = useState('');
  const [laminationTypeID, setLaminationTypeID] = useState('');
  const [loadLaminationType, setLoadLaminationType] = useState([]);
  
  const [isBatchData, setIsBatchData] = useState(false);

  const [loadBatchData, setLoadBachData] = useState([]);
  
  const [isDataLoading, setIsDataLoading] = useState(false);
  const customers = useCustomers(page, rowsPerPage);
  
  const customersIds = useCustomerIds(customers);
  
  const customersSelection = useSelection(customersIds);
  const handlePageChange = useCallback(
    (event, value) => {
      setPage(value);
    },
    []
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      setRowsPerPage(event.target.value);
    },
    []
  );

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
      fetch(baseUrl + 'get_binder_vendors',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then(response => response.json())
      .then(data => {
        setLoadVendors(data.vendors);
       
  
      })
      .catch(error => console.error(error));
    }

    const onChangeVendorName = (e) => {
      setVendorName(e.target.value);
    };
  const openAddPO = () => {

    getVendors();

    
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
    
    setProductRate('');
    setProductAmount('');
    

    setTableData([]);
    setDBData([]);
    
  };
  const addPurchaseOrder = () => {
    setIsDataLoading(true);
    const Voucher = {
      
      vendor_code: vendorCode,
      total_amount: totalAmount,
      
      
    };
    
   
    const data = {
      Voucher: Voucher,
      inventories: dbData,
    };
console.log(data);
    fetch(baseUrl + 'add_new_po_binding', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      setIsDataLoading(false);
      if (data.success == 1){
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
      closeAddPO(true);
  };
  const onClickAddButton = () => {
    const newItem = {
      
      process_name: processName,
      batch_no: batchNos,
      product_name: productName,
      
      print_order: printOrder,
      
      product_rate: productRate,
      product_amount: productAmount,
      pickup_location: pickupLocation,
      
    };

    const newItemDB = {
      
      process_id: processNameID,
      batch_no: batchNos,
      product_id: productNameID,
      
      print_order: printOrder,
      
      product_rate: productRate,
      product_amount: productAmount,
      pickup_location_id: pickupLocationID,
    };

    setTableData((prevTableData) => [...prevTableData, newItem]);
    setDBData((prevDBData) => [...prevDBData, newItemDB]);

    setProcessName('0');
    setBatchNos('0');
    setProductName('');
    setPrintOrder('');
    
    setProductRate('');
    setProductAmount('');
    
    setPickupLocation('');
    

  };


  /*
      It is very important if I want to see immigiate updates  
  useEffect(() => {
    console.log(dbData);
  }, [dbData]);
  */
 
  
  

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

    setLaminationType('0');
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
    setPickupLocation(data.batchData[0]['Received from']);
    setPickupLocationID(data.batchData[0]['Received from ID']);

setPrintOrder(data.batchData[0]['order']);

    
    console.log('Batch Data::: ' + loadBatchData);
   }
    
    else if(data.success === 0){
      setIsBatchData(false);
      
      setProductName('');
      setProductNameID('0');
      setPickupLocation('');

setPrintOrder('');

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
  setPickupLocation('');

setPrintOrder('');

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
  const onChangeLaminationType = (e) => {
    setLaminationType(e.target.value);
  }
  const onClickLaminationType = (id) => {
    setLaminationTypeID(id);
  }
  const onChangePickupLocation = (e) => {
   // setPickupLocation(e.target.value);
  }

  return (
    <>
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
        open={addPurchaseOrderModal}
        onClose={closeAddPO}
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
                <InputLabel htmlFor="product_name" style={{ position: 'unset'}}>Product Name
                  </InputLabel>
                <TextField id="product_name" aria-describedby="add-product_name"
                       onChange={onChangeProductName} value={productName} />
              </Grid>
              <Grid item xs={12} sm={3} md={3} lg={3}>
                <InputLabel htmlFor="print_order" style={{ position: 'unset' }}>Print Order
                  </InputLabel>
                <TextField id="print_order" aria-describedby="add-print_order"
                       onChange={onChangePrintOrder} value={printOrder}/>
              </Grid>
              <Grid item xs={12} sm={3} md={3} lg={3}>
                <InputLabel htmlFor="pickup_location" style={{ position: 'unset' }}>Pickup Location
                  </InputLabel>
                <TextField id="pickup_location" aria-describedby="add-pickup_location"
                       onChange={onChangePickupLocation} value={pickupLocation}/>
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
    <th>Print Order</th>
    <th>Rate</th>
    <th>Amount</th>
    <th>Pickup Location</th>
    
  </tr>
</thead>
<tbody>
{tableData.map((rowData, index) => (
  <tr key={index}>
  
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
      <Head>
        <title>
          Purchase Order For Binder | Scholar CRM
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">
                  Purchase Order For Binder
                </Typography>
                {/*<Stack*/}
                {/*  alignItems="center"*/}
                {/*  direction="row"*/}
                {/*  spacing={1}*/}
                {/*>*/}
                {/*  <Button*/}
                {/*    color="inherit"*/}
                {/*    startIcon={(*/}
                {/*      <SvgIcon fontSize="small">*/}
                {/*        <ArrowUpOnSquareIcon />*/}
                {/*      </SvgIcon>*/}
                {/*    )}*/}
                {/*  >*/}
                {/*    Import*/}
                {/*  </Button>*/}
                {/*  <Button*/}
                {/*    color="inherit"*/}
                {/*    startIcon={(*/}
                {/*      <SvgIcon fontSize="small">*/}
                {/*        <ArrowDownOnSquareIcon />*/}
                {/*      </SvgIcon>*/}
                {/*    )}*/}
                {/*  >*/}
                {/*    Export*/}
                {/*  </Button>*/}
                {/*</Stack>*/}
              </Stack>
              <div>
                <Button
                  onClick={openAddPO}
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <PlusIcon/>
                    </SvgIcon>
                  )}
                  variant="contained"
                >
                  Add Purchase Order
                </Button>
              </div>
            </Stack>
            <ProductsSearch/>
            <CustomersTable
              count={data.length}
              items={customers}
              onDeselectAll={customersSelection.handleDeselectAll}
              onDeselectOne={customersSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={customersSelection.handleSelectAll}
              onSelectOne={customersSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={customersSelection.selected}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
