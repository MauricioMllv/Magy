import SliderHome from "../models/sliderHome.models.js";
import { deleteImage, uploadImage } from "../libs/cloudinary.sliderhome.js";
import fs from 'fs-extra';

export const getPosts = async (req, res) => {
    try {
        const posts = await SliderHome.find()
        res.send(posts)
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}

export const createPost = async (req, res) => {
    try {
      
        let image;

        if(req.files?.image) {
            const result = await uploadImage(req.files.image.tempFilePath)
            await fs.remove(req.files.image.tempFilePath)
            image = {
                url: result.secure_url,
                public_id: result.public_id
            }            
        }

        const newPost = new SliderHome({ image })

        await newPost.save()

        return res.json(newPost)
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}

export const updatePost = async (req, res) => {
    try {
        const updatedPost = await SliderHome.findByIdAndUpdate(req.params.id, req.body, { new: true })
        return res.send(updatedPost)
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}

export const deletePost = async (req, res) => {
    try {
        const postRemoved = await SliderHome.findByIdAndDelete(req.params.id)
        
        if (!postRemoved) return res.sendStatus(404)

        if (postRemoved.image.public_id) {
            await deleteImage(postRemoved.image.public_id)
        }
        return res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}

export const getPost = async (req, res) => {
    try {
        const post = await SliderHome.findById(req.params.id)
        if (!post) return res.sendStatus(404)
        return res.json(post)
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}