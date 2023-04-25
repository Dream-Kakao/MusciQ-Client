import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(name, score) {
  return { name, score };
}

const rows = [
  createData('정채윤', 5),
  createData('이현범', 0),
  createData('손병주', 0),
  createData('정솔리', 0),
  createData('이주형', 0),
];

export default function BasicTable() {
  rows.sort((a, b) => (a.score > b.score ? -1 : 1));

  const rankedRows = rows.map((row, index) => ({ ...row, rank: index + 1 }));

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 300 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Rank</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rankedRows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">{row.rank}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}