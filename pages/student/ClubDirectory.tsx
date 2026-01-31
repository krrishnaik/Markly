import React, { useState } from 'react';
import { CLUBS } from '../../services/mockData';
import { Button } from '../../components/ui/Button';

export const ClubDirectory: React.FC = () => {
  const [filter, setFilter] = useState('');

  const filteredClubs = CLUBS.filter(c => 
    c.name.toLowerCase().includes(filter.toLowerCase()) || 
    c.category.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-8">
       {/* Header & Search */}
       <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-200 pb-6">
        <div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Club Directory</h2>
            <p className="text-slate-500 mt-2 text-lg">Discover and join student communities.</p>
        </div>
        <div className="w-full md:w-72">
            <input 
                type="text" 
                placeholder="Search clubs..." 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full rounded-lg border-slate-200 bg-white p-3 pl-10 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClubs.map(club => (
            <div key={club.id} className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl shadow-sm">
                        {/* Mock Logo using Emoji/Initial */}
                        {club.name === 'Coding Club' ? '💻' : club.name.charAt(0)}
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-1 rounded">
                        {club.category}
                    </span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-2">{club.name}</h3>
                <p className="text-slate-500 text-sm leading-relaxed flex-grow">
                    {club.description || "A community for enthusiasts to learn, share, and grow together."}
                </p>

                <div className="pt-6 mt-4 border-t border-slate-100">
                    <Button fullWidth variant="outline" className="border-primary-200 text-primary-700 hover:bg-primary-50 hover:border-primary-300">
                        View Details & Join
                    </Button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};