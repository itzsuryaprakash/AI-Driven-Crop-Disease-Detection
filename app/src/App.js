import React, { useState, useRef } from 'react';
import { AppBar, Toolbar, Typography, IconButton, InputBase, Container, Grid, Paper, Button, Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import axios from 'axios';

const placeholderImage = "https://img.freepik.com/premium-photo/cute-cartoon-character-picking-leaf-from-tree-with-view-forest-background_124507-128097.jpg";

function App() {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [imagePreview, setImagePreview] = useState(placeholderImage);

  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      alert("Please upload a file first.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8001/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("API Response:", response.data);
      setPrediction(response.data);
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  return (
    <div className="App" style={{ backgroundColor: '#000', color: '#00ff00', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <AppBar position="static" style={{ backgroundColor: '#000' }}>
        <Toolbar>
          <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <img src="https://masterbundles.com/wp-content/uploads/2023/03/leaf-ai-201.jpg" alt="Logo" style={{ height: '40px', marginRight: '10px' }} />
            <Typography variant="h6" style={{ color: '#00ff00' }}>Crop Care</Typography>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <IconButton color="inherit"><NotificationsIcon style={{ color: '#00ff00' }} /></IconButton>
            <InputBase placeholder="Search…" style={{ color: '#00ff00', border: '1px solid #00ff00', borderRadius: '5px', padding: '0 10px', marginRight: '8px' }} />
            <IconButton color="inherit"><SearchIcon style={{ color: '#00ff00' }} /></IconButton>
            <IconButton color="inherit"><AccountCircle style={{ color: '#00ff00' }} /></IconButton>
          </div>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Grid container spacing={2} justifyContent="center">
          {/* Left Column - Prediction Scanner */}
          <Grid item xs={12} md={6}>
            <Paper style={{ padding: '20px', backgroundColor: '#333', color: '#00ff00', textAlign: 'center', width: '100%', maxWidth: '600px', margin: 'auto' }}>
              <h2>Prediction Scanner</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                />
                <Box style={{ textAlign: 'center', marginTop: '10px' }}>
                  <img
                    src={imagePreview}
                    alt="Uploaded Preview"
                    style={{ width: '80%', height: 'auto', border: '1px solid #00ff00', cursor: 'pointer' }}
                    onClick={handleImageClick}
                  />
                  <Typography
                    variant="body2"
                    style={{ color: '#00ff00', cursor: 'pointer', marginTop: '10px' }}
                    onClick={handleImageClick}
                  >
                    Click here to upload an image
                  </Typography>
                </Box>
                <Box mt={2} style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button type="submit" variant="contained" style={{ backgroundColor: '#00ff00', color: '#000' }} startIcon={<UploadFileIcon />}>
                    Submit
                  </Button>
                </Box>
                {prediction && (
                  <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <h3>Prediction Result</h3>
                    <p>Class: {prediction.class}</p>
                    <p>Confidence: {prediction.confidence}</p>
                  </div>
                )}
              </form>
            </Paper>
          </Grid>

          {/* Right Column - Government Schemes and Store Communities */}
          <Grid item xs={12} md={6}>
            <Paper style={{ padding: '20px', backgroundColor: '#333', color: '#00ff00', textAlign: 'center', width: '100%', maxWidth: '600px', margin: 'auto' }}>
              <h2>Government Schemes & Store Communities</h2>
              {/* Add your content for government schemes and store communities here */}
              <p>Content goes here...</p>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '10px', backgroundColor: '#000', color: '#00ff00' }}>
        <Typography variant="body2">© 2024 Crop Care | Contact: info@cropcare.com</Typography>
      </footer>
    </div>
  );
}

export default App;
