import { FindAndCountOptions, Op, WhereOptions } from 'sequelize'
import { RequestBodyType } from '~/type'

const dynamicQuery = <T>(params: RequestBodyType): WhereOptions<T> | undefined => {
  let conditions: WhereOptions<T> = {}

  // Kiểm tra và thêm điều kiện cho mỗi tham số cần truy vấn
  if (params.filter.items.includes(-1)) {
    conditions = { ...conditions, status: { [Op.or]: params.filter.status } }
  } else {
    conditions = { ...conditions, [params.filter.field]: { [Op.in]: params.filter.items } }
  }

  if (params.search.term.length > 0) {
    conditions = { ...conditions, [params.search.field]: { [Op.like]: `%${params.search.term}%` } }
  }
  return Object.keys(conditions).length > 0 ? conditions : undefined
}

const getItemsQuery = <T>(body: RequestBodyType): FindAndCountOptions => {
  return {
    offset: (Number(body.paginator.page) - 1) * Number(body.paginator.pageSize),
    limit: body.paginator.pageSize === -1 ? undefined : body.paginator.pageSize,
    order: [[body.sorting.column, body.sorting.direction]],
    where: dynamicQuery<T>(body)
  }
}

export { dynamicQuery, getItemsQuery }
