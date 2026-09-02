import ClientModel from "../models/client.js";
import ProjectModel from "../models/projectSchema.js";
import crypto from "crypto";
import bcrypt from "bcrypt"

export const CreateProject = async (req, res) => {
  const { name, domain, clientId } = req.body;

  try {
    if (!name || !domain || !clientId) {
      return res.status(400).json({
        message: "All fields are required",
        status: false,
      });
    }

    // Find client using MongoDB _id
    const existingClient = await ClientModel.findById(clientId);

    if (!existingClient) {
      return res.status(404).json({
        message: "Client not found",
        status: false,
      });
    }

    // Don't allow inactive client
    if (existingClient.status === "inactive") {
      return res.status(403).json({
        message: "Cannot create project because client is inactive",
        status: false,
      });
    }

    // Normalize domain
    const cleanDomain = domain
      .replace(/^https?:\/\//, "")
      .replace(/\/$/, "")
      .toLowerCase()
      .trim();

    // Check existing domain
    const existingProject = await ProjectModel.findOne({
      domain: cleanDomain,
    });

    if (existingProject) {
      return res.status(409).json({
        message: "This domain already exists",
        status: false,
      });
    }

    const apiKey = `pk_${crypto
      .randomBytes(16)
      .toString("hex")}`;

    const newProject = await ProjectModel.create({
      clientId: existingClient._id,
      name: name.trim(),
      domain: cleanDomain,
      apiKey,
      status: "active",
    });

    return res.status(201).json({
      message: "Project created successfully",
      status: true,
      data: newProject,
    });

  } catch (err) {
    console.log("CREATE PROJECT ERROR:", err);

    return res.status(500).json({
      message: "Internal error",
      status: false,
      error: err.message,
    });
  }
};

export const AllProject = async(req,res) => {
    try{
        const project = await ProjectModel.find() .populate("clientId", "name");

        if(!project){
            return res.status(200).json({message : "project is not found",status : false , data : []})
        }
        
        return res.status(200).json({message : "all projects fatched",status : true , data : project})


    }catch(err){
        return res.status(500).json({message : "Internal server error",status : false , error : err.message})
    }
}

export const ProjectStatus = async(req,res) => {
    const {projectId} = req.params
    const {status} = req.body;
    try{
        const projects = await ProjectModel.findById(projectId).populate("clientId")

        if(!projects){

            return res.status(403).json({message : "Project is not found",status : false})
        }

        if(projects.clientId.status === "inactive" && status === "active"){
            return res.status(403).json({message :"cannot activate the project , client is inactivate",status : false})
        }

        projects.status = status

        await projects.save()

        return res.status(200).json({message : "Project updated successfully" , data : projects , status : true})

    }catch(err){
        return res.status(500).json({message : "Internal server error",status : false})
    }
}

export const DeleteProject = async(req,res) => {
    const {projectId} = req.params;

    try{
        const project = await ProjectModel.findById(projectId)
        if(!project){
            return res.status(403).json({message : "Project is not found",status : false})
        }

        await ProjectModel.findByIdAndDelete(projectId)
        return res.status(200).json({message : "Project is deleted successfully",status : true})
    }catch(err){
        return res.status(500).json({message : "Internal server error",status : false , error : err.message})
    }
}