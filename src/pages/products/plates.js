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
  import { PlatePopup } from 'src/components/product/plate_modal';
  import { useSelector } from 'react-redux';
import { minWidth } from '@mui/system';

const tableHeaders = [
  "Actions",
  "Plate",
  
];
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  maxHeight: '800px',
  maxWidth: '800px',
  overflowY: 'auto',
  overflowX: 'auto',
};

const now = new Date();


const usePlates = (page, rowsPerPage, plates) => {
  return useMemo(
    () => {
      return applyPagination(plates, page, rowsPerPage);
    },
    [page, rowsPerPage, plates]
  );
};
const usePlatesIds = (plates) => {
  return useMemo(
    () => {
      return plates.map((plate) => plate.id);
    },
    [plates]
  );
};


const Plate = () => {
  const jwt_token = localStorage.getItem('jwt_token');
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [PlateModal, setPlateModal] = useState(false);
  
  const [plates, setPlates] = useState([]);
  const plate_data = usePlates(page, rowsPerPage, plates);
  const platesIds = usePlatesIds(plates);
  
  
  const platesSelection = useSelection(platesIds);
  const selectedSome = (platesSelection.selected.length > 0) && (platesSelection.selected.length < plate_data.length);
  const selectedAll = (plate_data.length > 0) && (platesSelection.selected.length === plate_data.length);
  const [currentData, setCurrentData] = useState('');
  const [isPlateLoading, setIsPlateLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  

  useEffect(() => {
    getPlates();
    
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

  const getPlates = () => {
    fetch(baseUrl + 'get_plates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt_token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setIsDataLoading(false);
        setPlates(data.plates);
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
                          platesSelection.handleSelectAll?.();
                        } else {
                          platesSelection.handleDeselectAll?.();
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
    {plate_data && plate_data.map((plate) => {
                  const isSelected = platesSelection.selected.includes(plate.id);
                  return (
                    <TableRow
                      hover
                      key={plate.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={(event) => {
                            if (event.target.checked) {
                              platesSelection.handleSelectOne?.(plate.id);
                            } else {
                              platesSelection.handleDeselectOne?.(plate.id);
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
                          <Button><EditIcon style={{ fontSize: '20px' }} onClick={handleUpdatePlate.bind(this, plate)} /></Button>
                          <Switch defaultChecked={plate.active == 1 ? true : false} onChange={onChangeEnable.bind(this, plate.id)}/>
                        </Stack>
                      </TableCell>
                      <TableCell style={{minWidth: 50}}>
                        {plate.plate}
                      </TableCell>
                     
                    </TableRow>
                  );
                })}
    </>
  }
  const handleUpdatePlate = (data) => {
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
    setPlateModal(true);
  };
  const changeStatus = (data) => {
    fetch(baseUrl + 'change_status_plate/' + data.id, {
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
  
  const openPlate = () => {
    setPlateModal(true);
  };
  const closePlate = () => {
    setPlateModal(false);
    resetForm();
  };
  const resetForm = () => {
    
    
    setCurrentData('')
    
  };
  const closePlateModal = () => {
    setPlateModal(false);
  }
   
  const onChangePlateName = (e) => {
    setPlateName(e.target.value);
  };
  
  const getLatestPlates = (data) => {
    setPlates(data);
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
      <PlatePopup 
      PlateModal={PlateModal}
      closePlate={closePlate}
      currentData={currentData}
      setPlates={setPlates}
      closePlateModal={closePlateModal}
      />
      <Head>
        <title>
          Plate | Scholar CRM
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
                  Plates
                </Typography>
              </Stack>
              <div>
                <Button
                  onClick={openPlate}
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <PlusIcon/>
                    </SvgIcon>
                  )}
                  variant="contained"
                >
                  Add Plate
                </Button>
              </div>
            </Stack>
            <ProductsSearch sendProducts={getLatestPlates}/>
            <TableComponent
              tableHeader={tableHeader}
              tableBody={tableBody}
              count={plates.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
              sendPlates={getLatestPlates}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Plate.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Plate;