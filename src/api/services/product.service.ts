import { getItemsQuery } from '~/helpers/query'
import ProductSchema, { Product } from '~/models/product.model'
import { RequestBodyType } from '~/type'
import CompletionSchema from '../models/completion.model'
import CuttingGroupSchema from '../models/cutting-group.model'
import GarmentAccessorySchema from '../models/garment-accessory.model'
import ImportationSchema from '../models/importation.model'
import PrintablePlaceSchema from '../models/printable-place.model'
import ProductColorSchema from '../models/product-color.model'
import ProductGroupSchema from '../models/product-group.model'
import SampleSewingSchema from '../models/sample-sewing.model'
import SewingLineDeliverySchema from '../models/sewing-line-delivery.model'

const NAMESPACE = 'services/products'

export const createNewItem = async (item: Product) => {
  try {
    const newItem = await ProductSchema.create(item)
    return newItem
  } catch (error: any) {
    throw `${error.message}`
  }
}

// Get by id
export const getItemByPk = async (id: number) => {
  try {
    const itemFound = await ProductSchema.findByPk(id)
    if (!itemFound) throw new Error(`Item not found`)
    return itemFound
  } catch (error: any) {
    throw `${error.message}`
  }
}

// Get by id
export const getItemByProductCode = async (productCode: string) => {
  try {
    const itemFound = await ProductSchema.findOne({ where: { productCode: productCode } })
    if (!itemFound) throw new Error(`Item not found`)
    return itemFound
  } catch (error: any) {
    throw `${error.message}`
  }
}

// Get all
export const getItems = async (body: RequestBodyType) => {
  try {
    const items = await ProductSchema.findAndCountAll(getItemsQuery(body))
    return items
  } catch (error: any) {
    throw `${error.message}`
  }
}

// Update
export const updateItemByPk = async (id: number, itemToUpdate: Product) => {
  try {
    const itemFound = await ProductSchema.findByPk(id)
    if (!itemFound) throw new Error(`Item not found`)
    await itemFound.update(itemToUpdate)
    return itemFound
  } catch (error: any) {
    throw `${error.message}`
  }
}

export const updateItems = async (itemsUpdate: Product[]) => {
  try {
    const updatedItems = await Promise.all(
      itemsUpdate.map(async (item) => {
        const user = await ProductSchema.findByPk(item.id)
        if (!user) {
          throw new Error(`Item with id ${item.id} not found`)
        }
        await user.update(item)
        return user
      })
    )
    return updatedItems
  } catch (error: any) {
    throw `${error.message}`
  }
}

// Delete
export const deleteItemByPk = async (id: number) => {
  try {
    const itemFound = await ProductSchema.findByPk(id)
    if (!itemFound) throw new Error(`Item not found`)
    // ProductColor, ProductGroup, PrintablePlace, Importation, SampleSewing, GarmentAccessory, CuttingGroup, SewingLine, Completion

    // item
    const productColorFound = await ProductColorSchema.findOne({ where: { productID: id } })
    if (productColorFound) await productColorFound.destroy()

    // item
    const productGroupFound = await ProductGroupSchema.findOne({ where: { productID: id } })
    if (productGroupFound) await productGroupFound.destroy()

    // item
    const printablePlaceFound = await PrintablePlaceSchema.findOne({ where: { productID: id } })
    if (printablePlaceFound) await printablePlaceFound.destroy()

    // items
    const importationsFound = await ImportationSchema.findAll({ where: { productID: id } })
    if (importationsFound.length > 0) {
      importationsFound.forEach(async (item) => {
        await item.destroy()
      })
    }

    // item
    const sampleSewingFound = await SampleSewingSchema.findOne({ where: { productID: id } })
    if (sampleSewingFound) await sampleSewingFound.destroy()

    // item
    const garmentAccessoryFound = await GarmentAccessorySchema.findOne({ where: { productID: id } })
    if (garmentAccessoryFound) await garmentAccessoryFound.destroy()

    // item
    const cuttingGroupFound = await CuttingGroupSchema.findOne({ where: { productID: id } })
    if (cuttingGroupFound) await cuttingGroupFound.destroy()

    // items
    const sewingLineDeliveryFound = await SewingLineDeliverySchema.findAll({ where: { productID: id } })
    if (sewingLineDeliveryFound.length > 0) {
      sewingLineDeliveryFound.forEach(async (item) => {
        await item.destroy()
      })
    }

    // item
    const completionFound = await CompletionSchema.findOne({ where: { productID: id } })
    if (completionFound) await completionFound.destroy()

    await itemFound.destroy()
    return { message: 'Deleted successfully' }
  } catch (error: any) {
    throw `${error.message}`
  }
}
