import { t } from 'elysia';

export const CreateProjectSchema = {
  body: t.Object({
    name: t.String(),
    path: t.String(),
    description: t.Optional(t.String()),
    color: t.Optional(t.String()),
  }),
};

export type ICreateProjectRequestType = typeof CreateProjectSchema.body.static;
