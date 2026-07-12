import { type ComponentType, type ReactNode } from 'react';

export function MiniCard({
  icon: Icon,
  text,
  title,
}: {
  icon: ComponentType<{ size?: number; 'aria-hidden'?: boolean }>;
  text: string;
  title: string;
}) {
  return (
    <article className="mini-card">
      <span className="icon-bubble small">
        <Icon aria-hidden={true} size={20} />
      </span>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

export function Field({
  children,
  error,
  label,
  name,
  required,
}: {
  children: ReactNode;
  error?: string;
  label: string;
  name: string;
  required?: boolean;
}) {
  return (
    <label className={`form-field ${error ? 'has-error' : ''}`} htmlFor={name}>
      <span>
        {label}
        {required && <em>*</em>}
      </span>
      {children}
      {error && <small className="field-error">{error}</small>}
    </label>
  );
}
