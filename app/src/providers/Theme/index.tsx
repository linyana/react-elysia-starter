import { ConfigProvider } from 'antd';

type IPropsType = {
  children: React.ReactNode;
};

export const ThemeProvider = ({ children }: IPropsType) => (
  <>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#333333',
          controlItemBgActive: '#E6E6E6',
          fontFamily:
            "Inter, 'Noto Sans SC', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        },
        components: {
          Layout: {
            headerBg: 'transparent',
            bodyBg: 'transparent',
            footerBg: 'transparent',
          },
          Button: {
            primaryShadow: 'none',
            defaultShadow: 'none',
            dangerShadow: 'none',
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  </>
);
