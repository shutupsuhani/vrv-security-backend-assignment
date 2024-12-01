const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    
    user_id:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'EndUser'},
    post_id:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'UserPost'},
    comment:{type:string,required:true}
   
  });
  
  const Comment = mongoose.model("Comment", CommentSchema);
  
  export default Comment;