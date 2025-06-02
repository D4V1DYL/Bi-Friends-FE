import React from 'react';
import { X, MapPin, Clock } from 'lucide-react';
import { DateWithEvents } from './types/calendar';
import { useNavigate } from 'react-router-dom';

interface EventModalProps {
  dateInfo: DateWithEvents | null;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ dateInfo, onClose }) => {
  const navigate = useNavigate();
  if (!dateInfo) return null;

  const { date, events } = dateInfo;
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const handleEventClick = (event: any) => {
    if (event.related_post_id) {
      navigate(`/forum/${event.related_post_id}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{formattedDate}</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none rounded-full p-1 hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {events.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No events scheduled for this day</p>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div 
                  key={event.id} 
                  className={`p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors ${event.related_post_id ? 'cursor-pointer hover:bg-[#B1F0F7]/10' : ''}`}
                  onClick={() => handleEventClick(event)}
                  title={event.related_post_id ? 'Go to forum post' : undefined}
                >
                  <div className="flex items-start">
                    <div 
                      className="w-3 h-3 mt-1.5 rounded-full flex-shrink-0 mr-3" 
                      style={{ backgroundColor: event.color }}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      
                      {(event.startTime || event.endTime) && (
                        <div className="flex items-center mt-2 text-sm text-gray-600">
                          <Clock size={14} className="mr-1.5" />
                          <span>
                            {event.startTime}
                            {event.endTime && ` - ${event.endTime}`}
                          </span>
                        </div>
                      )}
                      
                      {event.location && (
                        <div className="flex items-center mt-2 text-sm text-gray-600">
                          <MapPin size={14} className="mr-1.5" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      
                      {event.description && (
                        <p className="mt-3 text-sm text-gray-700">{event.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventModal