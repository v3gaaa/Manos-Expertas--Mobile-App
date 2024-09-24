import express, { Request, Response } from 'express';
import multer from 'multer';
import mongoose from 'mongoose';

const router = express.Router();

const storage = multer.memoryStorage(); 
const upload = multer({ storage });

const fileUploadRoutes = (bucket: mongoose.mongo.GridFSBucket) => {
    router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
        console.log('Uploading file:', req.file?.originalname);

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded.' });
        }

        try {
            const uploadStream = bucket.openUploadStream(req.file.originalname);
            uploadStream.end(req.file.buffer);

            uploadStream.on('finish', () => {
                console.log('File uploaded successfully:', uploadStream.id);
                res.status(200).json({ 
                    success: true,
                    message: 'File uploaded successfully', 
                    fileId: uploadStream.id
                });
            });

            uploadStream.on('error', (error) => {
                console.error('File upload failed:', error);
                res.status(500).json({ success: false, message: 'File upload failed', error });
            });
        } catch (error) {
            console.error('Error during file upload:', error);
            res.status(500).json({ success: false, message: 'Error during file upload', error });
        }
    });

    router.get('/files/:fileId', async (req: Request, res: Response) => {
        const fileId = req.params.fileId;

        try {
            const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));

            downloadStream.on('data', (chunk) => {
                res.write(chunk); 
            });

            downloadStream.on('end', () => {
                res.end(); 
            });

            downloadStream.on('error', (error) => {
                console.error('File retrieval failed:', error);
                res.status(404).json({ message: 'File not found' });
            });
        } catch (error) {
            console.error('Error retrieving file:', error);
            res.status(500).json({ message: 'Error retrieving file', error });
        }
    });

    return router; 
};

export default fileUploadRoutes;




