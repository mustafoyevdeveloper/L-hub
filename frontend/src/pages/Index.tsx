import { Button } from "@/components/ui/button";
import Seo from "@/components/Seo";
import { useI18n } from "@/i18n/I18nProvider";
import heroImg from "@/assets/hero-lottery.jpg";
import { ShieldCheck, CreditCard, Shuffle, LayoutDashboard, Languages, Bell } from "lucide-react";

const Index = () => {
  const { t } = useI18n();

  const title = `${t("hero.title")} | ${t("brand")}`;
  const description = t("hero.subtitle");

  return (
    <main>
      <Seo title={title} description={description} image={heroImg} />

      <section className="container mx-auto mt-10 grid items-center gap-10 rounded-lg border bg-card p-6 md:grid-cols-2 md:p-10">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{t("hero.title")}</h1>
          <p className="text-lg text-muted-foreground">{t("hero.subtitle")}</p>
          <div className="flex flex-wrap gap-3">
            <Button variant="hero" size="lg">{t("cta.getStarted")}</Button>
            <Button variant="outline" size="lg" asChild>
              <a href="#features">{t("cta.learnMore")}</a>
            </Button>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><ShieldCheck className="text-primary" /><span>PCI-DSS</span></div>
            <div className="flex items-center gap-2"><Shuffle className="text-primary" /><span>Auditable RNG</span></div>
            <div className="flex items-center gap-2"><CreditCard className="text-primary" /><span>Tokenization</span></div>
          </div>
        </div>
        <div className="relative">
          <img
            src={heroImg}
            alt="Violet-blue premium gradient with abstract lottery balls and sparkles"
            className="w-full rounded-md shadow-elegant"
            loading="eager"
          />
        </div>
      </section>

      <section id="features" className="container mx-auto space-y-8 py-12 md:py-16">
        <h2 className="text-center text-3xl font-semibold tracking-tight md:text-4xl">Features</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-lg border bg-card p-6 shadow-sm transition hover:shadow-elegant">
            <ShieldCheck className="mb-3 text-primary" />
            <h3 className="mb-2 text-xl font-semibold">{t("features.security")}</h3>
            <p className="text-muted-foreground">HTTPS, 2FA, KYC, audit loglar, rate limiting, CAPTCHA va RLS bilan himoya.</p>
          </article>
          <article className="rounded-lg border bg-card p-6 shadow-sm transition hover:shadow-elegant">
            <CreditCard className="mb-3 text-primary" />
            <h3 className="mb-2 text-xl font-semibold">{t("features.payments")}</h3>
            <p className="text-muted-foreground">Stripe/PayPal/Payme/Payze integratsiyasi, ko‘p valuta, tokenizatsiya va refundlar.</p>
          </article>
          <article className="rounded-lg border bg-card p-6 shadow-sm transition hover:shadow-elegant">
            <Shuffle className="mb-3 text-primary" />
            <h3 className="mb-2 text-xl font-semibold">{t("features.rng")}</h3>
            <p className="text-muted-foreground">Server-side CSPRNG, seed precommit, hash loglari va auditor uchun eksport.</p>
          </article>
          <article className="rounded-lg border bg-card p-6 shadow-sm transition hover:shadow-elegant">
            <LayoutDashboard className="mb-3 text-primary" />
            <h3 className="mb-2 text-xl font-semibold">{t("features.admin")}</h3>
            <p className="text-muted-foreground">Raundlar, yutuqlar, to‘lovlar, hisobotlar va KPIlar — bir joyda.</p>
          </article>
          <article className="rounded-lg border bg-card p-6 shadow-sm transition hover:shadow-elegant">
            <Languages className="mb-3 text-primary" />
            <h3 className="mb-2 text-xl font-semibold">{t("features.i18n")}</h3>
            <p className="text-muted-foreground">O‘zbekcha, Ruscha, Inglizcha — keyinchalik ko‘proq til qo‘shish mumkin.</p>
          </article>
          <article className="rounded-lg border bg-card p-6 shadow-sm transition hover:shadow-elegant">
            <Bell className="mb-3 text-primary" />
            <h3 className="mb-2 text-xl font-semibold">{t("features.support")}</h3>
            <p className="text-muted-foreground">Support ticketlar, email/SMS bildirishnomalar va Telegram alertlar.</p>
          </article>
        </div>
      </section>

      <footer className="border-t py-8">
        <div className="container mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} {t("brand")}. {t("footer.rights")}</span>
          <a className="hover:underline" href="#features">Features</a>
        </div>
      </footer>
    </main>
  );
};

export default Index;
