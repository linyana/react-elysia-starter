import { icons } from 'lucide-react';

export const Icon = ({ name, size = 18 }: { name: keyof typeof icons; size?: number }) => {
  const IconComponent = icons[name];
  return (
    <IconComponent size={size} style={{ verticalAlign: 'middle', transform: 'translateY(-2px)' }} />
  );
};
