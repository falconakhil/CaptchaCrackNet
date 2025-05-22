import  { useState, useEffect } from 'react';
import { categories } from './data/Data';
import { Dataset, CaptchaImage } from './types';
import DatasetSelector from './components/DatasetSelector';
import CaptchaDisplay from './components/CaptchaDisplay';
import InputValidation from './components/InputValidation';

function App() {
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>(categories[0].id);
  const [currentDataset, setCurrentDataset] = useState<Dataset | null>(categories[0]);
  const [currentCaptcha, setCurrentCaptcha] = useState<CaptchaImage | null>(null);

  // Update current Dataset when selection changes
  useEffect(() => {
    const Dataset = categories.find(cat => cat.id === selectedDatasetId) || null;
    setCurrentDataset(Dataset);
    
    // Reset captcha when Dataset changes
    if (Dataset && Dataset.captchas.length > 0) {
      const randomIndex = Math.floor(Math.random() * Dataset.captchas.length);
      setCurrentCaptcha(Dataset.captchas[randomIndex]);
    } else {
      setCurrentCaptcha(null);
    }
  }, [selectedDatasetId]);

  const handleDatasetChange = (DatasetId: string) => {
    setSelectedDatasetId(DatasetId);
  };

  const handleRefreshCaptcha = () => {
    if (!currentDataset || currentDataset.captchas.length === 0) return;
    
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * currentDataset.captchas.length);
    } while (
      currentCaptcha && 
      currentDataset.captchas.length > 1 && 
      currentDataset.captchas[randomIndex].id === currentCaptcha.id
    );
    
    setCurrentCaptcha(currentDataset.captchas[randomIndex]);
  };

  const handleSuccessfulValidation = () => {
    handleRefreshCaptcha();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 ">
              <h1 className="text-xl font-semibold text-gray-800">CAPTCHA Demo</h1>
            </div>
            
          </div>
        </div>
      </header>

      <main className="max-w-9xl mx-auto px-4 sm:px-6 py-8 flex justify-center ">
        <div className="flex items-center justify-between mb-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="w-full max-w-xs">
              <div className="space-y-6">
                <DatasetSelector 
                  categories={categories} 
                  selectedDataset={selectedDatasetId}
                  onDatasetChange={handleDatasetChange}
                />
                
                <CaptchaDisplay 
                  captchaImage={currentCaptcha}
                  onRefreshCaptcha={handleRefreshCaptcha}
                />
                
                <InputValidation 
                  captchaImage={currentCaptcha}
                  onSuccess={handleSuccessfulValidation}
                />
              </div>
            </div>
            
           
          </div>
        </div>
        </div>
      </main>

      
    </div>
  );
}

export default App;