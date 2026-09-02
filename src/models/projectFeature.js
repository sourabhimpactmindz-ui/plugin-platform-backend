import mongoose from "mongoose";

const projectFeature = new mongoose.Schema({
    projectId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Project",
        required : true,
    
    },

    featureId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Feature",
        required : true,
    
    },

    enabled : {
        type : Boolean,
        default : false
    }
},{timestamps: true})




const ProjectFeatureModel = mongoose.model("ProjectFeature" , projectFeature);

export default ProjectFeatureModel;