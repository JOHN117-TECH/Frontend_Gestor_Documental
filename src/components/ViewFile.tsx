import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
const apiUrl = import.meta.env.VITE_API_URL;
const apiUrlDev = import.meta.env.VITE_API_URL_DEV;
import axios from 'axios';
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
      <h2>Viewing File {fileName}</h2>
      {fileUrl ? (
        <iframe
          src={fileUrl}
          width="100%"
          height="600px"
          style={{ border: 'none' }}
          title="File Viewer"
        />
      ) : (
        <p>Loading file...</p>
      )}
    </>
  );
};

export default ViewFile;
