import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    // required: true

  },
  email: {
    type: String,
    // required: true

  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  profilePicture: {
    type: String,
    default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6a5FBvP4u9cMnjSzrrddZ46a2xha3CbH3YstYNetepNcWtHO86Vok5H_EDAy4wbj5Y8w&usqp=CAU'
  },
  coverPicture: {
    type: String,
    default: 'https://th.bing.com/th/id/OIP.Soh-aFCXN0UqOLokQHm4oAHaCv?w=321&h=129&c=7&r=0&o=5&dpr=1.25&pid=1.7'
  },
  about: String,
  livesin: String,
  worksAt: String,
  relationship: String,
  followers: [],
  followings: []
}
  ,
  {
    timestamps: true
  }
)

const UserModel = mongoose.model('Users', userSchema)
export default UserModel
