import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
const apiUrl = import.meta.env.VITE_API_URL;
const apiUrlDev = import.meta.env.VITE_API_URL_DEV;
import axios from 'axios';
import { Box, Typography } from '@mui/material';
import NavBar from './UI/NavBar';
const ViewFile = () => {
  const { fileName } = useParams();
  const [fileUrl, setFileUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const url = apiUrl
      ? `${apiUrl}files/${fileName}`
      : `${apiUrlDev}files/${fileName}`;
    axios
      .get(url, { responseType: 'blob' })
      .then((response) => {
        const fileURL = URL.createObjectURL(response.data);
        setFileUrl(fileURL);
      })
      .catch((err) => {
        return setError(err.response?.data?.message || 'File not found');
      });
  }, [fileName]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <NavBar />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          background: '#e3e3e3',
        }}
      >
        <Typography
          variant="h6"
          color="primary"
          gutterBottom
          sx={{ marginLeft: '1rem', paddingY: '1rem' }}
        >
          Viewing File {fileName}
        </Typography>

        {fileUrl ? (
          <iframe
            src={fileUrl}
            width="80%"
            style={{
              border: 'none',
              paddingBottom: '5rem',
              maxHeight: '100vh',
              height: '60rem',
            }}
            title="File Viewer"
          />
        ) : (
          <p>Loading file...</p>
        )}
      </Box>
    </>
  );
};

export default ViewFile;
