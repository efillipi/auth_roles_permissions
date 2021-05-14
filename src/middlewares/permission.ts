import { Request, Response, NextFunction } from "express";
import { decode } from "jsonwebtoken";
import { getCustomRepository } from "typeorm";
import UserRepository from "../repositories/UserRepository";
import PermissionRepository from "../repositories/PermissionRepository";
import RoleRepository from "../repositories/RoleRepository";
import User from "../models/User";

async function decoder(request: Request): Promise<User | undefined> {

  const authHeader = request.headers.authorization || "";
  const userRepository = getCustomRepository(UserRepository);
  const permissionRepository = getCustomRepository(PermissionRepository);
  const roleRepository = getCustomRepository(RoleRepository);

  const [, token] = authHeader?.split(" ");

  const payload = decode(token);

  const user = await userRepository.findOne(payload?.sub, {
    join: {
      alias: "user",
      leftJoinAndSelect: {
        role: "user.roles",
        permission: "role.permission",
      }
    },
  });

  return user
}

function is(role: String[], permission: String[]) {
  const roleAuthorized = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const user = await decoder(request);



    const userRoles = user?.roles.map((role) => role.name);
    console.log({ userRoles })

    const existsRoles = userRoles?.some((r) => role.includes(r));

    if (!existsRoles) {
      return response.status(401).json({ message: "Not authorized!" });
    }

    const rolesPermission = user?.roles?.map((role) => role.permission.map((p) => p.name));
    const x = rolesPermission?.map((perm) => perm)

    console.log({ rolesPermission })
    console.log({ x })


    if (x) {
      return next();
    }

    return response.status(401).json({ message: "Not authorized!" });
  };

  return roleAuthorized;
}

export { is };
