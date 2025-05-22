import request from "supertest";
import express from "express";
import authRoutes from "../routes/auth.routes";
import { authService } from "../services/auth.service";

jest.mock("../services/auth.service");

describe("Auth Refresh Token", () => {
  let app: express.Application;

  beforeEach(() => {
    jest.clearAllMocks();

    app = express();
    app.use(express.json());
    app.use("/auth", authRoutes);
  });

  describe("POST /auth/refresh", () => {
    it("should refresh the access token when given a valid refresh token", async () => {
      const mockToken = { access_token: "new-jwt-token" };
      const refreshToken = "valid-refresh-token";

      (authService.refreshToken as jest.Mock).mockReturnValue(mockToken);

      const response = await request(app)
        .post("/auth/refresh")
        .send({ refresh_token: refreshToken });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockToken);
      expect(authService.refreshToken).toHaveBeenCalledWith(refreshToken);
    });

    it("should return 400 if refresh token is missing", async () => {
      const response = await request(app).post("/auth/refresh").send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Refresh token is required"
      );
      expect(authService.refreshToken).not.toHaveBeenCalled();
    });

    it("should return 401 if refresh token is invalid", async () => {
      (authService.refreshToken as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid refresh token");
      });

      const response = await request(app)
        .post("/auth/refresh")
        .send({ refresh_token: "invalid-refresh-token" });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "Invalid refresh token");
    });

    it("should return 401 if refresh token has been revoked", async () => {
      (authService.refreshToken as jest.Mock).mockImplementation(() => {
        throw new Error("Refresh token has been revoked");
      });

      const response = await request(app)
        .post("/auth/refresh")
        .send({ refresh_token: "revoked-refresh-token" });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty(
        "message",
        "Refresh token has been revoked"
      );
    });
  });
});
