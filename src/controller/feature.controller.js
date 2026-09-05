import FeatureModel from "../models/featureSchema.js";
import ProjectFeatureModel from "../models/projectFeature.js";
import ProjectModel from "../models/projectSchema.js";


// ======================================
// CREATE FEATURE
// ======================================

export const CreateFeature = async (req, res) => {

    const { name, description } = req.body;
 
    try {

        if (!name) {
            return res.status(400).json({
                message: "Name is required",
                status: false
            });
        }


        const existingFeature =
            await FeatureModel.findOne({
                name: name.trim()
            });


        if (existingFeature) {
            return res.status(409).json({
                message: "Feature already exists",
                status: false
            });
        }


        const feature =
            new FeatureModel({
                name: name.trim(),
                description
            });


        await feature.save();


        return res.status(201).json({
            message: "Feature created successfully",
            status: true,
            data: feature
        });

    } catch (err) {

        return res.status(500).json({
            message: "Internal server error",
            status: false,
            error: err.message
        });

    }
};


// ======================================
// GET ALL FEATURES
// ======================================

export const GetAll = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;

    const skip = (page - 1) * limit ;

    try {

        const [allFeature , total] = await Promise.all([FeatureModel
                .find()
                .sort({ createdAt: 1 })
                .skip(skip)
                .limit(limit),

                FeatureModel.countDocuments()
            ]);
                const totalPages = Math.ceil(total / limit
        ) || 0;


        if (allFeature.length === 0) {
            return res.status(200).json({
                message: "Features not found",
                status: false,
                data: [],
                pagination : {
                    page,
                    limit,
                    total,
                    totalPages
                }
            });
        }

   

        return res.status(200).json({
            message: "Features fetched successfully",
            status: true,
            data: allFeature,
            pagination : {
                page,
                limit,
                total,
                totalPages
            }
        });

    } catch (err) {

        return res.status(500).json({
            message: "Internal server error",
            status: false,
            error: err.message
        });

    }
};

export const Featurestatus = async(req,res) => {
    const {featureId} = req.params;
    const {status} = req.body;

    try{
        const feature = await FeatureModel.findById(featureId);

        if(!feature){
            return res.status(404).json({message : "Feature is not found" , status : false})
        }

        feature.status = status;
        await feature.save();

        return res.status(200).json({message : "Feature updated successfully", status : true , data : feature})
    }catch(err){
        return res.status(500).json({message : "Internal server error",status : false , error : err.message})
    }
}

export const DeleteFeature = async(req,res) => {
    const  {featureId} = req.params;

    try {
        const feature = await FeatureModel.findById(featureId);

        if(!feature){
            return res.status(404).json({message : "Feature is not found" , status : false
            })
        }
          await FeatureModel.findByIdAndDelete(featureId);
          return res.status(200).json({message : "Feature deleted successfully" ,status : true})
    }catch(err){
        return res.status(500).json({message : "Intrenal server error", status : false , error : err.message})
    }
}

export const updateFeature = async (req, res) => {
  const { featureId } = req.params;
  const { name, description } = req.body;

  try {
    const feature = await FeatureModel.findByIdAndUpdate(
      featureId,
      {
        name,
        description,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!feature) {
      return res.status(404).json({
        message: "Feature is not found",
        status: false,
      });
    }

    return res.status(200).json({
      message: "Feature Updated successfully",
      status: true,
      data: feature,
    });

  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      status: false,
      error: err.message,
    });
  }
};


// ======================================
// GET PLUGIN FEATURES
// ======================================

export const GetPluginFeatures = async (req, res) => {

    try {

        // Project ID JWT se aa raha hai
        const projectId = req.data.projectId;

        if (!projectId) {
            return res.status(401).json({
                message: "Project ID not found in token",
                status: false
            });
        }

        // MongoDB _id se project find karo
        const project = await ProjectModel.findById(projectId);

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
                status: false
            });
        }

        // Project disabled hai to access deny
        if (project.status !== "active") {
            return res.status(403).json({
                message: "Project is disabled",
                status: false
            });
        }

        // Enabled features fetch karo
       const projectFeatures =
    await ProjectFeatureModel
        .find({
            projectId: project._id,
            enabled: true
        })
        .populate(
            "featureId",
            "name description status"
        );


const features =
    projectFeatures.filter(
        item =>
            item.featureId &&
            item.featureId.status === "active"
    );

            

        return res.status(200).json({
            message: "Features fetched successfully",
            status: true,
            data: features
        });

    } catch (err) {

        return res.status(500).json({
            message: "Internal server error",
            status: false,
            error: err.message
        });

    }
};

export const AllProjectFeature = async (req, res) => {
    const { projectId } = req.params;

    try {
        const project = await ProjectModel.findById(projectId);

        if (!project) {
            return res.status(404).json({
                message: "Project is not found",
                status: false
            });
        }

        if (project.status !== "active") {
            return res.status(403).json({
                message: "Project is inactive",
                status: false
            });
        }

        // Sirf active features
        const features = await FeatureModel.find({
            status: "active"
        });

        const projectFeatures = await ProjectFeatureModel.find({
            projectId: project._id
        });

        const featureStatusMap = new Map();

        projectFeatures.forEach((item) => {
            featureStatusMap.set(
                item.featureId.toString(),
                item.enabled
            );
        });

        const data = features.map((feature) => ({
            _id: feature._id,
            name: feature.name,
            description: feature.description,
            status: feature.status,
            enabled:
                featureStatusMap.get(feature._id.toString()) ?? false
        }));

        return res.status(200).json({
            message: "Project features fetched successfully",
            status: true,
            data
        });

    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
            status: false,
            error: err.message
        });
    }
};


export const UpdateProjectFeatureStatus =
    async (req, res) => {

        const {
            projectId,
            featureId
        } = req.params;


        const {
            enabled
        } = req.body;


        try {

            // Check project
            const project =
                await ProjectModel.findById(
                    projectId
                );


            if (!project) {

                return res.status(404).json({
                    message:
                        "Project not found",
                    status: false
                });

            }


            // Do not allow inactive projects
            if (project.status !== "active") {

                return res.status(400).json({
                    message:
                        "Project is inactive",
                    status: false
                });

            }


            // Check feature
            const feature =
                await FeatureModel.findById(
                    featureId
                );


            if (!feature) {

                return res.status(404).json({
                    message:
                        "Feature not found",
                    status: false
                });

            }


            // Do not allow inactive features
            if (feature.status !== "active") {

                return res.status(400).json({
                    message:
                        "Feature is inactive",
                    status: false
                });

            }


            // Create or update relation
            const projectFeature =
                await ProjectFeatureModel
                    .findOneAndUpdate(

                        {
                            projectId,
                            featureId
                        },

                        {
                            enabled
                        },

                        {
                            new: true,

                            upsert: true,

                            runValidators: true
                        }

                    );


            return res.status(200).json({

                message:
                    enabled
                        ? "Feature enabled successfully"
                        : "Feature disabled successfully",

                status: true,

                data:
                    projectFeature

            });

        } catch (err) {

            return res.status(500).json({

                message:
                    "Internal server error",

                status: false,

                error:
                    err.message

            });

        }

    };