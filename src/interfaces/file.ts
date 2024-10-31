import { Dispatch, SetStateAction } from "react";

export interface File {
    id: string;
    filename: string;
    path: string;
    mimetype: string;
    size: number;
    createdAt: string;
}


export interface FileListProps {
    files: File[];
    onSetFiles: Dispatch<SetStateAction<File[]>>;
}


