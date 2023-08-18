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
  import { BatchPopup } from 'src/components/process/batch_modal';
  import { useSelector } from 'react-redux';
import { minWidth } from '@mui/system';

const tableHeaders = [
  "Actions",
  "Batch No",
  "Product Name",
  "Book Print Qty",
  "Paper for Book",
  "Book Ream Qty",
  "Title Print Qty",
  "Paper for Title",
  "Title Paper Qty",
  "Inner Print Qty",
  "Paper for Inner",
  "Inner Paper Qty",
  "Rule Print Qty",
  "Paper for Rule",
  "Rule Paper Qty",
  "Wastage",
  "Created Date"

  
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


const useBatches = (page, rowsPerPage, batches) => {
  return useMemo(
    () => {
      return applyPagination(batches, page, rowsPerPage);
    },
    [page, rowsPerPage, batches]
  );
};
const useBatchesIds = (batches) => {
  return useMemo(
    () => {
      return batches.map((batch) => batch.id);
    },
    [batches]
  );
};


const Batch = () => {
  const auth_token = useSelector((state) => state.token);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [BatchModal, setBatchModal] = useState(false);
  
  const [batches, setBatches] = useState([]);
  const batch_data = useBatches(page, rowsPerPage, batches);
  const batchesIds = useBatchesIds(batches);
  const [batchID, setBatchID] = useState('');
  
  
  const batchesSelection = useSelection(batchesIds);
  const selectedSome = (batchesSelection.selected.length > 0) && (batchesSelection.selected.length < batch_data.length);
  const selectedAll = (batch_data.length > 0) && (batchesSelection.selected.length === batch_data.length);
  const [currentData, setCurrentData] = useState('');
  const [isDataLoading, setIsDataLoading] = useState(false);
  
  
  

  useEffect(() => {
    getBatches();
    
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

  const getBatches = () => {
    fetch(baseUrl + 'get_batches', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth_token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setIsDataLoading(false);
        setBatches(data.batches);
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
                          batchesSelection.handleSelectAll?.();
                        } else {
                          batchesSelection.handleDeselectAll?.();
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
    {batch_data && batch_data.map((batch) => {
                  const isSelected = batchesSelection.selected.includes(batch.id);
                  return (
                    <TableRow
                      hover
                      key={batch.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={(event) => {
                            if (event.target.checked) {
                              batchesSelection.handleSelectOne?.(batch.id);
                            } else {
                              batchesSelection.handleDeselectOne?.(batch.id);
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
                          <Button><EditIcon style={{ fontSize: '20px' }} onClick={handleUpdateBatch.bind(this, batch)} /></Button>
                          <Switch defaultChecked={batch.status == 'Open' ? true : false} onChange={onChangeEnable.bind(this, batch.id)}/>
                        </Stack>
                      </TableCell>
                      <TableCell style={{minWidth: 50}}>
                        {batch.batch_no}
                      </TableCell>
                      <TableCell style={{minWidth: 50}}>
                        {batch.Product}
                      </TableCell>

                      <TableCell style={{minWidth: 50}}>
                        {batch.book_print_qty}
                      </TableCell>
                      <TableCell style={{minWidth: 50}}>
                        {batch.paperForBook}
                      </TableCell>
                      <TableCell style={{minWidth: 50}}>
                        {batch.book_paper_qty}
                      </TableCell>

                      <TableCell style={{minWidth: 50}}>
                        {batch.title_print_qty}
                      </TableCell>
                      <TableCell style={{minWidth: 50}}>
                        {batch.paperForTitle}
                      </TableCell>
                      <TableCell style={{minWidth: 50}}>
                        {batch.title_paper_qty}
                      </TableCell>

                      <TableCell style={{minWidth: 50}}>
                        {batch.inner_print_qty}
                      </TableCell>
                      <TableCell style={{minWidth: 50}}>
                        {batch.paperForInner}
                      </TableCell>
                      <TableCell style={{minWidth: 50}}>
                        {batch.inner_paper_qty}
                      </TableCell>

                      <TableCell style={{minWidth: 50}}>
                        {batch.rule_print_qty}
                      </TableCell>
                      <TableCell style={{minWidth: 50}}>
                        {batch.paperForRule}
                      </TableCell>
                      <TableCell style={{minWidth: 50}}>
                        {batch.rule_paper_qty}
                      </TableCell>

                      <TableCell style={{minWidth: 50}}>
                        {batch.book_paper_wastage}
                      </TableCell>
                      <TableCell style={{minWidth: 50}}>
                        {batch.created_date}
                      </TableCell>
                     
                    </TableRow>
                  );
                })}
    </>
  }
  const handleUpdateBatch = (data) => {
    getUpdateData(data);
  };
  const onChangeEnable = (id, event) => {
    const data = {
      status: event.target.checked ? 'Open' : 'Close',
      id: id
    }
    changeStatus(data);
  };
  const getUpdateData = (data) => {
    setCurrentData(data);
    setBatchModal(true);
  };
  const changeStatus = (data) => {
    fetch(baseUrl + 'change_status_batch/' + data.id, {
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
  
  const openBatch = () => {
    setBatchModal(true);
  };
  const closeBatch = () => {
    setBatchModal(false);
    resetForm();
  };
  const resetForm = () => {
    
    
    setCurrentData('')
    
  };
  const closeBatchModal = () => {
    setBatchModal(false);
  }
   
 
  
  const getLatestBatches = (data) => {
    setBatches(data);
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
      <BatchPopup 
      BatchModal={BatchModal}
      closeBatch={closeBatch}
      currentData={currentData}
      setBatches={setBatches}
      closeBatchModal={closeBatchModal}
      />
      <Head>
        <title>
          Batch | Scholar CRM
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
                  Batches
                </Typography>
              </Stack>
              <div>
                <Button
                  onClick={openBatch}
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <PlusIcon/>
                    </SvgIcon>
                  )}
                  variant="contained"
                >
                  Add Batch
                </Button>
              </div>
            </Stack>
            <ProductsSearch sendProducts={getLatestBatches}/>
            <TableComponent
              tableHeader={tableHeader}
              tableBody={tableBody}
              count={batches.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
              sendBatches={getLatestBatches}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Batch.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Batch;