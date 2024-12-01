const mongoose = require('mongoose')

const PermissionSchema = new mongoose.Schema({

    user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'EndUser' },
    permissions: [{
        permissionName: String,
        permissionValue: [String]
    }]


});

const Permission = mongoose.model("Permission", PermissionSchema);

export default Permission;