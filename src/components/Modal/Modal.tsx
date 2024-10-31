import { FC } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

/* ICONOS */
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
/* COLORES */
import { green, red } from '@mui/material/colors';

/* INTERFACES */
import { ModalProps } from '../../interfaces';

const Modal: FC<ModalProps> = ({
  onFileToDelete,
  open,
  onClose,
  onHandleConfirmDelete,
}) => {
  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#005f99',
          }}
        >
          {'CONFIRM DELETE'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the file {onFileToDelete?.filename}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined" color="success">
            Cancel
            <CancelOutlinedIcon style={{ color: green[500] }} />
          </Button>
          <Button
            onClick={onHandleConfirmDelete}
            variant="outlined"
            color="error"
          >
            Delete <DeleteForeverOutlinedIcon style={{ color: red[500] }} />
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Modal;
