const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    categories:{type:Array,required:false}
  });
  
  const UserPost = mongoose.model("UserPost", PostSchema);
  
  export default UserPost;