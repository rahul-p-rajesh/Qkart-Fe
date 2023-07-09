import React, {useState} from 'react'
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import PropTypes from 'prop-types';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { genres, ageGroup } from '../data/const'
import { backendUrl } from "../data/config";
import axios from "axios";


function UploadPopUp(props) {
  const { onClose, open } = props;
  const [link, setLink] = useState('');
  const [thumbnailImage, setThumbnailImage] = useState('');
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [age, setAge] = useState('');
  const [date, setDate] = useState(null);;

    const postVideo = async (data) => {

      const url = backendUrl + "/v1/videos";
    //2. make a get request with url
      
    try {
      const responce = await axios.post(url, data);
      if (responce.status === 201) {
        console.log("video uploaded")
      } else {
        throw new Error("video could not be uploaded",responce.status);
      }
    } catch (err) {
      // Handle Error Here
      console.error(err);
    }

    }
  const resetData = () => {
    
    setLink("")
    setThumbnailImage("")
    setTitle("")
    setGenre("")
    setAge("")
    setDate(null)
    return true;
  }
  
  const submitData = () => {
    const data = {
      videoLink: link,
      title: title,
      genre: genre,
      contentRating: age,
      releaseDate: date,
      previewImage: thumbnailImage,
    }
    postVideo(data).then(() => {
      resetData()
      onClose();

    }).catch((err) => { console.log(err) });
    
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}
    >
      <div className=" w-full py-3 px-3">
        <Typography variant="h6" component="h6">
          Upload Video
        </Typography>

        <div className=" my-6">
          <Stack spacing={3}>
          <TextField id="outlined-basic" label="Video Link" variant="outlined"
              helperText="This link will be used to derive the video"
              value ={link} onChange={(event) => setLink(event.target.value)}
          />
          <TextField id="outlined-basic" label="Thumbnail Image Link" variant="outlined"
              helperText="This link will be used to preview the thumbnail image"
              value ={thumbnailImage} onChange={(event) => setThumbnailImage(event.target.value)}
          />
          <TextField id="outlined-basic" label="Title" variant="outlined"
              helperText="The title will be the representative text for video"
              value ={title} onChange={(event) => setTitle(event.target.value)}
          />

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Genre</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Genre"
              value ={genre} onChange={(event) => setGenre(event.target.value)}
              >
                {genres.map((genre) => 
                  <MenuItem key={genre} value={genre}>{genre}</MenuItem>
                )}
              
            </Select>
            <FormHelperText>Genre will help in categorizing your videos</FormHelperText>
          </FormControl>

            <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Suitable age group for the clip</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              
              label="Suitable age group for the clip"
              value ={age} onChange={(event) => setAge(event.target.value)}
            >
              {ageGroup.map((age) => 
                  <MenuItem key={age} value={age}>{age}</MenuItem>
                )}
            </Select>
            <FormHelperText>This will be used to filter videos on age group suitability</FormHelperText>
            </FormControl>
            
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label="Date desktop"
                inputFormat="MM/dd/yyyy"
                renderInput={(params) => <TextField {...params} />}
                value={date} onChange={(newDate) => setDate(newDate)}
              />
            </LocalizationProvider>

            <Stack direction="row" spacing={2}>
              <Button id="upload-btn-submit" variant="contained" color="error" onClick={submitData} >UPLOAD BUTTON</Button>
              <Button id="upload-btn-cancel" variant="text" style={{ color: "white" }} onClick={handleClose}>CANCEL</Button>
            </Stack>
          </Stack>
        </div>

      </div>
      
    </Dialog>
  );
}

Dialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};

export default UploadPopUp