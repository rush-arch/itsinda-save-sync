import { useTranslation } from 'react-i18next';
import { Facebook, Linkedin, MessageCircle } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-muted py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              {t('footer.about')}
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              {t('footer.terms')}
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              {t('footer.privacy')}
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              {t('footer.contact')}
            </a>
          </div>
          <div className="flex gap-4">
            <a href="#" className="text-muted-foreground hover:text-foreground">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              <MessageCircle className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
        <div className="text-center mt-6 text-sm text-muted-foreground">
          {t('footer.copyright')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
