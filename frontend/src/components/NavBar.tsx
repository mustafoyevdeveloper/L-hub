import React from "react";
import { useI18n, Lang } from "@/i18n/I18nProvider";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const langs: { code: Lang; label: string }[] = [
  { code: "uz", label: "UZ" },
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
];

const NavBar: React.FC = () => {
  const { lang, setLang, t } = useI18n();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <div className="size-7 rounded-md bg-gradient-to-tr from-primary to-primary/60 shadow-[var(--shadow-elegant)]" aria-hidden />
          <span className="text-lg">{t("brand")}</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link to="/lottery">
            <Button variant="outline" size="sm">Lottery</Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" size="sm">Dashboard</Button>
          </Link>
          <Link to="/profile">
            <Button variant="outline" size="sm">Profil</Button>
          </Link>
          <select
            aria-label="Select language"
            className="h-9 rounded-md border border-input bg-secondary px-2 text-sm text-secondary-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
            value={lang}
            onChange={(e) => setLang(e.target.value as Lang)}
          >
            {langs.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
