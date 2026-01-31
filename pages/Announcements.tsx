import React, { useEffect } from 'react';
import { Badge } from '../components/ui/Badge';

declare const gsap: any;

export const Announcements: React.FC = () => {
  // Mock Announcements Data
  const announcements = [
    {
      id: 1,
      club: "Coding Club",
      title: "Hackathon Registration Extended",
      date: "Oct 24, 2023",
      content: "Due to high demand, we are extending the registration for the Inter-College Hackathon by 24 hours. Make sure to submit your team details by midnight!",
      priority: "high"
    },
    {
      id: 2,
      club: "Robotics Team",
      title: "Workshop Venue Change",
      date: "Oct 23, 2023",
      content: "The Intro to Arduino workshop has been moved to Lab 302 (3rd Floor) due to AC maintenance in the seminar hall.",
      priority: "normal"
    },
    {
      id: 3,
      club: "Debate Society",
      title: "Weekly Practice Cancelled",
      date: "Oct 22, 2023",
      content: "The faculty coordinator is unavailable this week. Regular sessions resume next Monday.",
      priority: "normal"
    }
  ];

  useEffect(() => {
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(".announcement-card", 
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
        );
    }
  }, []);

  return (
    <div className="space-y-8">
        <div className="border-b border-slate-200 pb-6">
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Announcements</h2>
            <p className="text-slate-500 mt-2 text-lg">Latest updates from your clubs and committees.</p>
        </div>

        <div className="grid gap-6">
            {announcements.map((item) => (
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
                    <p className="text-slate-600 leading-relaxed mb-4 border-l-2 border-slate-100 pl-4">
                        {item.content}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {item.date}
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};