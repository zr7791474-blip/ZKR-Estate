import { Home, Calendar, MessageSquare, Heart } from "lucide-react";

interface Activity {
  id: string;
  type: 'property' | 'appointment' | 'message' | 'favorite';
  title: string;
  description: string;
  timestamp: Date;
}

const iconMap = {
  property: { icon: Home, bg: "bg-indigo-500/10 text-indigo-400" },
  appointment: { icon: Calendar, bg: "bg-emerald-500/10 text-emerald-400" },
  message: { icon: MessageSquare, bg: "bg-blue-500/10 text-blue-400" },
  favorite: { icon: Heart, bg: "bg-pink-500/10 text-pink-400" }
};

export function ActivityFeed({ activities }: { activities: Activity[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl h-full">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-base font-semibold text-white">Recent Activity</h3>
        <button className="text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors">View all</button>
      </div>
      
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => {
            const { icon: Icon, bg } = iconMap[activity.type];
            return (
              <div key={activity.id} className="group flex items-start gap-4 rounded-xl p-2 -m-2 transition-colors hover:bg-white/5">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg} transition-transform group-hover:scale-110`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{activity.title}</p>
                  <p className="text-xs text-zinc-400 truncate mt-0.5">{activity.description}</p>
                </div>
                <span className="shrink-0 text-xs font-medium text-zinc-500">
                  {new Date(activity.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 mb-3">
              <MessageSquare className="h-6 w-6 text-zinc-500" />
            </div>
            <p className="text-sm font-medium text-white">No recent activity</p>
            <p className="text-xs text-zinc-500 mt-1">Your actions will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}