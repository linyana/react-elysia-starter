import { Modal, Input, List, Empty } from 'antd';
import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { IRouteType } from '@/types';

type ICommand = { key: string; label: React.ReactNode; path: string };

const joinPath = (base: string, sub: string) =>
  `${base.replace(/\/$/, '')}/${sub.replace(/^\//, '')}`.replace(/\/+/g, '/');

const flattenRoutes = (routes: IRouteType[], parent = ''): ICommand[] =>
  routes.flatMap((r) => {
    const sub = r.path ?? '';
    const full = sub ? joinPath(parent, sub) : parent;

    const self =
      r.handle?.menu?.label && r.path && !r.path.includes('*') && !r.path.includes('http')
        ? [{ key: full, label: r.handle.menu.label, path: full }]
        : [];

    return [...self, ...(r.children ? flattenRoutes(r.children, full) : [])];
  });

type IPropsType = {
  open: boolean;
  onClose: () => void;
  routes: IRouteType[];
};

export const CommandPalette = ({ open, onClose, routes }: IPropsType) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const all = useMemo(() => flattenRoutes(routes), [routes]);
  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((c) => String(c.label).toLowerCase().includes(q));
  }, [all, query]);

  useEffect(() => {
    setActive(0);
  }, [query, open]);

  const select = (cmd?: ICommand) => {
    const target = cmd ?? items[active];
    if (!target) return;
    navigate(target.path);
    setQuery('');
    onClose();
  };

  const onKeyDown: React.KeyboardEventHandler = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      select();
    }
  };

  return (
    <Modal
      open={open}
      onCancel={() => {
        setQuery('');
        onClose();
      }}
      footer={null}
      closable={false}
      destroyOnHidden
      styles={{ body: { padding: 0 } }}
    >
      <Input
        autoFocus
        size="large"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
        prefix={<Search size={16} style={{ opacity: 0.6, marginRight: 4 }} />}
        placeholder="Jump to page…"
        variant="borderless"
        style={{ padding: '14px 16px' }}
      />
      <div style={{ maxHeight: 360, overflow: 'auto', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        {items.length === 0 ? (
          <Empty
            description="No matches"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ padding: 24 }}
          />
        ) : (
          <List
            size="small"
            dataSource={items}
            renderItem={(item, i) => (
              <List.Item
                onClick={() => select(item)}
                onMouseEnter={() => setActive(i)}
                style={{
                  cursor: 'pointer',
                  padding: '10px 16px',
                  border: 'none',
                  background: i === active ? 'rgba(0,0,0,0.05)' : undefined,
                }}
              >
                <span style={{ flex: 1 }}>{item.label}</span>
                <span style={{ opacity: 0.4, fontSize: 12 }}>{item.path}</span>
              </List.Item>
            )}
          />
        )}
      </div>
    </Modal>
  );
};
