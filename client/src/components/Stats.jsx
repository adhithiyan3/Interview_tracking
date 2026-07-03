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
      color: 'from-indigo-50 to-blue-50 text-indigo-600 border-indigo-100',
      iconColor: 'bg-indigo-100 text-indigo-600'
    },
    {
      label: 'Pending Response',
      value: pending,
      icon: HelpCircle,
      color: 'from-amber-50 to-yellow-50 text-amber-600 border-amber-100',
      iconColor: 'bg-amber-100 text-amber-600'
    },
    {
      label: 'Offers Received',
      value: selected,
      icon: CheckCircle2,
      color: 'from-emerald-50 to-teal-50 text-emerald-600 border-emerald-100',
      iconColor: 'bg-emerald-100 text-emerald-600'
    },
    {
      label: 'Rejections',
      value: rejected,
      icon: XCircle,
      color: 'from-rose-50 to-red-50 text-rose-600 border-rose-100',
      iconColor: 'bg-rose-100 text-rose-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className={`p-5 rounded-2xl bg-gradient-to-br ${item.color} border flex items-center justify-between shadow-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-md`}
          >
            <div className="space-y-1">
              <span className="text-slate-500 text-xs sm:text-sm font-medium tracking-tight">
                {item.label}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-800">
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
