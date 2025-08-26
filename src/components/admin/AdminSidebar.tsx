import {
  Package,
  LayoutDashboard,
  LineChart,
  ListChecks,
  User,
  ShoppingBag,
  Settings,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface NavItem {
  name: string;
  href: string;
  icon: any;
  current: boolean;
  children?: NavItem[];
  title?: string;
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

export function AdminSidebar() {
  const { t } = useTranslation('admin');
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const navigation = [
    {
      name: t('navigation.dashboard'),
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      current: isActive('/admin/dashboard')
    },
    {
      name: t('navigation.warehouse'),
      href: '/admin/warehouse',
      icon: Package,
      current: location.pathname.includes('/admin/warehouse'),
      children: [
        {
          name: t('navigation.addItem'),
          href: '/admin/warehouse/add-item',
          current: location.pathname === '/admin/warehouse/add-item'
        },
        {
          name: t('navigation.bulkOperations'),
          href: '/admin/warehouse/bulk',
          current: location.pathname === '/admin/warehouse/bulk'
        },
        {
          name: t('navigation.solutions'),
          href: '/admin/warehouse/solutions',
          current: location.pathname === '/admin/warehouse/solutions'
        },
        {
          name: t('navigation.categories'),
          href: '/admin/warehouse/categories',
          current: location.pathname === '/admin/warehouse/categories'
        },
        {
          name: t('navigation.itemTypes'),
          href: '/admin/warehouse/item-types',
          current: location.pathname === '/admin/warehouse/item-types'
        },
        {
          title: t('navigation.visualBuilder'),
          href: '/admin/warehouse/visual-builder',
          current: location.pathname === '/admin/warehouse/visual-builder'
        },
        {
          name: t('navigation.quickSale'),
          href: '/admin/warehouse/quick-sale',
          current: location.pathname === '/admin/warehouse/quick-sale'
        }
      ]
    },
    {
      name: t('navigation.deals'),
      href: '/admin/deals',
      icon: ShoppingBag,
      current: isActive('/admin/deals')
    },
    {
      name: t('navigation.requests'),
      href: '/admin/requests',
      icon: ListChecks,
      current: isActive('/admin/requests')
    },
    {
      name: t('navigation.customers'),
      href: '/admin/customers',
      icon: User,
      current: isActive('/admin/customers')
    },
    {
      name: t('navigation.projects'),
      href: '/admin/projects',
      icon: LineChart,
      current: isActive('/admin/projects')
    },
    {
      name: t('navigation.analytics'),
      href: '/admin/analytics',
      icon: LineChart,
      current: isActive('/admin/analytics')
    },
    {
      name: t('navigation.settings'),
      href: '/admin/settings',
      icon: Settings,
      current: isActive('/admin/settings')
    },
  ];

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
      <nav className="flex-1 space-y-1 bg-white" aria-label="Sidebar">
        {navigation.map((item) =>
          !item.children ? (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.href);
              }}
              className={classNames(
                item.current
                  ? 'bg-gray-50 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-700',
                'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
              )}
            >
              <item.icon
                className={classNames(
                  item.current ? 'text-indigo-500' : 'text-gray-400 group-hover:text-indigo-500',
                  'h-6 w-6 shrink-0'
                )}
                aria-hidden="true"
              />
              {item.name}
            </a>
          ) : (
            <div key={item.name}>
              <p
                className={classNames(
                  item.current
                    ? 'bg-gray-50 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-700',
                  'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 cursor-pointer'
                )}
                onClick={() => {
                  const el = document.getElementById(item.name);
                  if (el) {
                    el.classList.toggle('hidden');
                  }
                }}
              >
                <item.icon
                  className={classNames(
                    item.current ? 'text-indigo-500' : 'text-gray-400 group-hover:text-indigo-500',
                    'h-6 w-6 shrink-0'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </p>
              <div className="mt-2 space-y-1" id={item.name}>
                {item.children.map((child) => (
                  <a
                    key={child.name}
                    href={child.href}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(child.href);
                    }}
                    className={classNames(
                      child.current
                        ? 'bg-gray-50 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-700',
                      'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 ml-4'
                    )}
                  >
                    {child.name || child.title}
                  </a>
                ))}
              </div>
            </div>
          )
        )}
      </nav>
    </div>
  );
}
