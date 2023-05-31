async function createUser(firstName, lastName, email, aboutMe) {
  const newUser = await prisma.users.create({
    data: {
      first_name: firstName,
      last_name: lastName,
      email: email,
      about_me: aboutMe,
    },
  });
  return newUser;
}

export const createUser = async (fastify, attrs) => {
  const { first_name, last_name, email, about_me } = attrs;
  const { user, error } = await fastify.prisma.users.create({
    data: {
      first_name,
      last_name,
      email,
      about_me,
    },
  });

  if (error) {
    throw error;
  }

  return { user };
};

export const findUserByEmail = async (fastify, attrs) => {
  const { email } = attrs;
  const { user, error } = await fastify.prisma.users.findUnique({
    where: {
      email: email,
    },
  });
};

async function updateUser(id, newFirstName, newLastName) {
  const updatedUser = await prisma.users.update({
    where: {
      id: id,
    },
    data: {
      first_name: newFirstName,
      last_name: newLastName,
    },
  });
  return updatedUser;
}

export const findUserByEmail = async (fastify, attrs) => {
  const { email } = attrs;
  const { user, error } = await fastify.prisma.users.findUnique({
    where: {
      email: email,
    },
  });

  if (error) {
    throw error;
  }

  return { user };
};

export const deleteUser = async (fastify, attrs) => {
  const { id } = attrs;
  const { user, error } = await fastify.prisma.users.delete({
    where: {
      id: id,
    },
  });

  if (error) {
    throw error;
  }

  return { user };
};

async function deleteUser(id) {
  const deletedUser = await prisma.users.delete({
    where: {
      id: id,
    },
  });
  return deletedUser;
}
