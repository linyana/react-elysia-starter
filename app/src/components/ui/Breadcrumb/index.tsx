import { Breadcrumb as AntBreadcrumb } from 'antd';
import { useLocation, useMatches, useNavigate } from 'react-router-dom';
import type { IMenuType } from '@/types';
import { Icon } from '../Icon';

type IExtraCrumbType = {
  title: React.ReactNode;
  /** Optional path; if omitted the crumb is rendered as plain text (current page). */
  to?: string;
};

type IPropsType = {
  /** Trailing crumbs that can't be derived from routes (e.g. entity names on detail pages). */
  extra?: IExtraCrumbType[];
  /** Override the home link target. Defaults to "/". */
  homeTo?: string;
  style?: React.CSSProperties;
};

type IRouteMatchType = {
  id: string;
  pathname: string;
  handle?: { menu?: IMenuType; breadcrumb?: boolean };
};

/**
 * Auto-resolved breadcrumb for the layout slot.
 *
 * Visibility rules (in priority order):
 * 1. Leaf route's `handle.breadcrumb === false` → hidden.
 * 2. Leaf route's `handle.breadcrumb === true` → shown.
 * 3. Otherwise: shown only when the current path has 2+ segments
 *    (i.e. detail / nested pages). Top-level pages stay clean.
 */
export const AutoBreadcrumb = () => {
  const matches = useMatches() as IRouteMatchType[];
  const { pathname } = useLocation();

  const leaf = matches[matches.length - 1];
  const explicit = leaf?.handle?.breadcrumb;

  if (explicit === false) return null;

  if (explicit !== true) {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length < 2) return null;
  }

  return <Breadcrumb />;
};

/**
 * Route-driven breadcrumb.
 *
 * Crumbs are derived from `useMatches()` — each matched route whose
 * `handle.menu.label` is set contributes one crumb. The home icon is always
 * rendered first; the last crumb (current page) is plain text.
 *
 * For dynamic trailing crumbs (e.g. an entity name on a detail page), pass
 * them via `extra`.
 */
export const Breadcrumb = ({ extra = [], homeTo = '/', style }: IPropsType) => {
  const navigate = useNavigate();
  const matches = useMatches() as IRouteMatchType[];

  const routeCrumbs = matches
    .filter((m) => m.handle?.menu?.label)
    .map((m) => ({
      title: m.handle!.menu!.label,
      to: m.pathname,
    }));

  const allCrumbs = [...routeCrumbs, ...extra];

  const items = [
    {
      key: '__home__',
      title: <Icon name="House" size={14} />,
      onClick: () => navigate(homeTo),
      className: 'crumb-link',
    },
    ...allCrumbs.map((c, i) => {
      const isLast = i === allCrumbs.length - 1;
      return {
        key: `${i}`,
        title: c.title,
        onClick: !isLast && c.to ? () => navigate(c.to!) : undefined,
        className: !isLast && c.to ? 'crumb-link' : undefined,
      };
    }),
  ];

  return (
    <AntBreadcrumb
      style={{ marginBottom: 8, ...style }}
      items={items.map(({ onClick, className, title, key }) => ({
        key,
        title:
          onClick !== undefined ? (
            <span
              className={className}
              onClick={onClick}
              style={{ cursor: 'pointer' }}
            >
              {title}
            </span>
          ) : (
            title
          ),
      }))}
    />
  );
};
