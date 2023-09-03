const Menu = require('../../models/menu')
const {uploadImageToCloudinary} = require('../../config/cloudinary')
exports.deleteMenu = async(req, res) => {
    try{
        const {id} = req.body
        await Menu.findByIdAndDelete(id)
        return res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        })
    }
}

exports.updateMenu = async(req, res) => {
    try{
        const {name, price, size, id} = req.body
        let image = req?.files?.image
        if(!name || !price || !size || !id){
            return res.status(404).json({
                success : false,
                message : 'All fields are required'
            })
        }
        console.log(image)
        let updatedMenu
        if(image){
            image = await uploadImageToCloudinary(
                image,
                process.env.FOLDER_NAME,
            )
            updatedMenu = await Menu.findByIdAndUpdate(id,{
                name,
                price,
                size,
                image: image.secure_url
            },
            {
                new : true
            })
        }
        else{
            updatedMenu = await Menu.findByIdAndUpdate(id,{
                name,
                price,
                size,
            },
            {
                new : true
            })
        }
        return res.status(200).json({
            success : true,
            message : 'Pizza has been updated Successfully',
            updatedMenu
        })
    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            success : false,
            message : 'Internal server error'
        })
    }
}

exports.addMenu = async(req, res) => {
    try{
        const {name, price, size} = req.body
        let image = req.files.image
        if(!image || !name || !price || !size){
            return res.status(404).json({
                success : false,
                message : 'All fields are required'
            })
        }
        image = await uploadImageToCloudinary(
            image,
            process.env.FOLDER_NAME,
        )
        const newItem = await Menu.create({
            image: image.secure_url,
            name,
            price,
            size
        })
        return res.status(200).json({
            success : true,
            message : 'Pizza has been created Successfully',
            newItem
        })
    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            success : false,
            message : 'Internal server error'
        })
    }
}