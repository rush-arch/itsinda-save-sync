import { useTranslation } from 'react-i18next';
import { Users, TrendingUp, Award } from 'lucide-react';

const SocialProof = () => {
  const { t } = useTranslation();

  const stats = [
    { icon: Users, label: '2,000+ Active Members', value: '2000+' },
    { icon: TrendingUp, label: 'Average Growth', value: '30%' },
    { icon: Award, label: 'Groups Formed', value: '150+' },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          {t('social.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center">
                <Icon className="h-12 w-12 text-primary mb-4" />
                <p className="text-3xl font-bold mb-2">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
