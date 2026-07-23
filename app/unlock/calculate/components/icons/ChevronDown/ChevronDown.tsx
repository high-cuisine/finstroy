import cls from './ChevronDown.module.scss';

export function ChevronDown() {
  return (
    <svg className={cls.chevron} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
