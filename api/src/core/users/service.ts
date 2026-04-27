import { Prisma } from "@prisma/client";
import { prisma } from "../../libs";
import type { IListResponseType } from "../../types";
import { ICreateUserRequestType } from "./types";

const publicFields = {
	id: true,
	createdAt: true,
	updatedAt: true,
	email: true,
	name: true,
} as const;

type IGetUsersParams = {
	tenantId?: number;
	offset?: number;
	limit?: number;
	keyword?: string;
};

type IUserRecord = Prisma.usersGetPayload<{ select: typeof publicFields }>;

class UserService {
	async getUsers({
		tenantId,
		offset = 0,
		limit = 10,
		keyword,
	}: IGetUsersParams = {}): Promise<IListResponseType<IUserRecord>> {
		const where: Prisma.usersWhereInput = {
			...(tenantId ? { tenantId } : {}),
			...(keyword
				? {
						OR: [
							{ name: { contains: keyword, mode: "insensitive" } },
							{ email: { contains: keyword, mode: "insensitive" } },
						],
					}
				: {}),
		};

		const [items, totalCount] = await Promise.all([
			prisma.users.findMany({
				where,
				orderBy: { updatedAt: "desc" },
				select: publicFields,
				skip: offset,
				take: limit,
			}),
			prisma.users.count({ where }),
		]);

		return { items, totalCount };
	}

	getUser(id: number) {
		return prisma.users.findUniqueOrThrow({
			where: { id },
			select: publicFields,
		});
	}

	async createUser(data: ICreateUserRequestType, tenantId: number) {
		const password = await Bun.password.hash(data.password);
		return prisma.users.create({
			data: { ...data, password, tenantId },
			select: publicFields,
		});
	}

	deleteUser(id: number) {
		return prisma.users.delete({ where: { id } });
	}
}

export const userService = new UserService();
