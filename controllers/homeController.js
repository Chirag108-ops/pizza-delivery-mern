const Menu = require('../models/menu')

exports.homeController = async (req, res) => {
    try {
        const pizzas = await Menu.find({});
        return res.status(200).json({
            success: true,
            message: 'Menu has been fetched successfully',
            pizzas
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error while displaying the menu',
            error: error.message
        })
    }
}