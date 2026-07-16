"use client";

export function AdminFab({ onClick }: { onClick: () => void }) {
  return (
    <button className="admin-fab" id="adminFab" onClick={onClick} title="Panel de gestión">
      <svg viewBox="0 0 24 24">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    </button>
  );
}
