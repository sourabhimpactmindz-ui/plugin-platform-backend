import ClientModel from "../models/client.js";
import ProjectModel from "../models/projectSchema.js";
import ProjectFeatureModel from "../models/projectFeature.js";
import crypto from "crypto";

export const CreateClient = async (req, res) => {
    const { name, email } = req.body;

    try {
        if (!name || !email) {
            return res.status(400).json({ message: "All fields are required", status: false })
        }

        const existingClient = await ClientModel.findOne({ email });
        if (existingClient) {
            return res.status(400).json({ message: "Client already exists", status: false })
        }
        const client = new ClientModel({
            email,
            name,
        })

        await client.save();

        return res.status(201).json({ message: "Client created successfully", status: true, data: client })

    } catch (err) {
        return res.status(500).json({
            message: "Internal server error", status: false, error: err.message
        })
    }
}

export const GetAllClients = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;

    const skip = (page - 1) * limit;
    try {
        const [clients,total] = await Promise.all([ClientModel.find()
        .sort({createdAt : 1})
        .skip(skip)
        .limit(limit),
        ClientModel.countDocuments()
]);

    const totalPages = Math.ceil(total / limit) || 0;
    

        if (!clients || clients.length === 0) {
            return res.status(200).json({ message: "No clients found", status: false,data:[] ,
                pagination : {
                    page,
                    limit,
                    total,totalPages
                }
             })
        }

        return res.status(200).json({ message: "Client fatched successfully", status: true, data: clients ,pagination : {
            page,
            limit,
            total,
            totalPages
        } })
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", status: false, error: err.message })
    }
}

export const SingleClient = async (req, res) => {
    const { clientId } = req.params;
    try {
        const client = await ClientModel.findByIdAndDelete(clientId);
        if (!client) {
            return res.status(404).json({ message: "Client not found", status: false })
        }
        return res.status(200).json({ message: "Client fatched successfully", status: true, data: client })
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", status: false, error: err.message })
    }
}

export const DeleteClient = async (req, res) => {
    const { clientId } = req.params;

    try {

        // 1. Find client first
        const client = await ClientModel.findById(clientId);

        if (!client) {
            return res.status(404).json({
                message: "Client not found",
                status: false
            });
        }


        // 2. Find all projects of this client
        const projects = await ProjectModel.find({
            clientId: client._id
        });


        // Get all project MongoDB IDs
        const projectIds = projects.map(
            (project) => project._id
        );


        // 3. Delete all project features
        if (projectIds.length > 0) {

            await ProjectFeatureModel.deleteMany({
                projectId: {
                    $in: projectIds
                }
            });

        }


        // 4. Delete all projects
        await ProjectModel.deleteMany({
            clientId: client._id
        });


        // 5. Delete client
        await ClientModel.findByIdAndDelete(
            client._id
        );


        return res.status(200).json({
            message: "Client and all related projects deleted successfully",
            status: true
        });

    } catch (err) {

        return res.status(500).json({
            message: "Internal server error",
            status: false,
            error: err.message
        });

    }
};

export const UpdateClients = async(req,res) => {
    const {clientId} = req.params;
    const {status} = req.body;
  
    try {
            if (!["active", "inactive"].includes(status)) {
            return res.status(400).json({
                message: "Invalid status",
                status: false
            });
        }

        const client = await ClientModel.findById(clientId)

        if(!client){
            return res.status(403).json({message : "Client not found",status : false})
        }


        client.status = status;
        await client.save();


        if(status === "inactive"){
            await ProjectModel.updateMany({clientId : client._id},{$set : {
                status : "disabled",
            }})
        }

        return res.status(200).json({
      message:
        status === "inactive"
          ? "Client and all projects disabled successfully"
          : "Client updated successfully",
      status: true,
      data: client,
    });



    }catch(err){
        return res.status(500).json({message : "internal server error",status : "false"})
    }
}
