import { Request, Response } from 'express'
import { Role } from '~/api/models/role.model'
import * as service from '~/services/role.service'
import { RequestBodyType } from '~/type'
import { message } from '../utils/constant'

const NAMESPACE = 'controllers/role'

export default class RoleController {
  constructor() {}

  createNewItem = async (req: Request, res: Response) => {
    const itemRequest: Role = {
      ...req.body,
      status: req.body.status ?? 'active'
    }
    try {
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
    const id = Number(req.params.id)
    try {
      const item = await service.getItemByPk(id)
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
    const id = Number(req.params.id)
    const itemRequest: Role = {
      ...req.body
    }
    try {
      const printUpdated = await service.updateItemByPk(id, itemRequest)
      if (printUpdated) {
        return res.formatter.ok({ data: printUpdated, message: message.UPDATED })
      }
      return res.formatter.badRequest({ message: message.UPDATE_FAILED })
    } catch (error: any) {
      return res.formatter.badRequest({ message: `${error.message}` })
    }
  }

  deleteItemByPk = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    try {
      const item = await service.deleteItemByPk(id)
      if (item) {
        return res.formatter.ok({ message: message.DELETED })
      }
      return res.formatter.notFound({ message: message.DELETE_FAILED })
    } catch (error: any) {
      return res.formatter.badRequest({ message: `${error.message}` })
    }
  }
}
