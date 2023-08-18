import { useCallback, useMemo, useState, useEffect } from 'react';
  import Head from 'next/head';
  import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
  import { Box, Button, Container, Stack, SvgIcon, Typography, Modal, TableRow , TableCell, Checkbox} from '@mui/material';
  import { useSelection } from 'src/hooks/use-selection';
  import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
  import { TableComponent } from 'src/components/table-component';
  import { ProductsSearch } from 'src/sections/products/products-search';
  import { applyPagination } from 'src/utils/apply-pagination';
  import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  import CircularProgress from '@mui/material/CircularProgress';
  import EditIcon from '@mui/icons-material/Edit';
  import Switch from '@mui/material/Switch';
  import { ProductForPopup } from 'src/components/product/productfor_modal';
  import { useSelector } from 'react-redux';
import { minWidth } from '@mui/system';

const tableHeaders = [
  "Actions",
  "Product For",
  
];
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
const useProductFors = (page, rowsPerPage, productFors) => {
  return useMemo(
    () => {
      return applyPagination(productFors, page, rowsPerPage);
    },
    [page, rowsPerPage, productFors]
  );
};
const useProductForsIds = (productFors) => {
  return useMemo(
    () => {
      return productFors.map((product_for) => product_for.id);
    },
    [productFors]
  );
};


const ProductFor = () => {
  const auth_token = useSelector((state) => state.token);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [ProductForModal, setProductForModal] = useState(false);
  
  const [productFors, setProductFors] = useState([]);
  const productFor_data = useProductFors(page, rowsPerPage, productFors);
  const productForsIds = useProductForsIds(productFors);
 
  
  const productForsSelection = useSelection(productForsIds);
  const selectedSome = (productForsSelection.selected.length > 0) && (productForsSelection.selected.length < productFor_data.length);
  const selectedAll = (productFor_data.length > 0) && (productForsSelection.selected.length === productFor_data.length);
  const [currentData, setCurrentData] = useState('');
  const [isProductForLoading, setIsProductForLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  

  useEffect(() => {
    getProductFors();
    
  }, []);


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

  const getProductFors = () => {
    fetch(baseUrl + 'get_book_for_board', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth_token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setIsDataLoading(false);
        setProductFors(data.boards);
      })
      .catch(error => console.error(error));
  }

  const tableHeader = () => {
    return <>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={(selectedAll)}
                      indeterminate={selectedSome}
                      onChange={(event) => {
                        if (event.target.checked) {
                          productForsSelection.handleSelectAll?.();
                        } else {
                          productForsSelection.handleDeselectAll?.();
                        }
                      }}
                    />
                  </TableCell>
                  
                  {tableHeaders && tableHeaders.map((header, index) => (
                    <TableCell key={index} style={{minWidth: 50}}>
                      {header}
                    </TableCell>
                  ))}
    </>
  }
  const tableBody = () => {
    return <>
    {productFor_data && productFor_data.map((productFor) => {
                  const isSelected = productForsSelection.selected.includes(productFor.id);
                  return (
                    <TableRow
                      hover
                      key={productFor.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={(event) => {
                            if (event.target.checked) {
                              productForsSelection.handleSelectOne?.(productFor.id);
                            } else {
                              productForsSelection.handleDeselectOne?.(productFor.id);
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack
                          alignItems="center"
                          direction="row"
                          spacing={2}
                        >
                          <Button><EditIcon style={{ fontSize: '20px' }} onClick={handleUpdateProductFor.bind(this, productFor)} /></Button>
                          <Switch defaultChecked={productFor.active == 1 ? true : false} onChange={onChangeEnable.bind(this, productFor.id)}/>
                        </Stack>
                      </TableCell>
                      <TableCell style={{minWidth: 50}}>
                        {productFor.name}
                      </TableCell>
                     
                    </TableRow>
                  );
                })}
    </>
  }
  const handleUpdateProductFor = (data) => {
    getUpdateData(data);
  };
  const onChangeEnable = (id, event) => {
    const data = {
      status: event.target.checked,
      id: id
    }
    changeStatus(data);
  };
  const getUpdateData = (data) => {
    setCurrentData(data);
    setProductForModal(true);
  };
  const changeStatus = (data) => {
    fetch(baseUrl + 'change_status_book_for_board/' + data.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth_token}`,
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        if (data.success == 0){
          toast.error("Something Went Wrong!")
        }
      })
      .catch(error => toast.error("Something Went Wrong!"))
  };
  
  const openProductFor = () => {
    setProductForModal(true);
  };
  const closeProductFor = () => {
    setProductForModal(false);
    resetForm();
  };
  const resetForm = () => {
    
    
    setCurrentData('')
    
  };
  const closeProductForModal = () => {
    setProductForModal(false);
  }
   
  
  
  const getLatestProductFors = (data) => {
    setProductFors(data);
  };
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
      <ProductForPopup 
      ProductForModal={ProductForModal}
      closeProductFor={closeProductFor}
      currentData={currentData}
      setProductFors={setProductFors}
      closeProductForModal={closeProductForModal}
      />
      <Head>
        <title>
          Product For | Scholar CRM
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
                  Product For
                </Typography>
              </Stack>
              <div>
                <Button
                  onClick={openProductFor}
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <PlusIcon/>
                    </SvgIcon>
                  )}
                  variant="contained"
                >
                  Add Product For
                </Button>
              </div>
            </Stack>
            <ProductsSearch sendProducts={getLatestProductFors}/>
            <TableComponent
              tableHeader={tableHeader}
              tableBody={tableBody}
              count={productFors.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
              sendProductFors={getLatestProductFors}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

ProductFor.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default ProductFor;