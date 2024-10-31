export interface Column {
    id:
    | 'id'
    | 'fileName'
    | 'path'
    | 'mimeType'
    | 'size'
    | 'createdAt'
    | 'actions';
    label: string;
    minWidth?: number;
    align?: 'center' | 'left' | 'right' | 'inherit';
    format?: (value: string) => string;
}