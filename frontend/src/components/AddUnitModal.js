// src/components/AddUnitModal.js
import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

const AddUnitModal = ({ show, type, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    type: '',
    location: '',
    battery: 100
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.type && formData.location) {
      onAdd(formData);
      setFormData({ type: '', location: '', battery: 100 });
      onClose();
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-backdrop">
      <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4 fade-in">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-black">
            Add New {type === 'vehicle' ? 'Cyber Cab' : 'Drone'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {type === 'vehicle' ? 'Vehicle Model' : 'Drone Type'}
            </label>
            <select 
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
              required
            >
              <option value="">Select {type === 'vehicle' ? 'Model' : 'Type'}</option>
              {type === 'vehicle' ? (
                <>
                  <option value="Tesla Model 3">Tesla Model 3</option>
                  <option value="Tesla Model Y">Tesla Model Y</option>
                  <option value="Tesla Model S">Tesla Model S</option>
                  <option value="Tesla Cybertruck">Tesla Cybertruck</option>
                </>
              ) : (
                <>
                  <option value="Delivery Quad">Delivery Quad</option>
                  <option value="Heavy Lifter">Heavy Lifter</option>
                  <option value="Medical Transport">Medical Transport</option>
                  <option value="Food Delivery">Food Delivery</option>
                </>
              )}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Starting Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="e.g., Downtown LA, Santa Monica"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Initial Battery Level: {formData.battery}%
            </label>
            <input
              type="range"
              min="20"
              max="100"
              value={formData.battery}
              onChange={(e) => setFormData(prev => ({ ...prev, battery: parseInt(e.target.value) }))}
              className="w-full"
            />
          </div>
          
          <div className="flex space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add {type === 'vehicle' ? 'Vehicle' : 'Drone'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUnitModal;