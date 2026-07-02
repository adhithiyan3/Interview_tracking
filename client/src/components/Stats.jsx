import React from 'react';
import { Briefcase, HelpCircle, CheckCircle2, XCircle } from 'lucide-react';

const Stats = ({ interviews }) => {
  const total = interviews.length;
  const pending = interviews.filter(i => i.status === 'Pending').length;
  const selected = interviews.filter(i => i.status === 'Selected').length;
  const rejected = interviews.filter(i => i.status === 'Rejected').length;

  const statItems = [
    {
      label: 'Total Applications',
      value: total,
      icon: Briefcase,
      color: 'from-blue-500/20 to-indigo-500/20 text-indigo-400 border-indigo-500/20',
      iconColor: 'bg-indigo-500/10 text-indigo-400'
    },
    {
      label: 'Pending Response',
      value: pending,
      icon: HelpCircle,
      color: 'from-amber-500/20 to-yellow-500/20 text-yellow-500 border-yellow-500/20',
      iconColor: 'bg-yellow-500/10 text-yellow-500'
    },
    {
      label: 'Offers Received',
      value: selected,
      icon: CheckCircle2,
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/20',
      iconColor: 'bg-emerald-500/10 text-emerald-400'
    },
    {
      label: 'Rejections',
      value: rejected,
      icon: XCircle,
      color: 'from-rose-500/20 to-red-500/20 text-rose-400 border-rose-500/20',
      iconColor: 'bg-rose-500/10 text-rose-400'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className={`p-5 rounded-2xl bg-gradient-to-br ${item.color} border flex items-center justify-between shadow-md transition-all duration-300 hover:scale-[1.01]`}
          >
            <div className="space-y-1">
              <span className="text-slate-400 text-xs sm:text-sm font-medium tracking-tight">
                {item.label}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {item.value}
              </h3>
            </div>
            <div className={`p-3 rounded-xl ${item.iconColor}`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Stats;
