import request from "supertest";
import express from "express";
import authRoutes from "../routes/auth.routes";
import { authService } from "../services/auth.service";
import { usersService } from "../services/users.service";

jest.mock("../services/auth.service");
jest.mock("../services/users.service");

describe("Auth Routes", () => {
  let app: express.Application;

  beforeEach(() => {
    jest.clearAllMocks();

    app = express();
    app.use(express.json());
    app.use("/auth", authRoutes);
  });

  describe("POST /auth/register", () => {
    it("should register a new user and return a token", async () => {
      const mockToken = {
        access_token: "jwt-token",
        refresh_token: "refresh-token",
      };

      (authService.register as jest.Mock).mockResolvedValue(mockToken);

      const response = await request(app)
        .post("/auth/register")
        .send({ email: "test@example.com", password: "password123" });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockToken);
      expect(authService.register).toHaveBeenCalledWith(
        "test@example.com",
        "password123"
      );
    });

    it("should return 400 if email is missing", async () => {
      const response = await request(app)
        .post("/auth/register")
        .send({ password: "password123" });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(authService.register).not.toHaveBeenCalled();
    });

    it("should return 400 if password is missing", async () => {
      const response = await request(app)
        .post("/auth/register")
        .send({ email: "test@example.com" });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(authService.register).not.toHaveBeenCalled();
    });

    it("should return 400 if user already exists", async () => {
      (authService.register as jest.Mock).mockRejectedValue(
        new Error("User with this email already exists")
      );

      const response = await request(app)
        .post("/auth/register")
        .send({ email: "existing@example.com", password: "password123" });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "User with this email already exists"
      );
    });
  });

  describe("POST /auth/login", () => {
    it("should login a user and return a token", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        password: "hashedpassword",
      };
      const mockToken = {
        access_token: "jwt-token",
        refresh_token: "refresh-token",
      };

      (authService.validateUser as jest.Mock).mockResolvedValue(mockUser);
      (authService.login as jest.Mock).mockReturnValue(mockToken);

      const response = await request(app)
        .post("/auth/login")
        .send({ email: "test@example.com", password: "password123" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockToken);
      expect(authService.validateUser).toHaveBeenCalledWith(
        "test@example.com",
        "password123"
      );
      expect(authService.login).toHaveBeenCalledWith(mockUser);
    });

    it("should return 400 if email is missing", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({ password: "password123" });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(authService.validateUser).not.toHaveBeenCalled();
    });

    it("should return 400 if password is missing", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({ email: "test@example.com" });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(authService.validateUser).not.toHaveBeenCalled();
    });

    it("should return 401 if credentials are invalid", async () => {
      (authService.validateUser as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post("/auth/login")
        .send({ email: "test@example.com", password: "wrongpassword" });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "Invalid credentials");
      expect(authService.login).not.toHaveBeenCalled();
    });
  });

  describe("GET /auth/profile", () => {
    it("should return user profile if token is valid", async () => {
      const mockUser = { id: 1, email: "test@example.com" };
      const mockToken = "valid-jwt-token";
      const mockDecoded = { email: "test@example.com", sub: 1 };

      (authService.verifyToken as jest.Mock).mockReturnValue(mockDecoded);
      (usersService.findByEmail as jest.Mock).mockReturnValue(mockUser);

      const response = await request(app)
        .get("/auth/profile")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
      expect(authService.verifyToken).toHaveBeenCalledWith(mockToken);
      expect(usersService.findByEmail).toHaveBeenCalledWith(mockDecoded.email);
    });

    it("should return 401 if no token is provided", async () => {
      const response = await request(app).get("/auth/profile");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty(
        "message",
        "Unauthorized - No token provided"
      );
      expect(authService.verifyToken).not.toHaveBeenCalled();
    });

    it("should return 401 if token is invalid", async () => {
      (authService.verifyToken as jest.Mock).mockReturnValue(null);

      const response = await request(app)
        .get("/auth/profile")
        .set("Authorization", "Bearer invalid-token");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty(
        "message",
        "Unauthorized - Invalid token"
      );
      expect(usersService.findByEmail).not.toHaveBeenCalled();
    });

    it("should return 401 if user not found", async () => {
      const mockToken = "valid-jwt-token";
      const mockDecoded = { email: "nonexistent@example.com", sub: 999 };

      (authService.verifyToken as jest.Mock).mockReturnValue(mockDecoded);
      (usersService.findByEmail as jest.Mock).mockReturnValue(undefined);

      const response = await request(app)
        .get("/auth/profile")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty(
        "message",
        "Unauthorized - User not found"
      );
    });
  });
});
