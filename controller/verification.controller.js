import verification from "../model/verification.model.js";

export const Verification = async (req, res, next) => {
    try {
        const { govtIdType, socailMediaLink } = req.body;
        const photo = req.files?.photo ? req.files.photo[0].path : null;
        const govtIdPhoto = req.files?.govtIdPhoto ? req.files.govtIdPhoto[0].path : null;

      
        const verificate = await verification.create({ photo, govtIdType, govtIdPhoto, socailMediaLink });
        res.status(200).json({
            success: true,
            data: verificate
        })
    }
    catch (error) {
        next(error);
    }
}

export const viewVerification = async(req,res,next) =>{
    const viewVerificate=await verification.find();
    try{
       res.status(200).json({
        success:true,
        data:viewVerificate
       })
    }
    catch(error){
        next (error);
    }
}
