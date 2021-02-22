import express from 'express';
import auth from '../../middleware/auth';

// Model
import Post from '../../models/post';

const router = express.Router();

// multer = aws s3와 통신에 도움주는 라이브러리
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';
dotenv.config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_PRIVATE_KEY,
});

const uploadS3 = multer({
  storage: multerS3({
    s3,
    bucket: 'hoonblog/upload',
    region: 'ap-northeast-2',
    key(req, file, cb) {
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext);
      cb(null, basename + new Date().valueOf() + ext);
    },
  }),
  limits: { fileSize: 100 * 1024 * 1024 },
});

// @route POST api/post/image
// @desc  Create a Post
// @access Private

router.post('/image', uploadS3.array('upload', 5), async (req, res, next) => {
  try {
    console.log(req.files.map((v) => v.location));
    res.json({ uploaded: true, url: req.files.map((v) => v.location) });
  } catch (e) {
    console.error(e);
    res.json({ uploaded: false, url: null });
  }
});

// router.post('/image', uploadS3.array('upload', 5), async (req, res, next) => {
//   try {
//     console.log('image post');
//     console.log(req.files.map((v) => v.location));
//     res.json({ uploaded: true, url: req.files.map((v) => v.location) });
//   } catch (e) {
//     console.error(e);
//     res.json({ uploaded: false, url: null });
//   }
// });

// api/post
router.get('/', async (req, res) => {
  // Find All Post from model
  const postFindResult = await Post.find();
  console.log(postFindResult, 'All Post Get');
  res.json(postFindResult);
});

router.post('/', auth, async (req, res, next) => {
  try {
    console.log(req, 'req');
    const { title, contents, fileUrl, creator } = req.body;
    const newPost = await Post.create({
      title,
      contents,
      fileUrl,
      creator,
    });
    res.json(newPost);
  } catch (err) {
    console.log('postApiErr', err);
  }
});

export default router;
