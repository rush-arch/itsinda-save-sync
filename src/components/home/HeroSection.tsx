import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[500px] flex items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 text-center z-10"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
          {t('hero.title')}
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => navigate('/home#groups')}>
            {t('hero.joinGroup')}
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/auth')}>
            {t('hero.signIn')}
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
