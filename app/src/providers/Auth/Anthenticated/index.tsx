type IPropsType = {
  children: React.ReactNode;
};

export const Authenticated = (props: IPropsType) => {
  return <div>{props.children}</div>;
};
