import { useState, FC, ChangeEvent, useMemo, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from '@mui/material';

/* ICONOS */
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import VisibilityIcon from '@mui/icons-material/Visibility';
/* COLORES DE MATERIAL UI  */
import { green, orange, red } from '@mui/material/colors';

/* LIBRERIAS */
import axios from 'axios';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

/* INTERFACES */
import { Column, FileListProps, File } from '../../interfaces';
import Modal from '../Modal/Modal';

/* VARIABLES DE ENTORNO */
const apiUrl = import.meta.env.VITE_API_URL;
const apiUrlDev = import.meta.env.VITE_API_URL_DEV;

const columns: Column[] = [
  { id: 'id', label: 'Id', minWidth: 120 },
  { id: 'fileName', label: 'FileName', minWidth: 170, align: 'center' },
  {
    id: 'path',
    label: 'Path',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'mimeType',
    label: 'MimeType',
    minWidth: 100,
    align: 'center',
  },
  {
    id: 'size',
    label: 'Size',
    minWidth: 100,
    align: 'center',
  },
  {
    id: 'createdAt',
    label: 'CreatedAt',
    minWidth: 160,
    align: 'center',
    format: (value: string) => format(new Date(value), 'dd/MM/yyyy hh:mmaaa'),
  },
  {
    id: 'actions',
    label: 'Actions',
    minWidth: 170,
    align: 'center',
  },
];

const FileList: FC<FileListProps> = ({ files, onSetFiles }) => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof File>('id');

  const [open, setOpen] = useState<boolean>(false);
  const [fileToDelete, setFileToDelete] = useState<File | null>(null);

  const [editValues, setEditValues] = useState<{ [key: string]: File }>({});

  const navigate = useNavigate();

  // Sincroniza `editValues` con `files` cuando `files` cambia
  useEffect(() => {
    const initialEditValues = files.reduce((acc, file) => {
      acc[file.id] = { ...file };
      return acc;
    }, {} as { [key: string]: File });
    setEditValues(initialEditValues);
  }, [files]);

  const handleView = (fileName: string) => {
    navigate(`/view/${fileName}`);
  };

  const handleChange = (
    id: string,
    field: keyof File,
    value: string | number
  ) => {
    setEditValues((prevValues) => ({
      ...prevValues,
      [id]: {
        ...prevValues[id],
        [field]: value,
      },
    }));
  };

  const handleClickOpen = (file: File) => {
    setFileToDelete(file);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFileToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (fileToDelete) {
      deleteFile(fileToDelete.filename);
      handleClose();
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property: keyof File) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedFiles = useMemo(() => {
    return [...files].sort((a, b) => {
      const aValue = a[orderBy] as keyof File;
      const bValue = b[orderBy] as keyof File;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return order === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [files, order, orderBy]);

  const paginatedFiles = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sortedFiles.slice(startIndex, endIndex);
  }, [sortedFiles, page, rowsPerPage]);

  const handleUpdate = async (id: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { createdAt, id: _, ...updatedData } = editValues[id]; // Excluye `createdAt` y `id`
    try {
      await axios.patch(
        apiUrl ? `${apiUrl}files/${id}` : `${apiUrlDev}/files/${id}`,
        updatedData
      );
      alert('File updated successfully!');
      onSetFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.id === id ? { ...file, ...updatedData } : file
        )
      );
    } catch (error) {
      console.error('Error updating file:', error);
      alert('Failed to update file.');
    }
  };

  const deleteFile = async (filename: string) => {
    try {
      const response = await axios.delete(
        apiUrl ? `${apiUrl}files/${filename}` : `${apiUrlDev}files/${filename}`
      );

      if (response.status === 200) {
        onSetFiles((files) =>
          files.filter((file) => file.filename !== filename)
        );
        alert('File deleted successfully!');
      } else {
        alert('Failed to delete the file.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while deleting the file.');
    }
  };

  return (
    <>
      <Paper
        sx={{
          width: '100%',

          '& .MuiTablePagination-root': {
            color: '#005f99', // Cambiar color del texto en la paginación
          },
          '& .MuiTablePagination-selectIcon': {
            color: '#005f99', // Cambiar color del ícono del selector
          },
          '& .MuiSvgIcon-root': {
            color: '#005f99', // Cambiar color de los íconos (flechas)
          },
          '& .MuiTablePagination-displayedRows': {
            color: '#005f99', // Cambiar el texto de los resultados mostrados
          },
        }}
      >
        <Box
          sx={{
            padding: '20px',
          }}
        >
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{
                        minWidth: column.minWidth,
                        border: '1px solid #ddd',
                        backgroundColor: '#f0f0f0',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleRequestSort(column.id as keyof File)}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',

                          fontSize: '14px',
                          fontWeight: 'bold',
                          color: '#005f99',
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: '#f0f0f0',
                          },
                        }}
                      >
                        {column.label}
                        {orderBy === column.id ? (
                          <span
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              color: '#005f99',
                              marginLeft: '4px',
                            }}
                          >
                            {order === 'asc' ? (
                              <KeyboardArrowUpIcon sx={{ fontSize: 20 }} />
                            ) : (
                              <KeyboardArrowDownIcon sx={{ fontSize: 20 }} />
                            )}
                          </span>
                        ) : null}
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedFiles.map((file, index) => (
                  <TableRow
                    key={file.id}
                    className={index % 2 === 1 ? 'row-blue' : ''}
                  >
                    <TableCell
                      style={{
                        border: '1px solid #ddd',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {file.id}
                      </Box>
                    </TableCell>
                    <TableCell style={{ border: '1px solid #ddd' }}>
                      <TextField
                        value={editValues[file.id]?.filename || ''}
                        onChange={(e) =>
                          handleChange(file.id, 'filename', e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell style={{ border: '1px solid #ddd' }}>
                      <TextField
                        value={editValues[file.id]?.path || ''}
                        onChange={(e) =>
                          handleChange(file.id, 'path', e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell style={{ border: '1px solid #ddd' }}>
                      <TextField
                        value={editValues[file.id]?.mimetype || ''}
                        onChange={(e) =>
                          handleChange(file.id, 'mimetype', e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell style={{ border: '1px solid #ddd' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 2,
                        }}
                      >
                        <TextField
                          value={editValues[file.id]?.size || ''}
                          onChange={(e) =>
                            handleChange(
                              file.id,
                              'size',
                              parseFloat(e.target.value)
                            )
                          }
                        />{' '}
                        <b>KB</b>
                      </Box>
                    </TableCell>
                    <TableCell
                      style={{
                        border: '1px solid #ddd',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {new Date(file.createdAt).toLocaleDateString('es-ES')}{' '}
                        {new Date(file.createdAt).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </Box>
                    </TableCell>
                    <TableCell style={{ border: '1px solid #ddd' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          gap: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 1,
                          }}
                        >
                          <a
                            href={
                              apiUrl
                                ? `${apiUrl}files/${file.filename}`
                                : `${apiUrlDev}files/${file.filename}`
                            }
                            download
                          >
                            <Button variant="outlined" color="warning">
                              Download{' '}
                              <DownloadIcon
                                style={{
                                  color: orange[500],
                                  paddingLeft: '0.5rem',
                                }}
                              />
                            </Button>
                          </a>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleUpdate(file.id)}
                          >
                            Update{' '}
                            <UpgradeIcon
                              style={{ color: 'white', paddingLeft: '0.5rem' }}
                            />
                          </Button>
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 1,
                          }}
                        >
                          {file.mimetype === 'application/pdf' ? (
                            <Button
                              variant="outlined"
                              color="success"
                              onClick={() => handleView(file.filename)}
                            >
                              View{' '}
                              <VisibilityIcon
                                style={{
                                  color: green[500],
                                  paddingLeft: '0.5rem',
                                }}
                              />
                            </Button>
                          ) : null}
                          <Button
                            onClick={() => handleClickOpen(file)}
                            variant="outlined"
                            color="error"
                          >
                            Delete{' '}
                            <DeleteForeverOutlinedIcon
                              style={{ color: red[500], paddingLeft: '0.5rem' }}
                            />
                          </Button>
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={files.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Paper>
      <Modal
        onFileToDelete={fileToDelete}
        open={open}
        onClose={handleClose}
        onHandleConfirmDelete={handleConfirmDelete}
      />
    </>
  );
};

export default FileList;
