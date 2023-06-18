// @ts-nocheck

export const createRecord = async (fastify, model, data, validate) => {
  const validationResult = validate(data);
  if (Object.keys(validationResult).length !== 0) {
    return { errors: validationResult.errors };
  }

  const { newRecord, error } = await fastify.prisma.workspace.create({
    data: attrs,
  });

  if (error) {
    throw error;
  }

  return newRecord;
};

export const findRecordById = async (
  fastify,
  model: string,
  id: string,
  validate
) => {
  const validationResult = validate(data);
  if (Object.keys(validationResult).length !== 0) {
    return { errors: validationResult.errors };
  }

  const { record, error } = await fastify.prisma[model].findUnique({
    where: {
      id: id,
    },
  });

  if (error) {
    throw error;
  }

  return record;
};

export const updateRecordById = async (fastify, model, data, validate) => {
  const validationResult = validate(data);
  if (Object.keys(validationResult).length !== 0) {
    return { errors: validationResult.errors };
  }

  const { updatedRecord, error } = await fastify.prisma[model].update({
    where: {
      id: data.id,
    },
    data: data,
  });

  if (error) {
    throw error;
  }

  return updatedRecord;
};

export const deleteRecordById = async (fastify, model, data, validate) => {
  const validationResult = validate(data.id);
  if (Object.keys(validationResult).length !== 0) {
    return { errors: validationResult.errors };
  }

  const { deletedRecord, error } = await fastify.prisma[model].delete({
    where: {
      id: data.id,
    },
  });

  if (error) {
    throw error;
  }

  return deletedRecord;
};
