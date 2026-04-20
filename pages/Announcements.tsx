import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Badge } from '../components/ui/Badge';

declare const gsap: any;

interface Announcement {
    id: string;
    club: string;
    title: string;
    date: string;
    content: string;
    priority: "high" | "normal";
}

export const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Read from the announcements collection in Firestore
    const q = query(collection(db, 'announcements'));
    const unsub = onSnapshot(q, (snapshot) => {
        const fetched = snapshot.docs.map(doc => ({
            id: doc.id,
            club: doc.data().club || doc.data().clubName || 'General',
            title: doc.data().title || 'Update',
            date: doc.data().date || new Date().toISOString().split('T')[0],
            content: doc.data().content || '',
            priority: (doc.data().priority || 'normal').toLowerCase()
        } as Announcement));
        
        // Sort by date manually if orderBy isn't easily indexable yet for this field
        fetched.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setAnnouncements(fetched);
        setLoading(false);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (!loading && typeof gsap !== 'undefined') {
        gsap.fromTo(".announcement-card", 
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out", clearProps: "all" }
        );
    }
  }, [announcements, loading]);

  return (
    <div className="space-y-8">
        <div className="border-b border-slate-200 pb-6">
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Announcements</h2>
            <p className="text-slate-500 mt-2 text-lg">Latest updates from your clubs and committees.</p>
        </div>

        <div className="grid gap-6">
            {loading ? (
                <div className="py-12 flex justify-center items-center">
                    <svg className="animate-spin h-8 w-8 text-primary-500" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                </div>
            ) : announcements.length > 0 ? (
                announcements.map((item) => (
                    <div key={item.id} className="announcement-card bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center text-lg font-bold border border-primary-100">
                                    {item.club.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">{item.title}</h3>
                                    <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide">{item.club}</p>
                                </div>
                            </div>
                            {item.priority === 'high' && (
                                <span className="bg-red-50 text-red-600 text-xs font-bold px-2 py-1 rounded border border-red-100 animate-pulse">
                                    URGENT
                                </span>
                            )}
                        </div>
                        <p className="text-slate-600 leading-relaxed mb-4 border-l-2 border-slate-100 pl-4 whitespace-pre-line">
                            {item.content}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            {item.date}
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-slate-500 font-medium text-lg">No announcements right now!</p>
                </div>
            )}
        </div>
    </div>
  );
};