import cls from './PdfIcon.module.scss';

export function PdfIcon() {
  return (
    <svg className={cls.root} width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M5 1H11L15 5V17H5V1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 1V5H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 9H13M7 12H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
