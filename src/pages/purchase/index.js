import { useCallback, useMemo, useState, useEffect } from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography, Modal, Table } from '@mui/material';
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
import { textAlign } from '@mui/system';
import { ToastContainer, toast } from 'react-toastify';
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

const productData = [
  {
    id: '24',
    code: '1234',
    name: 'Physics',
    rate: 100,

  },
  {
    id: '25',
    code: '1235',
    name: 'Physics',
    rate: 110,
    
  }
]



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
  const [addPurchaseModal, setAddPurchaseModal] = useState(false);

  const [vendorName, setVendorName] = useState('0');
  const [vendorCode, setVendorCode] = useState('');
  const [loadVendors, setLoadVendors] = useState([]);
  const [productType, setProductType] = useState('0');
  const [productName, setProductName] = useState('0');
  const [productID, setProductID] = useState('0');
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

  const openAddPurchase = () => {


    fetch(baseUrl + 'get_p_p_vendors',{
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

    fetch(baseUrl + 'get_godowns',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(response => response.json())
    .then(data => {
      setLoadGodowns(data.godowns);
      console.log("godowns", data.godowns)

    })
    .catch(error => console.error(error));

    setAddPurchaseModal(true);



  };
  const closeAddPurchase = () => {
    resetForm();
    setAddPurchaseModal(false);

  };
  const resetForm = () => {

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

  };
  const addPurchase = () => {
    const Voucher = {

      vendor_code: vendorCode,
      total_amount: totalAmount,


    };




    const data = {
      Voucher: Voucher,
      inventories: dbData,
    };
console.log(data);
    fetch(baseUrl + 'add_new_voucher', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(dt => {
      if (data.success == 1){
        toast.success("Purchase Voucher is Successfully Saved!");
        setAddPurchaseModal(false);
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
      closeAddPurchase(true);
  };
  const onClickAddButton = () => {
    const newItem = {

      product_name: productName,
      product_godown: productGodown,
      product_qty: productQty,
      product_rate: productRate,
      product_amount: productAmount,
      product_for: productForPlates === '0' ? '' : productForPlates,
    };
console.log('productForPlatesID: ' + productForPlatesID);
    const newItemDB = {

      product_id: productID,
      godown_id: productGodownID,
      product_qty: productQty,
      product_rate: productRate,
      product_amount: productAmount,
      product_for: productForPlatesID === '0' ? 0 : productForPlatesID,
    };

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

  };


  /*
      It is very important if I want to see immigiate updates
  useEffect(() => {
    console.log(dbData);
  }, [dbData]);
  */
 useEffect(() => {

  let totalAmount = 0;
  tableData.forEach((data) => {
    totalAmount += parseFloat(data.product_amount);
  });
  setTotalAmount(totalAmount);
  console.log(totalAmount);
 }, [tableData]);
  
  const onChangeVendorName = (e) => {
    setVendorName(e.target.value);
  };
  
  const onChangeProductType = (e) => {
    setProductType(e.target.value);
console.log('Product Type: ' + e.target.value);
    if(e.target.value === '1'){
      fetch(baseUrl + 'get_papers',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then(response => response.json())
      .then(data => {
        setLoadProducts(data.papers);
        console.log("papers", data.papers)
        setLoadProductsForPlates([]);
      })
      .catch(error => console.error(error));
    }
    else if(e.target.value === '2'){
      fetch(baseUrl + 'get_plates',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then(response => response.json())
      .then(data => {
        setLoadProducts(data.plates);
        console.log("plates", data.plates)

      })
      .catch(error => console.error(error));

      fetch(baseUrl + 'get_p_f_plates',{    // Get Active Product ID and Product Name
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then(response => response.json())
      .then(data => {
        setLoadProductsForPlates(data.products);


      })
      .catch(error => console.error(error));
    }
    else{
      setLoadProducts([]);
      setLoadProductsForPlates([]);
    }

    setProductName('0');
  };

  const onChangeProductName = (e) => {
    
    setProductName(e.target.value);

    

  };
  const onClickProduct = (pid) => {
    setProductID(pid);
  }
  const onClickProductName = ( pid) =>{
    const selectedProduct = productData.find(
      (product) => product.id === pid
    );


  if (selectedProduct) {
    setProductCode(selectedProduct.code);
  } else {
    setProductCode('');
  }
  }
  const onChangeProductCode = (e) => {

    setProductCode(e.target.value);



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
        open={addPurchaseModal}
        onClose={closeAddPurchase}
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
                  labelId="product_type"
                  id="product_type"
                  label="Product Type"
                  style={{ minWidth: '95%' }}
                  onChange={onChangeProductType}
                  value={productType}
                >
                  <MenuItem value="0">
                    <em>Select Product Type</em>
                  </MenuItem>
                  <MenuItem value="1">Paper</MenuItem>
                  <MenuItem value="2">Plate</MenuItem>
                  
                </Select>
              </Grid>
              

              <Grid item xs={12} sm={6} md={6} lg={6}>
                <Select
                  labelId="product_name"
                  id="product_name"
                  label="Product Name"
                  style={{ minWidth: '95%' }}
                  onChange={onChangeProductName}
                  
                  value={productName}
                >
                  <MenuItem value="0">
                    <em>Select Product Name</em>
                  </MenuItem>
                  {
                   loadProducts.map((product) => (
                    <MenuItem data-key={product.id} value={productType === '1' ? product.paper : product.plate}
                    onClick={() => onClickProduct(product.id)}>
                      {productType === '1' ? product.paper : product.plate}
                    </MenuItem>
                  ))
                  }


  
                </Select>
              </Grid>

              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="product_qty" style={{ position: 'unset' }}>Qty
                  </InputLabel>
                <Input id="product_qty" aria-describedby="add-product_qty"
                       onChange={onChangeProductQty} value={productQty}/>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="product_rate" style={{ position: 'unset' }}>Rate
                  </InputLabel>
                <Input id="product_rate" aria-describedby="add-product_rate"
                       onChange={onChangeProductRate} value={productRate}/>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="product_amount" style={{ position: 'unset' }}>Amount
                  </InputLabel>
                <Input id="product_amount" aria-describedby="add-product_amount"
                       onChange={onChangeProductAmount} value={productAmount}/>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <Select
                  labelId="product_godown"
                  id="product_godown"
                  label="Product Godown"
                  style={{ minWidth: '95%' }}
                  onChange={onChangeProductGodown}
                  value={productGodown}
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

                </Select>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <Select
                  labelId="product_for_plates"
                  id="product_for_plates"
                  label="Product for Plates"

                  style={{ minWidth: '95%' }}
                  onChange={onChangeProductForPlates}
                  value={productForPlates}
                >
                  <MenuItem value="0">
                    <em>Select Product For Plates</em>
                  </MenuItem>
                  {
                   loadProductsForPlates.map((product) => (
                    <MenuItem data-key={product.id} value={product.name}
                    onClick={() => onClickProductForPlates(product.id)}>
                      {product.name}
                    </MenuItem>
                  ))
                  }

                </Select>
              </Grid>
              <Grid item xs={12} sm={2} md={2} lg={2}>
              <Button variant="contained" onClick={onClickAddButton}>Add</Button>
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={12}>
              <Table className="table table-striped">
<thead>
  <tr>

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
                        value={totalAmount} inputProps={{ style: { textAlign: 'right' } }}/>
                        </div>
              </Grid>

            </Grid>

            {/* Grid Table */}




            {/*</FormControl>*/}
          </Typography>
          <Grid item xs={12} sm={4} md={4} lg={4}
                style={{ marginTop: 15, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" onClick={addPurchase}>Submit</Button>
            <Button variant="contained" onClick={closeAddPurchase}>Cancel</Button>
          </Grid>
        </Box>
      </Modal>
      <Head>
        <title>
          Purchases | Scholar CRM
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
                  Purchases
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
                  onClick={openAddPurchase}
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <PlusIcon/>
                    </SvgIcon>
                  )}
                  variant="contained"
                >
                  Add Purchase
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