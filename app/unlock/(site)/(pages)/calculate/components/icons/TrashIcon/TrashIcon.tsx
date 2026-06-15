import cls from './TrashIcon.module.scss';

export function TrashIcon() {
  return (
    <svg className={cls.root} width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 3.5H12M5.5 3.5V2.5H8.5V3.5M5 6V10.5M9 6V10.5M3 3.5L3.5 11.5H10.5L11 3.5H3Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
