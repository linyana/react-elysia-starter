import { Prisma } from "@prisma/client";
import { IAuthType, prisma } from "../../libs";
import {
	ICreateUserRequestType,
	IUpdateUserRequestType,
	IUserListRequestType,
} from "./types";

const SELECTED_FIELDS: Prisma.usersSelect = {
	id: true,
	createdAt: true,
	updatedAt: true,
	email: true,
	name: true,
};

class UserService {
	async getUsers({
		auth,
		query,
	}: {
		auth: IAuthType;
		query: IUserListRequestType;
	}) {
		const { offset = 0, limit = 10, keyword } = query;

		const where: Prisma.usersWhereInput = {
			tenantId: auth.tenantId,
			...(keyword
				? {
						OR: [
							{
								name: {
									contains: keyword,
									mode: "insensitive",
								},
							},
							{
								email: {
									contains: keyword,
									mode: "insensitive",
								},
							},
						],
					}
				: {}),
		};

		const [items, totalCount] = await Promise.all([
			prisma.users.findMany({
				where,
				orderBy: { updatedAt: "desc" },
				select: SELECTED_FIELDS,
				skip: offset,
				take: limit,
			}),
			prisma.users.count({ where }),
		]);

		return { items, totalCount };
	}

	async getUser({ id, auth }: { id: number; auth: IAuthType }) {
		const { tenantId } = auth;

		return prisma.users.findUniqueOrThrow({
			where: { id, tenantId },
			select: SELECTED_FIELDS,
		});
	}

	async createUser({
		body,
		auth,
	}: {
		body: ICreateUserRequestType;
		auth: IAuthType;
	}) {
		const { tenantId } = auth;

		const password = await Bun.password.hash(body.password);
		return prisma.users.create({
			data: { ...body, password, tenantId },
			select: SELECTED_FIELDS,
		});
	}

	updateUser({
		id,
		body,
		auth,
	}: {
		id: number;
		body: IUpdateUserRequestType;
		auth: IAuthType;
	}) {
		const { tenantId } = auth;

		return prisma.users.update({
			where: { id, tenantId },
			data: body,
			select: SELECTED_FIELDS,
		});
	}

	deleteUser({ ids, auth }: { ids: string[]; auth: IAuthType }) {
		const { tenantId } = auth;

		return prisma.users.deleteMany({
			where: {
				tenantId,
				id: {
					in: ids.map((id) => Number(id)),
				},
			},
		});
	}
}

export const userService = new UserService();
