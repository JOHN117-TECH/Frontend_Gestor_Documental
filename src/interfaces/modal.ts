import { File } from "./file";


export interface ModalProps {
    onFileToDelete: File | null;
    open: boolean;
    onClose: () => void;
    onHandleConfirmDelete: () => void;
}