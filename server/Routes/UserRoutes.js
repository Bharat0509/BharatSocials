import express from 'express'
import { getPosts } from '../Controllers/PostController.js'
import { deleteUser, followUser, getUser, getUsers, unFollowUser, updateUser } from '../Controllers/UserController.js'

const router = express.Router()
router.get('/:id', getUser)
router.get('/:id/users', getUsers)
router.get('/posts/:id', getPosts)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)
router.put('/:id/follow', followUser)
router.put('/:id/unfollow', unFollowUser)
export default router
