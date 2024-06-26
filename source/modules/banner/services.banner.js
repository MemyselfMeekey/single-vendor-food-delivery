const AppError = require("../../exception/error.app")
const BannerModel=require("./db.banner")
class BannerService{
    transformCreateObject=(data,authUserId)=>{
      
        const formattedData={
            ...data
        }
        
        formattedData.image=formattedData.image.filename
        formattedData.createdBy=authUserId
        return formattedData
    }
    createBanner=async(data)=>{
        try{
            console.log(data)
            const banner=new BannerModel(data)
            return await banner.save()
        }
        catch(exception){
            throw exception
        }
    }
    getTotalCount=async(filter)=>{
        try{
          
            const count=await BannerModel.countDocuments(filter)
            return count
        }
        catch(exception){
            throw exception
        }
    }
    getDataByFilter=async({offset,filter,limit})=>{
        try{
            const data=await BannerModel.find(filter)
            .populate("createdBy",["_id","name","email"])
            .sort({'_id':"desc"})
            .skip(offset)
            .limit(limit)
            return data
        }
        catch(exception){
            throw exception
        }
    }
    getDataById=async(id)=>{
       try{
        const data=await BannerModel.findById(id)
        return data
       }    
       catch(exception){
        throw exception
       }
    }
    transformUpdateObject=async(data,oldBanner,authUserId)=>{
        try{    
            console.log("oldBanner",oldBanner)
            let formattedData={
                ...data
            }
            if(data.image){
                formattedData.image=data.image.filename
            }
            else{
                formattedData.image=oldBanner.image
            }
            formattedData.updatedBy=authUserId
            console.log("Formatted Data",formattedData)
            return formattedData
        }
        catch(exception){
            throw exception
        }
    }
    updateBan=async(banner,data)=>{
        try{
            console.log("Updating Banner Data",data)
            console.log("banner",banner._id)
            const update=await BannerModel.findByIdAndUpdate(banner._id,{
                $set:data
            },{
                new:true
            })
            console.log("updated data",update)
            return update
        }
        catch(exception){
            throw exception
        }
    }
    deleteById=async(id)=>{
        try{
            const deleteBanner=await BannerModel.findByIdAndDelete(id)
            if(!deleteBanner){
                throw new AppError({message:"Banner doesnot exists",code:400})
            }
            return deleteBanner
        }
        catch(exception){
            throw exception
        }
    }
}
const BannerSvc=new BannerService()
module.exports=BannerSvc