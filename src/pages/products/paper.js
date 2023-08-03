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
  import { PaperPopup } from 'src/components/product/paper_modal';
import { minWidth } from '@mui/system';

const tableHeaders = [
  "Actions",
  "Paper",
  "Length",
  "Width",
  "Weight",
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


const usePapers = (page, rowsPerPage, papers) => {
  return useMemo(
    () => {
      return applyPagination(papers, page, rowsPerPage);
    },
    [page, rowsPerPage, papers]
  );
};
const usePapersIds = (papers) => {
  return useMemo(
    () => {
      return papers.map((paper) => paper.id);
    },
    [papers]
  );
};


const Paper = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [PaperModal, setPaperModal] = useState(false);
  const [addPaperModal, setAddPaperModal] = useState(false);
  const [papers, setPapers] = useState([]);
  const paper_data = usePapers(page, rowsPerPage, papers);
  const papersIds = usePapersIds(papers);
  const [paperID, setPaperID] = useState('');
  const [paperName, setPaperName] = useState('');
  
  const papersSelection = useSelection(papersIds);
  const selectedSome = (papersSelection.selected.length > 0) && (papersSelection.selected.length < paper_data.length);
  const selectedAll = (paper_data.length > 0) && (papersSelection.selected.length === paper_data.length);
  const [currentData, setCurrentData] = useState('');
  const [isPaperLoading, setIsPaperLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  

  useEffect(() => {
    getPapers();
    
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

  const getPapers = () => {
    fetch(baseUrl + 'get_papers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(data => {
        setIsDataLoading(false);
        setPapers(data.papers);
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
                          papersSelection.handleSelectAll?.();
                        } else {
                          papersSelection.handleDeselectAll?.();
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
    {paper_data && paper_data.map((paper) => {
                  const isSelected = papersSelection.selected.includes(paper.id);
                  return (
                    <TableRow
                      hover
                      key={paper.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={(event) => {
                            if (event.target.checked) {
                              papersSelection.handleSelectOne?.(paper.id);
                            } else {
                              papersSelection.handleDeselectOne?.(paper.id);
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
                          <Button><EditIcon style={{ fontSize: '20px' }} onClick={handleUpdatePaper.bind(this, paper)} /></Button>
                          <Switch defaultChecked={paper.active == 1 ? true : false} onChange={onChangeEnable.bind(this, paper.id)}/>
                        </Stack>
                      </TableCell>
                      <TableCell style={{minWidth: 50}}>
                        {paper.paper}
                      </TableCell>
                      <TableCell style={{minWidth: 50}}>
                        {paper.length}
                      </TableCell>
                      <TableCell style={{minWidth: 50}}>
                        {paper.width}
                      </TableCell>
                      <TableCell style={{minWidth: 50}}>
                        {paper.weight}
                      </TableCell>
                      <TableCell style={{minWidth: 50}}>
                        {paper.ptype}
                      </TableCell>
                    </TableRow>
                  );
                })}
    </>
  }
  const handleUpdatePaper = (data) => {
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
    setPaperModal(true);
  };
  const changeStatus = (data) => {
    fetch(baseUrl + 'change_status_paper/' + data.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
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
  
  const openPaper = () => {
    setPaperModal(true);
  };
  const closePaper = () => {
    setPaperModal(false);
    resetForm();
  };
  const resetForm = () => {
    
    setPaperName('');
    setCurrentData('')
    
  };
  const closePaperModal = () => {
    setPaperModal(false);
  }
   
  const onChangePaperName = (e) => {
    setPaperName(e.target.value);
  };
  
  const getLatestPapers = (data) => {
    setPapers(data);
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
      <PaperPopup 
      PaperModal={PaperModal}
      closePaper={closePaper}
      currentData={currentData}
      setPapers={setPapers}
      closePaperModal={closePaperModal}
      />
      <Head>
        <title>
          Paper | Scholar CRM
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
                  Papers
                </Typography>
              </Stack>
              <div>
                <Button
                  onClick={openPaper}
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <PlusIcon/>
                    </SvgIcon>
                  )}
                  variant="contained"
                >
                  Add Paper
                </Button>
              </div>
            </Stack>
            <ProductsSearch sendProducts={getLatestPapers}/>
            <TableComponent
              tableHeader={tableHeader}
              tableBody={tableBody}
              count={papers.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
              sendPapers={getLatestPapers}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Paper.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Paper;