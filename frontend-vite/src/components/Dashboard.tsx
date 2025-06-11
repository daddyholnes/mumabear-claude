// Main Dashboard component for the UI hub
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { RootState } from '../store';
import { toggleFavorite } from '../store/experienceSlice';
import { Star } from 'lucide-react';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { experiences, notifications, layout } = useSelector((state: RootState) => state.experience);
  const { currentTheme, themes } = useSelector((state: RootState) => state.theme);
  const theme = themes[currentTheme];
  const handleToggleFavorite = (experienceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleFavorite(experienceId));
  };

  const experienceArray = Object.values(experiences);
  // Create route mapping for experiences
  const getExperienceRoute = (experienceId: string) => {
    switch (experienceId) {
      case 'scout-orchestration':
        return '/scout';
      case 'dev-workspaces':
        return '/workspaces';
      case 'mama-bear':
        return '/chat';
      case 'agent-workbench':
        return '/agents';
      case 'research-library':
        return '/research';
      case 'api-studio':
        return '/api-studio';
      case 'theme-studio':
        return '/themes';
      default:
        return '/';
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold text-white mb-4">
            Welcome to <span className="text-purple-300">Podplay Sanctuary</span>
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Your comprehensive multi-theme UI hub with 12+ specialized AI experiences,
            powered by Mama Bear (Gemini 2.5) and designed for accessibility and beauty.
          </p>
        </motion.div>

        {/* Experience Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${layout === 'grid' ? '' : layout === 'list' ? 'grid-cols-1' : ''}`}>
          {experienceArray.map((experience, index) => (
            <motion.div
              key={experience.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Link to={getExperienceRoute(experience.id)} className="block">
                <div
                  className={`${theme.effects.blur ? 'bg-white/10 backdrop-blur-md' : 'bg-white/20'} rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group relative hover:scale-105`}
                >
                  {/* Notification Badge */}
                  {notifications[experience.id] > 0 && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                      {notifications[experience.id]}
                    </div>
                  )}

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => handleToggleFavorite(experience.id, e)}
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {experience.metadata?.favorited ? (
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    ) : (
                      <Star className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  <div className="text-3xl mb-4">{experience.icon}</div>
                  <h3 className={`text-xl font-semibold text-white mb-2`}>
                    {experience.name}
                  </h3>
                  <p className={`text-white/70 mb-4`}>
                    {experience.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-xs text-white/60 opacity-75 capitalize`}>
                      {experience.category}
                    </span>
                    {experience.metadata?.lastAccessed && (
                      <span className={`text-xs text-white/50 opacity-50`}>
                        Last used: {new Date(experience.metadata.lastAccessed).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Live Ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 bg-black/20 backdrop-blur-md rounded-xl p-4 border border-white/20"
        >
          <div className="flex items-center gap-4">
            <span className="text-purple-300 font-semibold">🔴 Live Updates:</span>
            <div className="flex-1 overflow-hidden">
              <motion.div
                animate={{ x: [1200, -1200] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="whitespace-nowrap text-white/80"
              >
                Scout Orchestration: 3 new workflows completed • Research Library: 15 new papers indexed • 
                API Studio: 2 live endpoints active • Agent Workbench: 5 agents running • 
                Integration Workbench: New MCP server connected
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Status Bar */}
        <div className="mt-12 p-4 bg-black/20 rounded-2xl border border-white/10">
          <div className={`flex items-center justify-between text-sm text-white/70`}>
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                System Online
              </span>
              <span>Gemini Orchestra: 50+ Models Active</span>
              <span>Memory: Persistent & Learning</span>
            </div>
            <div className="text-white">
              Podplay Sanctuary v2.0 • Built with 💜 for Neurodivergent Developers
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
