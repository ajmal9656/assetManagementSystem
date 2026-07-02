import bcrypt from "bcrypt";
import { performModelQuery } from "../utils/commonQuery.js";

export const login = async ({ email, password }) => {
  const admin = await performModelQuery("Admin", "findOne", {
    where: { email },
  });

  if (!admin) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordMatched = await bcrypt.compare(
    password,
    admin.password
  );

  if (!isPasswordMatched) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
  };
};