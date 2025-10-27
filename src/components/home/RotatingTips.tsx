import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

const RotatingTips = () => {
  const [tips, setTips] = useState<any[]>([]);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    fetchTips();
  }, []);

  useEffect(() => {
    if (tips.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [tips]);

  const fetchTips = async () => {
    try {
      const { data, error } = await supabase
        .from('tips')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setTips(data || []);
    } catch (error) {
      console.error('Error fetching tips:', error);
    }
  };

  if (tips.length === 0) return null;

  return (
    <section className="py-8 bg-primary/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3 min-h-[60px]">
          <Lightbulb className="h-6 w-6 text-primary flex-shrink-0" />
          <AnimatePresence mode="wait">
            <motion.p
              key={currentTipIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center text-sm md:text-base font-medium"
            >
              {tips[currentTipIndex]?.content}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default RotatingTips;
