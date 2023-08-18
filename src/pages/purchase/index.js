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
import { PurchasePopup } from 'src/components/purchase/purchasevoucher_modal';
import { useSelector } from 'react-redux';
const tableHeaders = [
  "Actions",
  "Vendor Name",
  "Voucher No",
  "Amount",
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
const usePurchaseVoucher = (page, rowsPerPage, vouchers) => {
  return useMemo(
    () => {
      return applyPagination(vouchers, page, rowsPerPage);
    },
    [page, rowsPerPage, vouchers]
  );
};

const usePurchaseIds = (vouchers) => {
  return useMemo(
    () => {
      return vouchers.map((voucher) => voucher.id);
    },
    [vouchers]
  );
};

const PurchaseVoucher = () => {
  const auth_token = useSelector((state) => state.token);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [PurchaseVoucherModal, setPurchaseVoucherModal] = useState(false);
  const [currentData, setCurrentData] = useState('');
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [vouchers, setVouchers] = useState([]);
  const voucher_data = usePurchaseVoucher(page, rowsPerPage, vouchers);
  const purchaseIds = usePurchaseIds(vouchers);
  const vouchersSelection = useSelection(purchaseIds);
  const selectedSome = (vouchersSelection.selected.length > 0) && (vouchersSelection.selected.length < voucher_data.length);
const selectedAll = (voucher_data.length > 0) && (vouchersSelection.selected.length === voucher_data.length);
  useEffect(() => {
    getVouchers();
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

  const tableHeader = () => {
    return <>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={(selectedAll)}
                      indeterminate={selectedSome}
                      onChange={(event) => {
                        if (event.target.checked) {
                          vouchersSelection.handleSelectAll?.();
                        } else {
                          vouchersSelection.handleDeselectAll?.();
                        }
                      }}
                    />
                  </TableCell>
                  
                  {tableHeaders && tableHeaders.map((header, index) => (
                    <TableCell key={index} style={{minWidth: 150}}>
                      {header}
                    </TableCell>
                  ))}
    </>
  }

  const tableBody = () => {
    return <>
    {voucher_data && voucher_data.map((voucher) => {
                  const isSelected = vouchersSelection.selected.includes(voucher.id);
                  return (
                    <TableRow
                      hover
                      key={voucher.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={(event) => {
                            if (event.target.checked) {
                              vouchersSelection.handleSelectOne?.(voucher.id);
                            } else {
                              vouchersSelection.handleDeselectOne?.(voucher.id);
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
                          <Button><EditIcon style={{ fontSize: '20px' }} onClick={handleUpdateVoucher.bind(this, voucher)} /></Button>
                          <Switch defaultChecked={voucher.active == 1 ? true : false} onChange={onChangeEnable.bind(this, voucher.id)}/>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        {voucher.account_name}
                      </TableCell>
                      <TableCell>
                        {voucher.voucher_no}
                      </TableCell>
                      <TableCell>
                        {voucher.net_amount}
                      </TableCell>
                      <TableCell>
                        {voucher.created_date}
                      </TableCell>
                      
                    </TableRow>
                  );
                })}
    </>
  }

  const handleUpdateVoucher = (data) => {
    getUpdateData(data);
  };

  const closePurchaseVoucherModal = () => {
    setPurchaseVoucherModal(false);
  }

  const onChangeEnable = (id, event) => {
    const data = {
      status: event.target.checked,
      id: id
    }
    changeStatus(data);
  };

  const getVouchers = () => {
    const data  = {
      search_term: ""
    }
    const searchTerm = 'Purchase Voucher PP';
const encodedSearchTerm = encodeURIComponent(searchTerm);
    fetch(baseUrl + 'get_purchase_vouchers/' + encodedSearchTerm, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth_token}`,
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        setIsDataLoading(false);
        setVouchers(data.vouchers);
      })
      .catch(error => console.error(error));
  };
  const openPurchaseVoucher = () => {
    setPurchaseVoucherModal(true);
  };
  const closePurchaseVoucher = () => {
    setPurchaseVoucherModal(false);
    setCurrentData('')
  };
  const getLatestProducts = (data) => {
    setVouchers(data);
  };
  const getUpdateData = (data) => {
    setCurrentData(data);
    setPurchaseVoucherModal(true);
  };
  const changeStatus = (data) => {
    fetch(baseUrl + 'change_status_voucher/' + data.id, {
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
      <PurchasePopup 
      PurchaseVoucherModal={PurchaseVoucherModal}
      closePurchaseVoucher={closePurchaseVoucher}
      currentData={currentData}
      setVouchers={setVouchers}
      closePurchaseVoucherModal={closePurchaseVoucherModal}
      />
      <Head>
        <title>
          Purchase Voucher for Paper & Plate | Scholar CRM
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
                Purchase Voucher for Paper & Plate
                </Typography>
              </Stack>
              <div>
                <Button
                  onClick={openPurchaseVoucher}
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <PlusIcon/>
                    </SvgIcon>
                  )}
                  variant="contained"
                >
                  Add Purchase Voucher
                </Button>
              </div>
            </Stack>
            <ProductsSearch sendProducts={getLatestProducts}/>
            <TableComponent
              tableHeader={tableHeader}
              tableBody={tableBody}
              count={vouchers.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
              sendProducts={getLatestProducts}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

PurchaseVoucher.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default PurchaseVoucher;