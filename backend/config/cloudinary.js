import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

const uploadOnCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "chatly", quality: "auto", fetch_format: "auto" },
      (error, result) => {
        if (error) reject(error)
        else resolve(result.secure_url)
      }
    )
    streamifier.createReadStream(fileBuffer).pipe(stream)
  })
}

export default uploadOnCloudinary