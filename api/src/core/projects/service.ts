import { prisma } from '@/libs';
import { ICreateProjectRequestType } from './types';

class ProjectService {
  getProjects() {
    return prisma.projects.findMany({
      orderBy: { updatedAt: 'desc' },
    });
  }

  getProject(id: number) {
    return prisma.projects.findUniqueOrThrow({ where: { id } });
  }

  deleteProject(id: number) {
    return prisma.projects.delete({
      where: { id },
    });
  }

  createProject(data: ICreateProjectRequestType) {
    return prisma.projects.create({
      data,
    });
  }
}

export const projectService = new ProjectService();
