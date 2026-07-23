import cls from './CartIcon.module.scss';

export function CartIcon() {
  return (
    <svg className={cls.root} width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M1 1H3.5L5.5 13H14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6.5" cy="15.5" r="1" fill="currentColor" />
      <circle cx="13" cy="15.5" r="1" fill="currentColor" />
      <path d="M3.5 3H16L14.5 10H5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
