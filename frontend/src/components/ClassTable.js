import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination
} from '@mui/material';

const DataTable = ({ ClassList }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const emptyRows =
        rowsPerPage - Math.min(rowsPerPage, ClassList["class-list"].length - page * rowsPerPage);

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Student UPI</TableCell>
                        <TableCell>Student Name</TableCell>
                        <TableCell>Class ID</TableCell>
                        <TableCell>Assignment ID</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(rowsPerPage > 0
                            ? ClassList["class-list"].slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : ClassList["class-list"]
                    ).map((row, index) => (
                        <TableRow key={index}>
                            <TableCell>{row["Student UPI"]}</TableCell>
                            <TableCell>{row["Student Name"]}</TableCell>
                            <TableCell>{row["Class ID"]}</TableCell>
                            <TableCell>{row["Assignment ID"]}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={ClassList["class-list"].length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </TableContainer>
    );
};

export default DataTable;
