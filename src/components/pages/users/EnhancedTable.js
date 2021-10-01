import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@material-ui/core/styles';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Toolbar, Typography, Paper, Checkbox, IconButton, Tooltip, FormControlLabel, Switch, Button } from '@material-ui/core';
import { Delete as DeleteIcon, FilterList as FilterListIcon } from '@material-ui/icons';
import { Link } from "react-router-dom";

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: 'title',
        numeric: false,
        disablePadding: true,
        label: 'タイトル',
    },
    {
        id: 'categories',
        numeric: true,
        disablePadding: false,
        label: 'カテゴリー',
    },
    {
        id: 'descriptions',
        numeric: true,
        disablePadding: false,
        label: '説明文',
    },
    {
        id: 'updated_at',
        numeric: true,
        disablePadding: false,
        label: '更新日時',
    },
];

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox color="primary" indeterminate={numSelected > 0 && numSelected < rowCount} checked={rowCount > 0 && numSelected === rowCount} onChange={onSelectAllClick} inputProps={{ 'aria-label': 'select all desserts',}}/>
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell key={headCell.id} align={headCell.numeric ? 'right' : 'left'} padding={headCell.disablePadding ? 'none' : 'normal'} sortDirection={orderBy === headCell.id ? order : false}>
                        <TableSortLabel active={orderBy === headCell.id} direction={orderBy === headCell.id ? order : 'asc'} onClick={createSortHandler(headCell.id)}>
                        {headCell.label}
                        {orderBy === headCell.id ? (
                            <Box component="span">{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</Box>
                        ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
    const { numSelected } = props;

    return (
        <Toolbar>
            {numSelected > 0 ? (
                <Typography color="inherit" variant="subtitle1" component="div">{numSelected} selected</Typography>
            ) : (
                <Typography variant="h6" id="tableTitle" component="div">作成デザイン一覧</Typography>
            )}

            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            )}
            <Button color="primary" aria-label="add" variant="outlined" component={Link} to="/designs/register">新規作成</Button>
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable(props) {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = props.designs.map((n) => n.title);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - props.designs.length) : 0;

    const tableRow = [];
    for (var i = 0; i < props.designs.length; i++) {
        const design = props.designs[i];
        const isItemSelected = isSelected(design.title);
        const labelId = `enhanced-table-checkbox-${i}`;
        const date = new Date(design.updated_at);
        tableRow.push(
            <TableRow hover onClick={(event) => handleClick(event, design.title)} role="checkbox" aria-checked={isItemSelected} tabIndex={-1} key={design.name} selected={isItemSelected} >
                <TableCell padding="checkbox">
                    <Checkbox color="primary" checked={isItemSelected} inputProps={{ 'aria-labelledby': labelId,}}/>
                </TableCell>
                <TableCell component="th" id={labelId} scope="row" padding="none" component={Link} to={'/designs/register/?id=' + design.id}>{design.title}</TableCell>
                <TableCell align="right">{design.Category.name}</TableCell>
                <TableCell align="right">{design.desc}</TableCell>
                <TableCell align="right">{date.toLocaleString()}</TableCell>
            </TableRow>
        );
    }

    return (
        <Box>
            <Paper>
                <EnhancedTableToolbar numSelected={selected.length} />
                <TableContainer>
                    <Table aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
                        <EnhancedTableHead numSelected={selected.length} order={order} orderBy={orderBy} onSelectAllClick={handleSelectAllClick} onRequestSort={handleRequestSort} rowCount={props.designs.length}/>
                        <TableBody>
                            { tableRow }
                            {emptyRows > 0 && (
                                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                            </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" count={props.designs.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage}/>
            </Paper>
        </Box>
    );
}
// <FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label="Dense padding"/>


// {
//     stableSort(rows, getComparator(order, orderBy))
//     .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//     .map((row, index) => {
//         const isItemSelected = isSelected(row.name);
//         const labelId = `enhanced-table-checkbox-${index}`;
//
//         return (
//             <TableRow hover onClick={(event) => handleClick(event, row.title)} role="checkbox" aria-checked={isItemSelected} tabIndex={-1} key={row.name} selected={isItemSelected} >
//                 <TableCell padding="checkbox">
//                     <Checkbox color="primary" checked={isItemSelected} inputProps={{ 'aria-labelledby': labelId,}}/>
//                 </TableCell>
//                 <TableCell component="th" id={labelId} scope="row" padding="none">{row.title}</TableCell>
//                 <TableCell align="right">{row.categories}</TableCell>
//                 <TableCell align="right">{row.updated_at}</TableCell>
//             </TableRow>
//         );
//     })
// }
