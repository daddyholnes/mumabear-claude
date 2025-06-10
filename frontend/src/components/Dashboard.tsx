// Main Dashboard component for the UI hub
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setActiveExperience, toggleFavorite } from '../store/experienceSlice';
import { addConversation } from '../store/chatSlice';
import { Heart, Star, Bell } from 'lucide-react';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { experiences, notifications, layout } = useSelector((state: RootState) => state.experience);
  const { currentTheme, themes } = useSelector((state: RootState) => state.theme);
  const theme = themes[currentTheme];

  const handleExperienceClick = (experienceId: string) => {
    dispatch(setActiveExperience(experienceId));
    dispatch(addConversation({ experience: experienceId }));
  };

  const handleToggleFavorite = (experienceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleFavorite(experienceId));
  };

  const experienceArray = Object.values(experiences);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <header className="mb-12">
        <h1 className={`text-4xl font-bold ${theme.colors.text} mb-2`}>
          🐻 Podplay Sanctuary
        </h1>
        <p className={`${theme.colors.accent} text-lg`}>
          AI-Powered Development Hub for Brilliant Neurodivergent Minds
        </p>
      </header>

      {/* Experience Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${layout === 'grid' ? '' : layout === 'list' ? 'grid-cols-1' : ''}`}>
        {experienceArray.map((experience) => (
          <div
            key={experience.id}
            onClick={() => handleExperienceClick(experience.id)}
            className={`${theme.effects.blur ? 'bg-white/10 backdrop-blur-md' : 'bg-white/20'} rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group relative`}
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
            <h3 className={`text-xl font-semibold ${theme.colors.text} mb-2`}>
              {experience.name}
            </h3>
            <p className={`${theme.colors.accent} mb-4`}>
              {experience.description}
            </p>
            
            <div className="flex items-center justify-between">
              <span className={`text-xs ${theme.colors.accent} opacity-75 capitalize`}>
                {experience.category}
              </span>
              {experience.metadata?.lastAccessed && (
                <span className={`text-xs ${theme.colors.accent} opacity-50`}>
                  Last used: {new Date(experience.metadata.lastAccessed).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Status Bar */}
      <div className="mt-12 p-4 bg-black/20 rounded-2xl border border-white/10">
        <div className={`flex items-center justify-between text-sm ${theme.colors.accent}`}>
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              System Online
            </span>
            <span>Gemini Orchestra: 50+ Models Active</span>
            <span>Memory: Persistent & Learning</span>
          </div>
          <div className={theme.colors.text}>
            Podplay Sanctuary v2.0 • Built with 💜 for Neurodivergent Developers
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
