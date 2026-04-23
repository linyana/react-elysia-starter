export const getStatus = (code?: string) => {
	switch (code) {
		case "NOT_FOUND":
			return 404;
		case "VALIDATION":
			return 422;
		default:
			return 400;
	}
};

export const safeJson = (value: unknown) => {
	if (typeof value !== "string") return value;
	try {
		return JSON.parse(value);
	} catch {
		return value;
	}
};

