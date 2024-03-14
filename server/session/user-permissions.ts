import { Request, Response } from 'express';

export default (req: Request, res: Response) => {
  const token = req.session.securityToken?.accessToken;
  const userState = req.session.securityToken?.userState;
  const userRoles = userState?.roles;
  const permissions = new Set<number>();

  userRoles?.forEach((role) => {
    role.permissions?.forEach((permission) => {
      permissions.add(permission.permissionId);
    });
  });

  const uniquePermissions = Array.from(permissions);

  if (token && userState) {
    res.send({
      permissions: userRoles,
      uniquePermissions: uniquePermissions,
    });
  } else {
    res.send({});
  }
};
