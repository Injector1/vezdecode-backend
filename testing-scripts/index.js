import FormData from 'form-data';
import * as fs from 'fs';
import fetch from 'node-fetch';


const getFileBuffer = (path) => {
  return fs.readFileSync(path);
}

const uploadImage = async (baseURL, path) => {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(path));
  return await fetch(baseURL + `upload`, {
    method: 'POST',
    body: formData,
  })
    .then(async (res) => await res.json())
    .catch((e) => e);
};

const getImage = async (baseURL, imageId) => {
  return await fetch(baseURL + `get?id=${imageId}`, {
    method: 'GET',
  })
    .then(async (res) => await res.buffer())
    .catch((e) => console.log(e));
};


const moduleTesting = async (pathToUploadingFile, pathToFileToCompare, serverHost, serverPort) => {
  const baseURL = `http://${serverHost}:${serverPort}/images/`
  const response = await uploadImage(baseURL, pathToUploadingFile);
  console.log(response)

  if (response.statusCode === 400) {
    console.log("file is not JPEG/JPG image");
    return false;
  }

  if (response.id) {
    const {id} = response;
    const firstBuffer = await getImage(baseURL, id);
    return Buffer.compare(firstBuffer, getFileBuffer(pathToFileToCompare)) === 0;
  }
  return false;

}

// Configuring paths to files
let pathToUploadingFile = '/home/injector/Pictures/Screenshot from 2021-01-09 20-07-19.jpg'
let pathToFileToCompare = '/home/injector/Pictures/Screenshot from 2021-01-09 20-07-19.jpg'

// Configuring server info
let serverHost = 'localhost'
let serverPort = '3000'
console.log(await moduleTesting(pathToUploadingFile, pathToFileToCompare, serverHost, serverPort))