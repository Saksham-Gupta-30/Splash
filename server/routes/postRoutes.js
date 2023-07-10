import express from 'express';
import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import axios from 'axios';
import fs from 'fs';

import Post from '../mongodb/models/post.js';

dotenv.config();

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

async function downloadImageFromUrl(url) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return Buffer.from(response.data, 'binary');
    } catch (error) {
        console.error('Error downloading image');
    }
}

//? GET ALL POST
router.route('/').get(async (req, res) => {
    try {
        const posts = await Post.find({});
        res.status(200).json({ success: true, data: posts })
    } catch (error) {
        res.status(500).json({ success: false, message: error })
    }
})

//! CREATE A POST
router.route('/').post(async (req, res) => {
    try {
        const { name, prompt, photo } = req.body;
        const imageData = await downloadImageFromUrl(photo);
        // console.log(imageData);

        const tempFilePath = './temp-image.jpg';
        fs.writeFileSync(tempFilePath, imageData);

        const photoUrl = await cloudinary.uploader.upload(tempFilePath);

        fs.unlinkSync(tempFilePath);

        const newPost = await Post.create({
            name,
            prompt,
            photo: photoUrl.url,
        })
        console.log(photoUrl.url);

        res.status(201).json({ success: true, data: newPost })
    } catch (error) {
        // console.log(error);
        res.status(500).json({ success: false, message: error })
    }
})

export default router;