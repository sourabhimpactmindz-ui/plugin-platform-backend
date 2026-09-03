import ProjectModel from "../models/projectSchema.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";


export const AuthanticatePlugin = async (
    req,
    res
) => {


    try {


        /*
        |--------------------------------------------------------------------------
        | Get Request Data
        |--------------------------------------------------------------------------
        */

        const {
            projectId,
            apiKey
        } = req.body || {};


        /*
        |--------------------------------------------------------------------------
        | Validate Required Fields
        |--------------------------------------------------------------------------
        */

        if (
            ! projectId ||
            ! apiKey
        ) {

            return res.status(400).json({

                message:
                    "Project ID and API Key are required",

                status:
                    false

            });

        }


        /*
        |--------------------------------------------------------------------------
        | Clean Values
        |--------------------------------------------------------------------------
        */

        const cleanProjectId =
            String(
                projectId
            ).trim();


        const cleanApiKey =
            String(
                apiKey
            ).trim();


        /*
        |--------------------------------------------------------------------------
        | Validate MongoDB ObjectId
        |--------------------------------------------------------------------------
        */

        if (
            ! mongoose.Types.ObjectId.isValid(
                cleanProjectId
            )
        ) {

            return res.status(401).json({

                message:
                    "Project is not found",

                status:
                    false

            });

        }


        /*
        |--------------------------------------------------------------------------
        | Find Project
        |--------------------------------------------------------------------------
        */

        const existingProject =
            await ProjectModel.findById(
                cleanProjectId
            );


        /*
        |--------------------------------------------------------------------------
        | Project Not Found
        |--------------------------------------------------------------------------
        */

        if (
            ! existingProject
        ) {

            return res.status(401).json({

                message:
                    "Project is not found",

                status:
                    false

            });

        }


        /*
        |--------------------------------------------------------------------------
        | Project Status
        |--------------------------------------------------------------------------
        */

        if (
            existingProject.status !==
            "active"
        ) {

            return res.status(403).json({

                message:
                    "Project is inactive",

                status:
                    false

            });

        }


        /*
        |--------------------------------------------------------------------------
        | API Key Validation
        |--------------------------------------------------------------------------
        */

        if (
            existingProject.apiKey !==
            cleanApiKey
        ) {

            return res.status(401).json({

                message:
                    "Invalid credentials",

                status:
                    false

            });

        }


        /*
        |--------------------------------------------------------------------------
        | JWT Secret Check
        |--------------------------------------------------------------------------
        */

        if (
            ! process.env.PLUGIN_ACCESS_KEY
        ) {

            console.error(
                "PLUGIN_ACCESS_KEY is missing"
            );


            return res.status(500).json({

                message:
                    "Server configuration error",

                status:
                    false

            });

        }


        /*
        |--------------------------------------------------------------------------
        | Create Access Token
        |--------------------------------------------------------------------------
        */

        const accessToken =
            jwt.sign(

                {

                    projectId:
                        existingProject._id.toString(),

                    domain:
                        existingProject.domain

                },

                process.env.PLUGIN_ACCESS_KEY,

                {

                    expiresIn:
                        "7d"

                }

            );


        /*
        |--------------------------------------------------------------------------
        | Success Response
        |--------------------------------------------------------------------------
        */

        return res.status(200).json({

            message:
                "Plugin authenticated successfully",

            status:
                true,

            data:
                {

                    accessToken:
                        accessToken

                }

        });


    } catch (
        err
    ) {


        /*
        |--------------------------------------------------------------------------
        | Server Log
        |--------------------------------------------------------------------------
        */

        console.error(
            "Plugin authentication error:",
            err
        );


        /*
        |--------------------------------------------------------------------------
        | Handle MongoDB CastError
        |--------------------------------------------------------------------------
        */

        if (
            err.name ===
            "CastError"
        ) {

            return res.status(401).json({

                message:
                    "Project is not found",

                status:
                    false

            });

        }


        /*
        |--------------------------------------------------------------------------
        | Generic Error
        |--------------------------------------------------------------------------
        */

        return res.status(500).json({

            message:
                "Something went wrong. Please try again later.",

            status:
                false

        });


    }


};