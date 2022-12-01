import exress from 'express'
import { loginUser, registerUser } from '../Controllers/AuthContoroller.js'

const router = exress.Router()

router.get('/', (req, res) => {
  res.send('Auth Routes')
})

router.post('/register', registerUser)
router.post('/login', loginUser)
export default router
