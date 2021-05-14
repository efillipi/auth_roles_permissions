import { Router } from "express";
import UserController from "./controllers/UserController";
import SessionController from "./controllers/SessionController";
import PermissionController from "./controllers/PermissionController";
import RoleController from "./controllers/RoleController";
import ProductController from "./controllers/ProductController";

import { is } from "./middlewares/permission";

const router = Router();

router.post("/sessions", SessionController.create);
router.post("/users", UserController.create);
router.post("/permissions", PermissionController.create);
router.post("/roles", RoleController.create);

router.get("/users", UserController.all);
router.get("/permissions", PermissionController.all);
router.get("/roles", RoleController.all);


router.get("/roles/:id", RoleController.byId);

router.post("/products",
  is(["ADM"], ["ADM"]),
  ProductController.create);
router.get(
  "/products",
  is(["ADM", "ROLE_USER"], ["LIST"]),
  ProductController.index
);
router.get(
  "/products/:id",
  is(["ADM", "ROLE_USER"], ["EDIT"]),
  ProductController.show
);

export { router };
