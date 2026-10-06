'use client';

import Link from 'next/link';
import type { FormEvent, ReactNode } from 'react';

interface AuthFormProps {
  submitLabel: string;
  footerText: string;
  footerLinkLabel: string;
  footerHref: string;
  onSubmit?: () => void;
  submitDisabled?: boolean;
  // 하단 안내 문구 위에 표시할 보조 링크 (예: 비밀번호 찾기)
  secondaryLink?: { href: string; label: string };
  // 제출 버튼 바로 아래에 표시할 요소 (예: 소셜 로그인 버튼)
  belowSubmit?: ReactNode;
  children: ReactNode;
}

export function AuthForm({
  submitLabel,
  footerText,
  footerLinkLabel,
  footerHref,
  onSubmit,
  submitDisabled = false,
  secondaryLink,
  belowSubmit,
  children,
}: AuthFormProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!submitDisabled) onSubmit?.();
  };

  return (
    <main className="flex flex-1 items-center justify-center min-h-screen bg-[var(--bg)] px-4">
      <div className="w-full max-w-[400px]">
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="text-3xl">🔗</span>
          <span className="text-3xl font-bold text-[var(--text)]">링크</span>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-[var(--card)] rounded-[16px] p-6 border border-[var(--border)] shadow-sm"
        >
          <div className="space-y-4 mb-6">{children}</div>
          <button
            type="submit"
            disabled={submitDisabled}
            className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold py-3 rounded-[12px] transition-smooth btn-press disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[var(--accent)]"
          >
            {submitLabel}
          </button>
          {belowSubmit && <div className="mt-3">{belowSubmit}</div>}
          {secondaryLink && (
            <p className="text-center text-sm mt-5">
              <Link href={secondaryLink.href} className="text-[var(--text-sub)] hover:text-[var(--text)] underline-offset-2 hover:underline">
                {secondaryLink.label}
              </Link>
            </p>
          )}
          <p className={`text-center text-sm text-[var(--text-sub)] ${secondaryLink ? 'mt-2' : 'mt-5'}`}>
            {footerText}{' '}
            <Link href={footerHref} className="font-bold text-[var(--accent)] hover:text-[var(--accent-hover)]">
              {footerLinkLabel}
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}

interface AuthInputProps {
  id: string;
  label: string;
  type: 'email' | 'password';
  placeholder: string;
  autoComplete: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function AuthInput({ id, label, type, placeholder, autoComplete, value, onChange }: AuthInputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold text-[var(--text)] mb-2">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className="w-full px-4 py-3 border border-[var(--border)] rounded-[10px] bg-[var(--card)] text-[var(--text)] placeholder-[var(--text-disabled)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-smooth"
      />
    </div>
  );
}
