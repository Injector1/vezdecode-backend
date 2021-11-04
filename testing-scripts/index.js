import FormData from 'form-data';
import * as fs from 'fs';
import fetch from 'node-fetch';


const getFileBuffer = (path) => {
  return fs.readFileSync(path);
}

const uploadImage = async (path) => {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(path));
  return await fetch('http://localhost:3000/images/upload', {
    method: 'POST',
    body: formData,
  })
    .then(async (res) => await res.json())
    .catch((e) => e);
};

const getImage = async (imageId) => {
  return await fetch(`http://localhost:3000/images/get?id=${imageId}`, {
    method: 'GET',
  })
    .then(async (res) => await res.buffer())
    .catch((e) => console.log(e));
};


const moduleTesting = async (pathToUploadingFile, pathToFileToCompare) => {
  const response = await uploadImage(pathToUploadingFile);
  console.log(response)

  if (response.statusCode === 400) {
    console.log("file is not JPEG/JPG image");
    return false;
  }

  if (response.id) {
    const {id} = response;
    const firstBuffer = await getImage(id);
    console.log(Buffer.compare(firstBuffer, getFileBuffer(pathToFileToCompare)) === 0)
    return true;
  }
  return false;

}

moduleTesting('/home/injector/Pictures/Screenshot from 2021-01-09 20-07-19.jpg', '/home/injector/Pictures/Screenshot from 2021-01-09 20-07-30.jpeg')