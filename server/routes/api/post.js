import express from 'express'
import auth from '../../middleware/auth';

// Model 
import Post from '../../models/post'

const router = express.Router();

// api/post
router.get('/', async (req, res) => {
  // Find All Post from model
  const postFindResult = await Post.find();
  console.log(postFindResult, 'All Post Get');
  res.json(postFindResult);
})

router.post('/', auth, async (req, res, next) => {
  try {
    console.log(req, "req");
    const { title, contents, fileUrl, creator } = req.body;
    const newPost = await Post.create({
      title, contents, fileUrl, creator,
    })
    res.json(newPost);
  } catch (err) {
    console.log('postApiErr',err);
  }
})

export default router;
