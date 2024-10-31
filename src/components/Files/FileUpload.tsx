import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, Typography } from '@mui/material';

const apiUrl = import.meta.env.VITE_API_URL;
const apiUrlDev = import.meta.env.VITE_API_URL_DEV;

interface FileUploadProps {
  onUpload: (filename: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post<{ filename: string }>(
        apiUrl ? `${apiUrl}files/upload` : `${apiUrlDev}files/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Importante para enviar archivos
          },
        }
      );

      // Ejecuta la función de callback con el nombre del archivo subido
      onUpload(response.data.filename);
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('There was an error uploading the file');
    }
  };

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        flexDirection={{ xs: 'column', sm: 'row', md: 'row' }}
        justifyContent={{ xs: 'center' }}
        gap={2}
        sx={{ marginBottom: 2, marginTop: 3 }}
      >
        <Typography
          variant="h6"
          color="primary"
          gutterBottom
          sx={{ marginLeft: '1rem' }}
        >
          Upload Your File
        </Typography>
        <Button
          variant="outlined"
          component="label"
          sx={{
            width: '300px',
            padding: '10px',
            borderColor: '#005f99',
            borderRadius: '8px',
            color: '#005f99',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#e0f7fa',
              borderColor: '#005f99',
            },
          }}
        >
          Select File
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
        <Typography variant="body2" color="textSecondary">
          {file ? file.name : 'No file selected'}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          sx={{
            width: '150px',
            fontWeight: 'bold',
            padding: '10px',
            backgroundColor: '#005f99',
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: '#003f6b',
            },
          }}
        >
          Upload
        </Button>
      </Box>
    </>
  );
};

export default FileUpload;
