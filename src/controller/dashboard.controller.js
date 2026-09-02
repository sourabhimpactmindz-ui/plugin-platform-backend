import ClientModel from "../models/client.js"
import FeatureModel from "../models/featureSchema.js";
import ProjectModel from "../models/projectSchema.js";


export const GetDashboardView = async(req , res) => {
    try { 
        const totalsClient = await ClientModel.countDocuments();

        const totalProjects = await ProjectModel.countDocuments();

        const activeProject = await ProjectModel.countDocuments({
            status : "active"
        });

        const ActiveFeature = await FeatureModel.countDocuments({
            status : "active"
        })

        return res.status(200).json({message : "dashboard overview fatch" , status : true , data : {
            totalsClient,
            totalProjects,
            activeProject,
            ActiveFeature
        }})

    }catch(err){
        return res.status(500).json({message : "Server error",status : false})
    }
}