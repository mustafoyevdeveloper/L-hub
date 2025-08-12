import React from "react";
import { useI18n, Lang } from "@/i18n/I18nProvider";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import ModeToggle from "@/components/ModeToggle";
import { User as UserIcon, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";

const langs: { code: Lang; label: string }[] = [
  { code: "uz", label: "UZ" },
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
];

const NavBar: React.FC = () => {
  const { lang, setLang, t } = useI18n();
  const { token, user, logout, isLoading } = useAuth();

  // Loading holatida navbar'ni ko'rsatmaslik
  if (isLoading) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <div className="size-7 rounded-md bg-gradient-to-tr from-primary to-primary/60 shadow-[var(--shadow-elegant)]" aria-hidden />
          <span className="text-lg">{t("brand")}</span>
        </Link>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-2">
            <Link to="/lottery"><Button variant="outline" size="sm">{t("nav.lottery")}</Button></Link>
            <Link to="/dashboard"><Button variant="outline" size="sm">{t("nav.dashboard")}</Button></Link>
            <Link to="/rules"><Button variant="outline" size="sm">Qoidalar</Button></Link>
            <Link to="/archive"><Button variant="outline" size="sm">Arxiv</Button></Link>
            <Link to="/videos"><Button variant="outline" size="sm">Videolar</Button></Link>
            <Link to="/news"><Button variant="outline" size="sm">Yangiliklar</Button></Link>
            <Link to="/plans"><Button variant="outline" size="sm">Tariflar</Button></Link>
            <Link to="/minigames"><Button variant="outline" size="sm">Mini-o‘yinlar</Button></Link>
            <Link to="/support"><Button variant="outline" size="sm">Support</Button></Link>
            <Link to="/kyc"><Button variant="outline" size="sm">KYC</Button></Link>
            <Link to="/rng"><Button variant="outline" size="sm">RNG</Button></Link>
          </div>

          {/* Lang + theme + profile (profile after theme) */}
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
          <ModeToggle />
          <Link to="/profile" aria-label="Profil" className="hidden sm:inline-flex">
            <Button size="icon" className="rounded-full bg-gradient-primary text-white shadow-glow hover:opacity-90">
              <UserIcon />
            </Button>
          </Link>

          {/* Auth */}
          {!token ? (
            <Link to="/auth" className="hidden lg:inline-flex">
              <Button size="sm">Kirish</Button>
            </Link>
          ) : (
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden xl:inline">
                {user?.fullName || user?.email}
              </span>
              <Button variant="outline" size="sm" onClick={logout}>Chiqish</Button>
            </div>
          )}

          {/* Mobile hamburger (Sheet drawer) */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Menu" className="rounded-full">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 sm:w-96">
                <SheetHeader>
                  <SheetTitle>{t("brand")}</SheetTitle>
                </SheetHeader>
                <div className="mt-4 grid gap-2">
                  <SheetClose asChild>
                    <Link to="/lottery"><Button variant="ghost" className="w-full justify-start">{t("nav.lottery")}</Button></Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/dashboard"><Button variant="ghost" className="w-full justify-start">{t("nav.dashboard")}</Button></Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/rules"><Button variant="ghost" className="w-full justify-start">Qoidalar</Button></Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/archive"><Button variant="ghost" className="w-full justify-start">Arxiv</Button></Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/videos"><Button variant="ghost" className="w-full justify-start">Videolar</Button></Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/news"><Button variant="ghost" className="w-full justify-start">Yangiliklar</Button></Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/plans"><Button variant="ghost" className="w-full justify-start">Tariflar</Button></Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/minigames"><Button variant="ghost" className="w-full justify-start">Mini-o‘yinlar</Button></Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/support"><Button variant="ghost" className="w-full justify-start">Support</Button></Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/kyc"><Button variant="ghost" className="w-full justify-start">KYC</Button></Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/rng"><Button variant="ghost" className="w-full justify-start">RNG</Button></Link>
                  </SheetClose>
                  {!token ? (
                    <SheetClose asChild>
                      <Link to="/auth"><Button className="w-full justify-start">Kirish</Button></Link>
                    </SheetClose>
                  ) : (
                    <Button variant="destructive" className="w-full justify-start" onClick={logout}>Chiqish</Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
