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
  import { SheetPopup } from 'src/components/product/sheetsize_modal';
  import { useSelector } from 'react-redux';
  import { minWidth } from '@mui/system';

const tableHeaders = [
  "Actions",
  "Sheet",
  "Length",
  "Width",
  "Portion",
  
  
];
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.sheet',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

const now = new Date();


const useSheets = (page, rowsPerPage, sheets) => {
  return useMemo(
    () => {
      return applyPagination(sheets, page, rowsPerPage);
    },
    [page, rowsPerPage, sheets]
  );
};
const useSheetsIds = (sheets) => {
  return useMemo(
    () => {
      return sheets.map((sheet) => sheet.id);
    },
    [sheets]
  );
};


const Sheet = () => {
  const jwt_token = localStorage.getItem('jwt_token');
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [SheetModal, setSheetModal] = useState(false);
  const [addSheetModal, setAddSheetModal] = useState(false);
  const [sheets, setSheets] = useState([]);
  const sheet_data = useSheets(page, rowsPerPage, sheets);
  const sheetsIds = useSheetsIds(sheets);
  const [sheetID, setSheetID] = useState('');
  const [sheetName, setSheetName] = useState('');
  
  const sheetsSelection = useSelection(sheetsIds);
  const selectedSome = (sheetsSelection.selected.length > 0) && (sheetsSelection.selected.length < sheet_data.length);
  const selectedAll = (sheet_data.length > 0) && (sheetsSelection.selected.length === sheet_data.length);
  const [currentData, setCurrentData] = useState('');
  const [isSheetLoading, setIsSheetLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  

  useEffect(() => {
    getSheets();
    
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

  const getSheets = () => {
    fetch(baseUrl + 'get_sheet_sizes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt_token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setIsDataLoading(false);
        setSheets(data.sheets);
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
                          sheetsSelection.handleSelectAll?.();
                        } else {
                          sheetsSelection.handleDeselectAll?.();
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
    {sheet_data && sheet_data.map((sheet) => {
                  const isSelected = sheetsSelection.selected.includes(sheet.id);
                  return (
                    <TableRow
                      hover
                      key={sheet.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={(event) => {
                            if (event.target.checked) {
                              sheetsSelection.handleSelectOne?.(sheet.id);
                            } else {
                              sheetsSelection.handleDeselectOne?.(sheet.id);
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
                          <Button><EditIcon style={{ fontSize: '20px' }} onClick={handleUpdateSheet.bind(this, sheet)} /></Button>
                          <Switch defaultChecked={sheet.active == 1 ? true : false} onChange={onChangeEnable.bind(this, sheet.id)}/>
                        </Stack>
                      </TableCell>
                      <TableCell style={{minWidth: 50}}>
                        {sheet.sheet}
                      </TableCell>
                      <TableCell style={{minWidth: 50}}>
                        {sheet.length}
                      </TableCell>
                      <TableCell style={{minWidth: 50}}>
                        {sheet.width}
                      </TableCell>
                      <TableCell style={{minWidth: 50}}>
                        {sheet.portion}
                      </TableCell>
                      
                    </TableRow>
                  );
                })}
    </>
  }
  const handleUpdateSheet = (data) => {
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
    setSheetModal(true);
  };
  const changeStatus = (data) => {
    fetch(baseUrl + 'change_status_sheet_size/' + data.id, {
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
  
  const openSheet = () => {
    setSheetModal(true);
  };
  const closeSheet = () => {
    setSheetModal(false);
    resetForm();
  };
  const resetForm = () => {
    
    setSheetName('');
    setCurrentData('')
    
  };
  const closeSheetModal = () => {
    setSheetModal(false);
  }
   
  const onChangeSheetName = (e) => {
    setSheetName(e.target.value);
  };
  
  const getLatestSheets = (data) => {
    setSheets(data);
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
      <SheetPopup 
      SheetModal={SheetModal}
      closeSheet={closeSheet}
      currentData={currentData}
      setSheets={setSheets}
      closeSheetModal={closeSheetModal}
      />
      <Head>
        <title>
          Sheet | Scholar CRM
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
                  Sheets
                </Typography>
              </Stack>
              <div>
                <Button
                  onClick={openSheet}
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <PlusIcon/>
                    </SvgIcon>
                  )}
                  variant="contained"
                >
                  Add Sheet
                </Button>
              </div>
            </Stack>
            <ProductsSearch sendProducts={getLatestSheets}/>
            <TableComponent
              tableHeader={tableHeader}
              tableBody={tableBody}
              count={sheets.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
              sendSheets={getLatestSheets}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Sheet.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Sheet;