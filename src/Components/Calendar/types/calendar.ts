export interface CalendarEvent {
    id: string;
    title: string;
    date: Date;
    startTime?: string;
    endTime?: string;
    description?: string;
    location?: string;
    color?: string;
    related_post_id?: number;
  }
  
  export interface DateWithEvents {
    date: Date;
    events: CalendarEvent[];
    isCurrentMonth: boolean;
    isToday: boolean;
  }