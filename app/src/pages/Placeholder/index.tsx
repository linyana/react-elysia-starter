import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

export const Placeholder = ({ title }: { title: string }) => (
  <Card>
    <Title level={3} style={{ marginTop: 0 }}>
      {title}
    </Title>
    <Paragraph type="secondary">This is a placeholder page for {title}.</Paragraph>
  </Card>
);
