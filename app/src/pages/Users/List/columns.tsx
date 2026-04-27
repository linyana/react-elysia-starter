type IPropsType = {
	onSuccess: () => void;
};

export default ({ onSuccess }: IPropsType) => {
	return [
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
		},
		{
			title: "Created At",
			dataIndex: "createdAt",
			key: "createdAt",
			render: (text: string) => new Date(text).toLocaleString(),
		},
	];
};
