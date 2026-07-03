import { Op, Sequelize } from "sequelize";
import * as db from "../models/index.js";

const enableLogging = process.env.ENABLE_QUERY === "NO";

export const performModelQuery = async (modelName, operation, data) => {
  try {
    const Model = db[modelName];
    if (!Model) throw new Error(`Model '${modelName}' does not exist.`);

    let {
      attributes,
      order = [],
      where = {},
      include,
      page = 1,
      limit = 10,
      subQuery = false,
      update,
      status,
      updatedBy,
      distinct = false,
      passJson = true,
      groupBy,
    } = data;

    if (include) {
      include = prepareIncludes(include, db);
    }

    const resolvedOrder =
      Array.isArray(order) && order.length ? prepareOrderModels(order, db) : [];

    const operationHandlers = getOperationHandlers({
      Model,
      data,
      where,
      update,
      status,
      updatedBy,
      attributes,
      include,
      order: resolvedOrder,
      page,
      limit,
      subQuery,
      distinct,
      passJson,
      groupBy,
    });

    if (!operationHandlers[operation]) {
      throw new Error(`Operation '${operation}' is not supported.`);
    }

    return await operationHandlers[operation]();
  } catch (error) {
    console.log("Error occurred while executing performModelQuery: " + error);
    throw error;
  }
};

function prepareIncludes(includeArray, models) {
  return includeArray.map((include) => {
    if (!models[include.model]) {
      throw new Error(`Model '${include.model}' does not exist.`);
    }

    const resolvedInclude = {
      ...include,
      model: models[include.model],
    };

    if (include.include) {
      resolvedInclude.include = prepareIncludes(include.include, models);
    }

    return resolvedInclude;
  });
}

function prepareOrderModels(orderArr, models) {
  return orderArr.map((orderItem) => {
    if (!Array.isArray(orderItem)) return orderItem;

    return orderItem.map((item) => {
      if (
        typeof item === "object" &&
        item?.model &&
        typeof item.model === "string"
      ) {
        const modelName = item.model;
        if (!models[modelName]) {
          throw new Error(`Model '${modelName}' does not exist.`);
        }
        return { ...item, model: models[modelName] };
      }
      return item;
    });
  });
}

function getOperationHandlers({
  Model,
  data,
  where,
  update,
  status,
  updatedBy,
  attributes,
  include,
  order,
  page,
  limit,
  subQuery,
  distinct,
  passJson,
  groupBy,
}) {
  return {
    create: async () => {
      return Model.create(data);
    },
    insertMany: async () => {
      if (!Array.isArray(data))
        throw new Error("bulkCreate requires an array.");
      return Model.bulkCreate(data);
    },

    findOne: async () => {
      const result = await Model.findOne({
        where,
        attributes,
        include,
        order,
        subQuery,
        raw: false,
        logging: enableLogging
          ? (sql) => console.log(`SQL (findOne): ${sql}`)
          : false,
      });
      return result?.toJSON() || null;
    },

    read: async () => {
      const offset = (page - 1) * limit;
      const results = await Model.findAndCountAll({
        where,
        attributes,
        include,
        order,
        offset,
        limit,
        subQuery,
        raw: false,
        distinct: true,
        col: "id",
        logging: enableLogging
          ? (sql) => console.log(`SQL (read): ${sql}`)
          : false,
      });

      const remainingCount =
        page !== "*" ? Math.max(0, results.count - limit * page) : 0;

      return {
        result: results.rows.map((r) => r.toJSON()),
        total_pages: Math.ceil(results.count / limit),
        current_page: page,
        total_count: results.count,
        remaining_count: remainingCount,
      };
    },

    readAllWithoutCount: async () => {
      const results = await Model.findAll({
        where,
        attributes,
        include,
        order,
        subQuery,
        logging: (sql) => console.log(`SQL (readAllWithoutCount): ${sql}`),
      });

      return {
        result: results.map((r) => r.toJSON()),
        fetchedCount: results.length,
      };
    },

    readAll: async () => {
      const documents = await Model.findAll({
        where,
        include,
        attributes,
        order,
        logging: enableLogging
          ? (sql) => console.log(`SQL (readAll): ${sql}`)
          : false,
      });

      const total_count = await Model.count({
        where,
      });

      const result = passJson
        ? documents.map((doc) => doc.toJSON())
        : documents;

      return {
        result,
        total_count,
      };
    },

    update: async () => {
      if (!update) {
        throw new Error("Missing update data.");
      }

      await Model.update(update, { where });

      return Model.findOne({ where });
    },

    updateStatus: async () => {
      if (status == null) throw new Error("Missing status.");

      if (updatedBy == null) throw new Error("Missing updatedBy.");

      await Model.update(
        {
          status,
          updatedBy,
        },
        { where },
      );

      return Model.findOne({ where });
    },

    delete: () => Model.destroy({ where }),

    count: async () => {
      const options = {
        where,
        logging: enableLogging
          ? (sql) => console.log(`SQL (count): ${sql}`)
          : false,
      };

      if (groupBy && data.attributes) {
        return Model.findAll({
          ...options,
          attributes: data.attributes,
          group: [groupBy],
          raw: true,
        });
      }

      return Model.count(options);
    },
    aggregate: async () => {
      const result = await Model.findAll({
        where,
        attributes,
        include,
        order,
        group: groupBy ? [groupBy] : undefined,
        raw: true,
        logging: enableLogging
          ? (sql) => console.log(`SQL (aggregate): ${sql}`)
          : false,
      });

      return result;
    },
  };
}

export const checkFieldValueExist = async (
  modelName,
  field,
  value,
  id,
  extraCondition = {},
) => {
  console.log("Starting execution of checkFieldValueExist");
  try {
    const Model = db[modelName];
    if (!Model) throw new Error(`Model '${modelName}' does not exist.`);

    let whereClause = {
      [field]: typeof value === "string" ? value.trim() : value,
    };

    if (Object.keys(extraCondition).length) {
      Object.assign(whereClause, extraCondition);
    }

    if (id !== undefined) {
      whereClause.id = { [Op.ne]: id };
    }

    const count = await Model.count({ where: whereClause });
    return count > 0;
  } catch (err) {
    console.log("Error occurred while executing checkFieldValueExist: " + err);
    throw err;
  }
};
