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
  import { PaperTypePopup } from 'src/components/product/papertype_modal';
  import { useSelector } from 'react-redux';
import { minWidth } from '@mui/system';

const tableHeaders = [
  "Actions",
  "Paper Type",
  
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
const usePaperTypes = (page, rowsPerPage, paperTypes) => {
  return useMemo(
    () => {
      return applyPagination(paperTypes, page, rowsPerPage);
    },
    [page, rowsPerPage, paperTypes]
  );
};
const usePaperTypesIds = (paperTypes) => {
  return useMemo(
    () => {
      return paperTypes.map((paper_type) => paper_type.id);
    },
    [paperTypes]
  );
};


const PaperType = () => {
  const jwt_token = localStorage.getItem('jwt_token');
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [PaperTypeModal, setPaperTypeModal] = useState(false);
  
  const [paperTypes, setPaperTypes] = useState([]);
  const paperType_data = usePaperTypes(page, rowsPerPage, paperTypes);
  const paperTypesIds = usePaperTypesIds(paperTypes);
 
  
  const paperTypesSelection = useSelection(paperTypesIds);
  const selectedSome = (paperTypesSelection.selected.length > 0) && (paperTypesSelection.selected.length < paperType_data.length);
  const selectedAll = (paperType_data.length > 0) && (paperTypesSelection.selected.length === paperType_data.length);
  const [currentData, setCurrentData] = useState('');
  const [isPaperTypeLoading, setIsPaperTypeLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  

  useEffect(() => {
    getPaperTypes();
    
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
        setIsDataLoading(false);
        setPaperTypes(data.paper_types);
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
                          paperTypesSelection.handleSelectAll?.();
                        } else {
                          paperTypesSelection.handleDeselectAll?.();
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
    {paperType_data && paperType_data.map((paperType) => {
                  const isSelected = paperTypesSelection.selected.includes(paperType.id);
                  return (
                    <TableRow
                      hover
                      key={paperType.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={(event) => {
                            if (event.target.checked) {
                              paperTypesSelection.handleSelectOne?.(paperType.id);
                            } else {
                              paperTypesSelection.handleDeselectOne?.(paperType.id);
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
                          <Button><EditIcon style={{ fontSize: '20px' }} onClick={handleUpdatePaperType.bind(this, paperType)} /></Button>
                          <Switch defaultChecked={paperType.active == 1 ? true : false} onChange={onChangeEnable.bind(this, paperType.id)}/>
                        </Stack>
                      </TableCell>
                      <TableCell style={{minWidth: 50}}>
                        {paperType.name}
                      </TableCell>
                     
                    </TableRow>
                  );
                })}
    </>
  }
  const handleUpdatePaperType = (data) => {
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
    setPaperTypeModal(true);
  };
  const changeStatus = (data) => {
    fetch(baseUrl + 'change_status_paper_type/' + data.id, {
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
  
  const openPaperType = () => {
    setPaperTypeModal(true);
  };
  const closePaperType = () => {
    setPaperTypeModal(false);
    resetForm();
  };
  const resetForm = () => {
    
    
    setCurrentData('')
    
  };
  const closePaperTypeModal = () => {
    setPaperTypeModal(false);
  }
   
  
  
  const getLatestPaperTypes = (data) => {
    setPaperTypes(data);
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
      <PaperTypePopup 
      PaperTypeModal={PaperTypeModal}
      closePaperType={closePaperType}
      currentData={currentData}
      setPaperTypes={setPaperTypes}
      closePaperTypeModal={closePaperTypeModal}
      />
      <Head>
        <title>
          Paper Type | Scholar CRM
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
                  Paper Types
                </Typography>
              </Stack>
              <div>
                <Button
                  onClick={openPaperType}
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <PlusIcon/>
                    </SvgIcon>
                  )}
                  variant="contained"
                >
                  Add Paper Type
                </Button>
              </div>
            </Stack>
            <ProductsSearch sendProducts={getLatestPaperTypes}/>
            <TableComponent
              tableHeader={tableHeader}
              tableBody={tableBody}
              count={paperTypes.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
              sendPaperTypes={getLatestPaperTypes}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

PaperType.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default PaperType;