const mongoose = require('mongoose')

const LikeSchema = new mongoose.Schema({
    
    user_id:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'EndUser'},
    post_id:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'UserPost'},
    comment:{type:string,required:true}
   
  });
  
  const Like = mongoose.model("Like", LikeSchema);
  
  export default Like;