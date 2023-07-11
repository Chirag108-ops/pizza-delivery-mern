const Order = require('../../models/order')

exports.orderController = async (req, res) => {
  try {
    const pendingOrder = await Order.aggregate([
      {
        $match: {
          status: {
            $ne: 'completed'
          }
        }
      },
      {
        $sort: {
          'createdAt': -1
        }
      },
      {
        $lookup: {
          from: 'users', // Replace 'users' with the actual name of your User collection
          localField: 'customerId',
          foreignField: '_id',
          as: 'customerId'
        }
      },
      {
        $unwind: '$customerId'
      }
    ]);
    return res.status(200).json({
      success: true,
      message: 'All the pending orderes are fetched successfully',
      data: pendingOrder
    })
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error while fetching the incomplete orders',
      error: error.message
    })
  }
}