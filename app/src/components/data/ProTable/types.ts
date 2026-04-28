import { PERMISSION } from "@api/constants";
import { TableColumnType } from "antd";

export type IColumnType<T> = TableColumnType<T> & {
  permissions?: PERMISSION[];
};

export type IColumnsType<T> = IColumnType<T>[];
