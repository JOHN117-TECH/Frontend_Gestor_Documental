import React, { useState, useEffect } from 'react';
import axios from 'axios';

import FileList from './FileList';

import { Box } from '@mui/material';
import FileUpload from './FileUpload';
import NavBar from '../UI/NavBar';
import Footer from '../UI/Footer';

import { File } from '../../interfaces';

const apiUrl = import.meta.env.VITE_API_URL;
const apiUrlDev = import.meta.env.VITE_API_URL_DEV;

const FileManager: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);

  const fetchFiles = async () => {
    try {
      const response = await axios.get<File[]>(
        apiUrl ? `${apiUrl}files` : `${apiUrlDev}files`
      );
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = () => {
    fetchFiles();
  };

  return (
    <>
      <Box
        sx={{ width: '100%', minHeight: '100vh', margin: '0', padding: '0' }}
      >
        <NavBar />
        <FileUpload onUpload={handleUpload} />
        <FileList files={files} onSetFiles={setFiles} />
        <Footer />
      </Box>
    </>
  );
};

export default FileManager;
