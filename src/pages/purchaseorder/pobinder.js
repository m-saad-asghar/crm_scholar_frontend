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
  import { POPopup } from 'src/components/purchaseorder/pobinder_modal';
  import { useSelector } from 'react-redux';
import { minWidth } from '@mui/system';

const tableHeaders = [
  "Actions",
  "Purchase Order",
  "Vendor Name",
  "Created Date",
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


const usePO = (page, rowsPerPage, pos) => {
  return useMemo(
    () => {
      return applyPagination(pos, page, rowsPerPage);
    },
    [page, rowsPerPage, pos]
  );
};
const usePOIds = (pos) => {
  return useMemo(
    () => {
      return pos.map((po) => po.id);
    },
    [pos]
  );
};


const PO = () => {
  const jwt_token = localStorage.getItem('jwt_token');
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [POModal, setPOModal] = useState(false);
  
  const [pos, setPOs] = useState([]);
  const po_data = usePO(page, rowsPerPage, pos);
  const poIds = usePOIds(pos);
  const [poID, setPOID] = useState('');
  
  
  const poSelection = useSelection(poIds);
  const selectedSome = (poSelection.selected.length > 0) && (poSelection.selected.length < po_data.length);
  const selectedAll = (po_data.length > 0) && (poSelection.selected.length === po_data.length);
  const [currentData, setCurrentData] = useState('');
  const [isDataLoading, setIsDataLoading] = useState(false);
  
  
  

  useEffect(() => {
    getPOs();
    
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

  const getPOs = () => {
    const searchTerm = 'Purchase Order Binder';
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    fetch(baseUrl + 'get_pos/' + encodedSearchTerm , {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt_token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setIsDataLoading(false);
        setPOs(data.pos);
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
                          poSelection.handleSelectAll?.();
                        } else {
                          poSelection.handleDeselectAll?.();
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
    {po_data && po_data.map((po) => {
                  const isSelected = poSelection.selected.includes(po.id);
                  return (
                    <TableRow
                      hover
                      key={po.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={(event) => {
                            if (event.target.checked) {
                              poSelection.handleSelectOne?.(po.id);
                            } else {
                              poSelection.handleDeselectOne?.(po.id);
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
                          <Button><EditIcon style={{ fontSize: '20px' }} onClick={handleUpdatePO.bind(this, po)} /></Button>
                          <Switch defaultChecked={po.active == '1' ? true : false} onChange={onChangeEnable.bind(this, po.id)}/>
                        </Stack>
                      </TableCell>
                      <TableCell style={{minWidth: 50}}>
                        {po.voucher_no}
                      </TableCell>
                      <TableCell style={{minWidth: 50}}>
                        {po.account_name}
                      </TableCell>                     
                      <TableCell style={{minWidth: 50}}>
                        {po.created_date}
                      </TableCell>
                     
                    </TableRow>
                  );
                })}
    </>
  }
  const handleUpdatePO = (data) => {
    getUpdateData(data);
  };
  const onChangeEnable = (id, event) => {
    const data = {
      status: event.target.checked ? '1' : '0',
      id: id
    }
    changeStatus(data);
  };
  const getUpdateData = (data) => {
    setCurrentData(data);
    setPOModal(true);
  };
  const changeStatus = (data) => {
    fetch(baseUrl + 'change_status_po/' + data.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt_token}`,
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
  
  const closePOModal = () => {
    setPOModal(false);
  };
  const closePO = () => {
    console.log('POPress clossPO Click: ')
    setPOModal(false);
    resetForm();
  };
  const openPO = () => {
    setPOModal(true);
  }
  const resetForm = () => {
    
    
    setCurrentData('')
    
  };
  
   
 
  
  const getLatestPOs = (data) => {
    setPOs(data);
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
      <POPopup 
      POModal={POModal}
      closePO={closePO}
      currentData={currentData}
      setPOs={setPOs}
      closePOModal={closePOModal}
      />
      <Head>
        <title>
          Purchase Order for Binder | Scholar CRM
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
              </Stack>
              <div>
                <Button
                  onClick={openPO}
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
            <ProductsSearch sendProducts={getLatestPOs}/>
            <TableComponent
              tableHeader={tableHeader}
              tableBody={tableBody}
              count={pos.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
              sendPOs={getLatestPOs}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

PO.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default PO;