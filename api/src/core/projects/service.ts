import { prisma } from '../../libs';
import { ITokenClaims } from '../../libs';
import { ICreateProjectRequestType } from './types';

class ProjectService {
  getProjects(_auth: ITokenClaims) {
    return prisma.projects.findMany({
      orderBy: { updatedAt: 'desc' },
    });
  }

  getProject(id: number, _auth: ITokenClaims) {
    return prisma.projects.findUniqueOrThrow({ where: { id } });
  }

  deleteProject(id: number, _auth: ITokenClaims) {
    return prisma.projects.delete({
      where: { id },
    });
  }

  createProject(data: ICreateProjectRequestType, _auth: ITokenClaims) {
    return prisma.projects.create({
      data,
    });
  }
}

export const projectService = new ProjectService();
