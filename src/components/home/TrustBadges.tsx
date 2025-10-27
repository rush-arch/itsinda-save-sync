import { useTranslation } from 'react-i18next';
import { Shield, Smartphone, Lock, Cloud } from 'lucide-react';

const TrustBadges = () => {
  const { t } = useTranslation();

  const badges = [
    { icon: Cloud, label: 'Powered by Cloud' },
    { icon: Smartphone, label: 'MTN & Airtel Money' },
    { icon: Lock, label: 'JWT Encryption' },
    { icon: Shield, label: 'Secure & Trusted' },
  ];

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <h3 className="text-2xl font-bold text-center mb-8">{t('trust.title')}</h3>
        <div className="flex flex-wrap justify-center gap-8 items-center">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div key={index} className="flex flex-col items-center gap-2">
                <Icon className="h-8 w-8 text-primary" />
                <span className="text-sm text-muted-foreground">{badge.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
