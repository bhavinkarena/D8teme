import mongoose, {Schema} from "mongoose";

const userprofileSchema = new Schema(
    {
        userID:{
            type: Schema.Types.ObjectId,
            ref:"User"
        },
        friends: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        firstname: {
            type: String,
            required: true,
            lowercase: true, 
            index: true
        },
        lastname: {
            type: String,
            lowercase: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true,
            validate: {
              validator: function (v) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
              },
              message: (props) => `${props.value} is not a valid email!`,
            },
        },
        DOB:{
            type:Date,
            required: true
        },
        profileImage: {
            type: String,
            require:true,
        },
        gender:{
            type : String,
            enum : ['Male', 'Female', 'Other'],
            require:true
        },
        show_me:{
            type : String,
            enum: ['Male', 'Female', 'Other'],
            require:true
        },
        member_status:{
            type:Boolean,
            default:false
        },
        last_online_time:{
            type:Date
        },
        height:{
            type:String 
        },
        height_verification:{
            type:Boolean,
            default:false
        },
        body_type:{
            type:String
        },
        bio_video_url:{
            type:String 
        },
        bio_content:{
            type:String
        }
    },
    {
        timestamps: true
    }
)

export const UserProfile = mongoose.model("UserProfile", userprofileSchema)