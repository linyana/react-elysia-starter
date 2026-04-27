import { useState } from 'react';
import { Avatar, Dropdown, Flex, Typography, theme } from 'antd';
import { EllipsisVertical, LogOutIcon, User } from 'lucide-react';
import { LAYOUT } from '@/config';
import { useAuth, useGlobal } from '@/hooks';

const { Text } = Typography;

export const UserProfile = () => {
  const { user, collapsed } = useGlobal();
  const { logout } = useAuth();
  const [hover, setHover] = useState(false);
  const {
    token: { controlItemBgHover, borderRadius },
  } = theme.useToken();

  if (!user) return null;

  return (
    <Dropdown
      arrow
      trigger={['click']}
      placement={collapsed ? 'topLeft' : 'top'}
      menu={{
        items: [
          {
            key: 'info',
            label: (
              <Flex align="center" gap="8px">
                <Avatar size={32} shape="square" icon={<User size={16} />} />
                <Flex vertical>
                  <Text strong>{user?.name || 'User'}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {user?.email}
                  </Text>
                </Flex>
              </Flex>
            ),
            disabled: true,
          },
          { type: 'divider' },
          {
            key: 'logout',
            danger: true,
            label: 'Log out',
            icon: <LogOutIcon size={14} />,
            onClick: () => logout(),
          },
        ],
      }}
    >
      <Flex
        align="center"
        justify="center"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          cursor: 'pointer',
          height: 48,
          paddingInline: LAYOUT.SMALL_PADDING,
          borderRadius,
          background: hover ? controlItemBgHover : 'transparent',
          transition: 'background 0.2s ease',
        }}
      >
        <Avatar
          size={32}
          shape="square"
          icon={<User size={16} />}
          style={{ flexShrink: 0 }}
        />
        <div
          style={{
            maxWidth: collapsed ? 0 : 200,
            overflow: 'hidden',
            transition: 'max-width 0.2s ease',
            marginLeft: collapsed ? 0 : LAYOUT.SMALL_PADDING,
            flex: collapsed ? 'none' : 1,
          }}
        >
          <Flex
            align="center"
            justify="space-between"
            gap={8}
            style={{
              whiteSpace: 'nowrap',
              opacity: collapsed ? 0 : 1,
              transform: collapsed ? 'translateX(-6px)' : 'translateX(0)',
              transition: 'opacity 0.2s ease, transform 0.2s ease',
              pointerEvents: collapsed ? 'none' : 'auto',
            }}
          >
            <Flex vertical style={{ minWidth: 0 }}>
              <Text strong>{user?.name || 'User'}</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {user?.email}
              </Text>
            </Flex>
            <EllipsisVertical size={14} style={{ opacity: 0.6, flexShrink: 0 }} />
          </Flex>
        </div>
      </Flex>
    </Dropdown>
  );
};
