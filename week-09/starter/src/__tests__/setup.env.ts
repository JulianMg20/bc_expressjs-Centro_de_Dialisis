process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "test-secret-access";
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "test-secret-refresh";
process.env.JWT_ACCESS_EXPIRES = "15m";
process.env.JWT_REFRESH_EXPIRES = "7d";