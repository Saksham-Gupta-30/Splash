import express from 'express';
import * as dotenv from 'dotenv';
// import deepai from 'deepai';
import axios from 'axios';

dotenv.config();

const router = express.Router();

// deepai.setApiKey(process.env.DEEPAI_API_KEY);

router.route('/').get((req, res) => {
    res.send('Hello from deepaiRoutes!');
})

router.route('/').post(async (req, res) => {
    const { prompt } = req.body;
    try {
        const response = await axios.post('https://api.deepai.org/api/text2img', {
            text: prompt,
            grid_size: '1',
        }, {
            headers: {
                'api-key': process.env.DEEPAI_API_KEY,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        const resp = response.data;
        console.log(resp);
        // var resp = {
        //     id: '51087d1a-374c-481f-9d18-f6aed93b34af',
        //     output_url: 'https://api.deepai.org/job-view-file/a0cae9f3-6f94-487c-acd3-7fc715480951/outputs/output.jpg'
        // }
        const image = resp.output_url
        res.status(200).json({ photo: image });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
    }
})

export default router;