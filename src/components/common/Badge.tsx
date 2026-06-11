import React from 'react';

interface BadgeProps {
  variant: 'must' | 'recommended' | 'optional' | 'pending' | 'selected' | 'purchased' | 'installed';
  children: React.ReactNode;
}

const variantClassMap: Record<BadgeProps['variant'], string> = {
  must: 'badge-must',
  recommended: 'badge-recommended',
  optional: 'badge-optional',
  pending: 'badge-pending',
  selected: 'badge-selected',
  purchased: 'badge-purchased',
  installed: 'badge-installed',
};

const Badge: React.FC<BadgeProps> = ({ variant, children }) => {
  return (
    <span className={`badge ${variantClassMap[variant]}`}>
      {children}
    </span>
  );
};

export default Badge;
