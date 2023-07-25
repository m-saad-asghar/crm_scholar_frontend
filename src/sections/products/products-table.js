import PropTypes from 'prop-types';
import EditIcon from '@mui/icons-material/Edit';
import Switch from '@mui/material/Switch';
import {
  Box,
  Card,
  Checkbox,
  Stack,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography, Modal
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';

export const ProductsTable = (props) => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const handleUpdateProduct = (data) => {
    props.updateProduct(data);
  };
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = []
  } = props;

  const selectedSome = (selected.length > 0) && (selected.length < items.length);
  const selectedAll = (items.length > 0) && (selected.length === items.length);
  const onChangeEnable = (id, event) => {
    const data = {
      status: event.target.checked,
      id: id
    }
    props.updateStatus(data);
  };

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedAll}
                      indeterminate={selectedSome}
                      onChange={(event) => {
                        if (event.target.checked) {
                          onSelectAll?.();
                        } else {
                          onDeselectAll?.();
                        }
                      }}
                    />
                  </TableCell>
                  {props && props.tableHeaders && props.tableHeaders.map((header, index) => (
                    <TableCell key={index} style={{minWidth: 150}}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {items && items.map((product) => {
                  const isSelected = selected.includes(product.id);
                  return (
                    <TableRow
                      hover
                      key={product.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={(event) => {
                            if (event.target.checked) {
                              onSelectOne?.(product.id);
                            } else {
                              onDeselectOne?.(product.id);
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {product.product_code}
                      </TableCell>
                      <TableCell>
                        {product.product_sname}
                      </TableCell>
                      <TableCell>
                        {product.product_name}
                      </TableCell>
                      <TableCell>
                        {product.face_price}
                      </TableCell>
                      <TableCell>
                        {product.pages}
                      </TableCell>
                      <TableCell>
                        {product.inner_pages}
                      </TableCell>
                      <TableCell>
                        {product.rule_pages}
                      </TableCell>
                      <TableCell>
                        {product.farmay}
                      </TableCell>
                      <TableCell>
                        {product.weight}
                      </TableCell>
                      <TableCell>
                        {product.book_sheet_size_label}
                      </TableCell>
                      <TableCell>
                        {product.subject_name}
                      </TableCell>
                      <TableCell>
                        {product.board_name}
                      </TableCell>
                      <TableCell>
                        {product.category_name}
                      </TableCell>
                      <TableCell>
                        {product.title_sheet_size_label}
                      </TableCell>
                      <TableCell>
                        <Stack
                          alignItems="center"
                          direction="row"
                          spacing={2}
                        >
                          <Button><EditIcon style={{ fontSize: '20px' }} onClick={handleUpdateProduct.bind(this, product)} /></Button>
                          <Switch defaultChecked={product.active == 1 ? true : false} onChange={onChangeEnable.bind(this, product.id)}/>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
        <TablePagination
          component="div"
          count={count}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
    </>
  );
};

ProductsTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  tableHeaders: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array
};