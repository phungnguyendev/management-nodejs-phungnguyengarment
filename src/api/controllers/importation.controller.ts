import { Request, Response } from 'express'
import { Importation } from '~/models/importation.model'
import * as service from '~/services/importation.service'
import { RequestBodyType } from '~/type'
import { message } from '../utils/constant'

const NAMESPACE = 'controllers/importation'

export default class ImportationController {
  constructor() {}

  createNewItem = async (req: Request, res: Response) => {
    try {
      const itemRequest: Importation = {
        dateImported: req.body.dateImported,
        status: req.body.status ?? 'active',
        quantity: req.body.quantity,
        productID: req.body.productID
      }
      const itemNew = await service.createNewItem(itemRequest)

      if (itemNew) {
        return res.formatter.created({ data: itemNew, message: message.CREATED })
      }
      return res.formatter.badRequest({ message: message.CREATION_FAILED })
    } catch (error: any) {
      return res.formatter.badRequest({ message: `${error.message}` })
    }
  }

  getItemByPk = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id)
      const item = await service.getItemByPk(id)
      if (item) {
        return res.formatter.ok({ data: item, message: message.SUCCESS })
      }
      return res.formatter.notFound({ message: message.NOT_FOUND })
    } catch (error: any) {
      return res.formatter.badRequest({ message: `${error.message}` })
    }
  }

  getItemByProductID = async (req: Request, res: Response) => {
    const productID = Number(req.params.productID)
    try {
      const item = await service.getItemByProductID(productID)
      if (item) {
        return res.formatter.ok({ data: item, message: message.SUCCESS })
      }
      return res.formatter.notFound({ message: message.NOT_FOUND })
    } catch (error: any) {
      return res.formatter.badRequest({ message: `${error.message}` })
    }
  }

  getItems = async (req: Request, res: Response) => {
    try {
      const bodyRequest: RequestBodyType = {
        ...req.body
      }
      const items = await service.getItems(bodyRequest)
      const total = await service.getItemsWithStatus(bodyRequest.filter.status)
      return res.formatter.ok({
        data: items.rows,
        length: items.rows.length,
        page: Number(bodyRequest.paginator.page),
        pageSize: Number(bodyRequest.paginator.pageSize),
        total: bodyRequest.search.term.length > 0 ? items.count : total.length,
        message: message.SUCCESS
      })
    } catch (error: any) {
      return res.formatter.badRequest({ message: `${error.message}` })
    }
  }

  updateItemByPk = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id)
      const itemRequest: Importation = {
        productID: req.body.productID,
        dateImported: req.body.dateImported,
        status: req.body.status ?? 'active',
        quantity: req.body.quantity
      }
      const itemUpdated = await service.updateItemByPk(id, itemRequest)
      if (itemUpdated) {
        return res.formatter.ok({ data: itemUpdated, message: message.UPDATED })
      }
      return res.formatter.badRequest({ message: message.UPDATE_FAILED })
    } catch (error: any) {
      return res.formatter.badRequest({ message: `${error.message}` })
    }
  }

  createOrUpdateItemByPk = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id)
      const itemRequest: Importation = {
        dateImported: req.body.dateImported,
        status: req.body.status ?? 'active',
        quantity: req.body.quantity
      }
      const itemFound = await service.getItemByPk(id)
      if (itemFound) {
        const itemUpdated = await service.updateItemByPk(id, itemRequest)
        if (itemUpdated) {
          return res.formatter.ok({ data: itemUpdated, message: message.UPDATE_FAILED })
        } else {
          return res.formatter.badRequest({ message: message.UPDATE_FAILED })
        }
      } else {
        const itemCreated = await service.createNewItem(itemRequest)
        if (itemCreated) {
          return res.formatter.created({ data: itemCreated, message: message.CREATED })
        } else {
          return res.formatter.badRequest({ message: message.CREATION_FAILED })
        }
      }
    } catch (error: any) {
      return res.formatter.badRequest({ message: `${error.message}` })
    }
  }

  // createOrUpdateItemByProductID = async (req: Request, res: Response) => {
  //   try {
  //     const productID = Number(req.params.productID)
  //     const itemRequest: Importation = {
  //       dateImported: req.body.dateImported,
  //       status: req.body.status ?? 'active',
  //       quantity: req.body.quantity
  //     }
  //     const itemFound = await service.getItemByProductID(productID)
  //     if (itemFound) {
  //       const itemUpdated = await service.updateItemByProductID(productID, itemRequest)
  //       if (itemUpdated) {
  //         return res.formatter.ok({ data: itemUpdated, message: message.UPDATE_FAILED })
  //       } else {
  //         return res.formatter.badRequest({ message: message.UPDATE_FAILED })
  //       }
  //     } else {
  //       const itemCreated = await service.createNewItem(itemRequest)
  //       if (itemCreated) {
  //         return res.formatter.created({ data: itemCreated, message: message.CREATED })
  //       } else {
  //         return res.formatter.badRequest({ message: message.CREATION_FAILED })
  //       }
  //     }
  //   } catch (error: any) {
  //     return res.formatter.badRequest({ message: `${error.message}` })
  //   }
  // }

  deleteItemByPk = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id)
      const item = await service.deleteItemByPk(id)
      if (item) {
        return res.formatter.ok({ message: message.DELETED })
      }
      return res.formatter.notFound({ message: message.DELETE_FAILED })
    } catch (error: any) {
      return res.formatter.badRequest({ message: `${error.message}` })
    }
  }

  deleteItemByProductID = async (req: Request, res: Response) => {
    try {
      const productID = Number(req.params.productID)
      const item = await service.deleteItemByProductID(productID)
      if (item) {
        return res.formatter.ok({ message: message.DELETED })
      }
      return res.formatter.notFound({ message: message.DELETE_FAILED })
    } catch (error: any) {
      return res.formatter.badRequest({ message: `${error.message}` })
    }
  }
}
