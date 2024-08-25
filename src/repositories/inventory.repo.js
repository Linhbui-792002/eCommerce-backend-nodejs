import Inventory from '../models/inventory.model.js';
import { Types } from 'mongoose';

const insertInventory= async ({
    productId, shopId, stock , location 
}) => {
    return await Inventory.create({
        inven_product: productId,
        inven_stock: stock,
        inven_shopId: shopId,
        inven_location: location, 
    })
}

export {
    insertInventory
}