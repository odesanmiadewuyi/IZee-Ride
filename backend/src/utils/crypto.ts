import bcrypt from "bcryptjs";

/**
 * Hash a password before storing in DB
 * @param password Plain text password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
};

/**
 * Compare plain password with hashed password
 * @param password Plain text password
 * @param hashedPassword Hashed password from DB
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};
