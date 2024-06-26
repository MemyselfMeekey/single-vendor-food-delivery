const AppError = require("../../exception/error.app");
const MenuDB = require("../menu/menu.db");
const OfferDB = require("./db.offer");

class OfferService{
    create=async(data)=>{
        try{
            const offer=new OfferDB(data)
            return await offer.save()
            // offer table data entry 

            // obj ===> return
        }
        catch(exception){
            console.log(exception)
            throw exception
        }
    }
    addMenu= async(menu)=>{
        try{
           
               
                if (menu && Array.isArray(menu)) {
                     

                    const menuIds = menu.map((item) => item.menuId)  

                    return menuIds
                } 
            
        }
        catch(exception){
            throw exception
        }
    }
    getDetailsById=async(menuId)=>{
        try{
         
            const menuItems= await MenuDB.find({_id:{$in:menuId}})//search menu according to id as it is in array
            // .populate('menu.menuId',['_id','name','slug'])
            return menuItems
        }
        catch(exception){
            throw exception
        }
    }
    getAllDetails=async(menuItems,menu,authUser)=>{
        try{    
            
        let storeData=[]
            menuItems.map((menuDetail,ind)=>{
               
                let singleItem={}
                menu.menu.map((item) => {

                    if(menuDetail._id.equals(item.menuId)) {
                        const offerPrice = menuDetail.price - menuDetail.price * item.offerDiscount/100
                        
                        singleItem = {...item,offerPrice, price: menuDetail.price}
                        
                    }
                    
                })
               
                storeData.push(singleItem)
                menu.updatedBy=authUser
               
            })

        return {
            ...menu,
            menu: storeData
        }
        }
        catch(exception){
            throw exception
        }
    }
    getTotalCount=async(filter)=>{
        try{
            const count=await OfferDB.countDocuments(filter)
            return count
        }
        catch(exception){
            throw exception
        }
    }
    getDataByFilter=async({offset,filter,limit})=>{
        try{
            const offer=await OfferDB.find(filter)
            .populate('createdBy',['_id','name','email'])
            .populate('menu.menuId',['_id','name','slug'])
            .sort({'_data':"desc"})
            .skip(offset)
            .limit(limit)
            return offer
        }
        catch(exception){
            throw exception
        }
    }

    getDataById=async(id)=>{
        try{
            const data=await OfferDB.findById(id)
            return data
        }
        catch(exception){
            throw exception
        }
    }
    updateOffer=async(id,data)=>{
        try{
            console.log("data going",data)
            const update=await OfferDB.findByIdAndUpdate(id,{
                $set:data
            },{
                new:true
            })
            console.log("data updating",update)
            return update
        }    
        catch(exception){
            throw exception
        }
    }
    deleteById=async(id)=>{
        try{
            const deleteOffer=await OfferDB.findByIdAndDelete(id)
            if(!deleteOffer){
                throw new AppError({message:"This id doesnot exists anymore",code:400})
            }
            return deleteOffer
        }   
        catch(exception){
            throw exception
        }
    }
}
const OfferSvc= new OfferService()
module.exports=OfferSvc