export const superAdmin = {
  role: "SUPER_ADMIN",
  name: "Founder",
  phone:
    process.env.SUPER_ADMIN_PHONE ||
    "",
  email:
    process.env.SUPER_ADMIN_EMAIL ||
    "",
};