import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Dataset } from '../types';

interface DatasetSelectorProps {
  categories: Dataset[];
  selectedDataset: string;
  onDatasetChange: (DatasetId: string) => void;
}

const DatasetSelector: React.FC<DatasetSelectorProps> = ({ 
  categories, 
  selectedDataset, 
  onDatasetChange 
}) => {
  return (
    <div className="relative w-full md:w-64">
      <label htmlFor="Dataset" className="block text-sm font-medium text-gray-700 mb-1">
        Select Dataset
      </label>
      <div className="relative">
        <select
          id="Dataset"
          value={selectedDataset}
          onChange={(e) => onDatasetChange(e.target.value)}
          className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm shadow-sm 
                    focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 
                    appearance-none transition-colors duration-200"
        >
          {categories.map((Dataset) => (
            <option key={Dataset.id} value={Dataset.id}>
              {Dataset.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <ChevronDown size={16} />
        </div>
      </div>
    </div>
  );
};

export default DatasetSelector;