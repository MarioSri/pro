import { 
  Meeting, 
  MeetingLinks, 
  GoogleMeetInfo, 
  ZoomMeetingInfo, 
  TeamsMeetingInfo,
  CreateMeetingResponse,
  ConflictCheck,
  AISchedulingSuggestion,
  MeetingAPIResponse,
  AttendanceRecord
} from '@/types/meeting';
import { mockMeetingService } from './MockMeetingService';

export class MeetingAPIService {
  private googleApiKey: string;
  private googleClientId: string;
  private zoomClientId: string;
  private zoomClientSecret: string;
  private msClientId: string;
  private msClientSecret: string;
  private msTenantId: string;
  private apiUrl: string;
  private isDevelopment: boolean;

  constructor() {
    this.googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY || '';
    this.googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
    this.zoomClientId = import.meta.env.VITE_ZOOM_CLIENT_ID || '';
    this.zoomClientSecret = import.meta.env.VITE_ZOOM_CLIENT_SECRET || '';
    this.msClientId = import.meta.env.VITE_MS_CLIENT_ID || '';
    this.msClientSecret = import.meta.env.VITE_MS_CLIENT_SECRET || '';
    this.msTenantId = import.meta.env.VITE_MS_TENANT_ID || '';
    this.apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    this.isDevelopment = import.meta.env.DEV || false;
  }

  // Google Calendar API Integration
  async initializeGoogleAuth(): Promise<boolean> {
    try {
      await new Promise((resolve, reject) => {
        if (typeof window.gapi === 'undefined') {
          const script = document.createElement('script');
          script.src = 'https://apis.google.com/js/api.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        } else {
          resolve(null);
        }
      });

      await new Promise((resolve) => {
        window.gapi.load('auth2:client', () => resolve(null));
      });

      await window.gapi.client.init({
        apiKey: this.googleApiKey,
        clientId: this.googleClientId,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: 'https://www.googleapis.com/auth/calendar'
      });

      return true;
    } catch (error) {
      console.error('Google Auth initialization failed:', error);
      return false;
    }
  }

  async createGoogleMeetEvent(meeting: Partial<Meeting>): Promise<GoogleMeetInfo> {
    try {
      const authInstance = window.gapi.auth2.getAuthInstance();
      if (!authInstance.isSignedIn.get()) {
        await authInstance.signIn();
      }

      const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const event = {
        summary: meeting.title,
        description: meeting.description,
        start: {
          dateTime: this.formatDateTime(meeting.date!, meeting.time!),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: this.formatDateTime(meeting.date!, meeting.time!, meeting.duration!),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        attendees: meeting.attendees?.map(attendee => ({
          email: attendee.email,
          displayName: attendee.name,
          optional: !attendee.isRequired
        })),
        conferenceData: {
          createRequest: {
            conferenceSolutionKey: { type: 'hangoutsMeet' },
            requestId: requestId
          }
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 60 },
            { method: 'popup', minutes: 10 }
          ]
        }
      };

      const response = await window.gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        conferenceDataVersion: 1,
        sendUpdates: 'all'
      });

      const eventData = response.result;
      
      return {
        meetingId: eventData.id!,
        joinUrl: eventData.conferenceData?.entryPoints?.[0]?.uri || '',
        hangoutLink: eventData.hangoutLink || '',
        conferenceId: eventData.conferenceData?.conferenceId || '',
        requestId: requestId,
        status: eventData.conferenceData?.createRequest?.status?.statusCode === 'success' ? 'success' : 'pending',
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Google Meet creation failed:', error);
      throw new Error('Failed to create Google Meet event');
    }
  }

  // Zoom API Integration
  async createZoomMeeting(meeting: Partial<Meeting>): Promise<ZoomMeetingInfo> {
    try {
      const accessToken = await this.getZoomAccessToken();
      
      const meetingData = {
        topic: meeting.title,
        agenda: meeting.description,
        type: 2, // Scheduled meeting
        start_time: this.formatISODateTime(meeting.date!, meeting.time!),
        duration: meeting.duration,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          mute_upon_entry: true,
          watermark: false,
          use_pmi: false,
          approval_type: 0,
          auto_recording: 'cloud',
          enforce_login: false,
          waiting_room: true,
          allow_multiple_devices: true
        }
      };

      const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(meetingData)
      });

      if (!response.ok) {
        throw new Error(`Zoom API error: ${response.statusText}`);
      }

      const zoomMeeting = await response.json();

      return {
        meetingId: zoomMeeting.id.toString(),
        joinUrl: zoomMeeting.join_url,
        startUrl: zoomMeeting.start_url,
        password: zoomMeeting.password,
        meetingNumber: zoomMeeting.id.toString(),
        status: 'waiting',
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Zoom meeting creation failed:', error);
      throw new Error('Failed to create Zoom meeting');
    }
  }

  private async getZoomAccessToken(): Promise<string> {
    try {
      const response = await fetch(`${this.apiUrl}/zoom/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clientId: this.zoomClientId,
          clientSecret: this.zoomClientSecret
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get Zoom access token');
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Zoom auth failed:', error);
      throw error;
    }
  }

  // Microsoft Teams API Integration
  async createTeamsMeeting(meeting: Partial<Meeting>): Promise<TeamsMeetingInfo> {
    try {
      const accessToken = await this.getMicrosoftAccessToken();
      
      const meetingData = {
        subject: meeting.title,
        body: {
          contentType: 'HTML',
          content: meeting.description
        },
        start: {
          dateTime: this.formatISODateTime(meeting.date!, meeting.time!),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: this.formatISODateTime(meeting.date!, meeting.time!, meeting.duration!),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        attendees: meeting.attendees?.map(attendee => ({
          emailAddress: {
            address: attendee.email,
            name: attendee.name
          },
          type: attendee.isRequired ? 'required' : 'optional'
        })),
        isOnlineMeeting: true,
        onlineMeetingProvider: 'teamsForBusiness'
      };

      const response = await fetch('https://graph.microsoft.com/v1.0/me/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(meetingData)
      });

      if (!response.ok) {
        throw new Error(`Microsoft Graph API error: ${response.statusText}`);
      }

      const teamsEvent = await response.json();

      return {
        meetingId: teamsEvent.id,
        joinUrl: teamsEvent.onlineMeeting?.joinUrl || '',
        joinWebUrl: teamsEvent.onlineMeeting?.joinWebUrl || '',
        conferenceId: teamsEvent.onlineMeeting?.conferenceId || '',
        organizerId: teamsEvent.organizer?.emailAddress?.address || '',
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Teams meeting creation failed:', error);
      throw new Error('Failed to create Teams meeting');
    }
  }

  private async getMicrosoftAccessToken(): Promise<string> {
    try {
      const response = await fetch(`${this.apiUrl}/microsoft/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clientId: this.msClientId,
          clientSecret: this.msClientSecret,
          tenantId: this.msTenantId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get Microsoft access token');
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Microsoft auth failed:', error);
      throw error;
    }
  }

  // Main meeting creation function
  async createMeeting(meeting: Partial<Meeting>): Promise<CreateMeetingResponse> {
    if (this.isDevelopment) {
      return mockMeetingService.createMeeting(meeting as Meeting);
    }
    
    try {
      const meetingLinks: MeetingLinks = {
        primary: meeting.type === 'online' ? 'google-meet' : 'physical'
      };

      // Create meeting links based on type
      if (meeting.type === 'online' || meeting.type === 'hybrid') {
        switch (meeting.location?.toLowerCase()) {
          case 'google-meet':
          case 'meet':
            meetingLinks.googleMeet = await this.createGoogleMeetEvent(meeting);
            meetingLinks.primary = 'google-meet';
            break;
          case 'zoom':
            meetingLinks.zoom = await this.createZoomMeeting(meeting);
            meetingLinks.primary = 'zoom';
            break;
          case 'teams':
          case 'microsoft-teams':
            meetingLinks.teams = await this.createTeamsMeeting(meeting);
            meetingLinks.primary = 'teams';
            break;
          default:
            // Default to Google Meet
            meetingLinks.googleMeet = await this.createGoogleMeetEvent(meeting);
            meetingLinks.primary = 'google-meet';
        }
      }

      // Save meeting to IAOMS database
      const savedMeeting = await this.saveMeetingToDatabase({
        ...meeting,
        meetingLinks,
        id: `meeting-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date()
      } as Meeting);

      // Send notifications
      const notifications = await this.sendMeetingNotifications(savedMeeting);

      return {
        meeting: savedMeeting,
        meetingLinks,
        notifications
      };
    } catch (error) {
      console.error('Meeting creation failed:', error);
      throw error;
    }
  }

  // Conflict checking with AI suggestions
  async checkConflicts(meeting: Partial<Meeting>): Promise<ConflictCheck> {
    if (this.isDevelopment) {
      return mockMeetingService.checkConflicts(meeting);
    }
    
    try {
      const response = await fetch(`${this.apiUrl}/meetings/conflicts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date: meeting.date,
          time: meeting.time,
          duration: meeting.duration,
          attendees: meeting.attendees?.map(a => a.id)
        })
      });

      return await response.json();
    } catch (error) {
      console.error('Conflict check failed:', error);
      return { hasConflict: false, conflicts: [], suggestions: [] };
    }
  }

  // AI-powered scheduling suggestions
  async getAISchedulingSuggestions(meeting: Partial<Meeting>): Promise<AISchedulingSuggestion> {
    if (this.isDevelopment) {
      return mockMeetingService.getAISchedulingSuggestions(meeting);
    }
    
    try {
      const response = await fetch(`${this.apiUrl}/meetings/ai-suggestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: meeting.title,
          description: meeting.description,
          attendees: meeting.attendees?.map(a => a.id),
          preferredDuration: meeting.duration,
          department: meeting.department,
          priority: meeting.priority
        })
      });

      return await response.json();
    } catch (error) {
      console.error('AI suggestions failed:', error);
      throw error;
    }
  }

  // Attendance tracking
  async trackAttendance(meetingId: string): Promise<AttendanceRecord[]> {
    try {
      const response = await fetch(`${this.apiUrl}/meetings/${meetingId}/attendance`);
      return await response.json();
    } catch (error) {
      console.error('Attendance tracking failed:', error);
      return [];
    }
  }

  // Meeting management
  async updateMeeting(meetingId: string, updates: Partial<Meeting>): Promise<Meeting> {
    try {
      const response = await fetch(`${this.apiUrl}/meetings/${meetingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      return await response.json();
    } catch (error) {
      console.error('Meeting update failed:', error);
      throw error;
    }
  }

  async cancelMeeting(meetingId: string, reason?: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/meetings/${meetingId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });

      return response.ok;
    } catch (error) {
      console.error('Meeting cancellation failed:', error);
      return false;
    }
  }

  async generateMOM(meetingId: string): Promise<string> {
    try {
      const response = await fetch(`${this.apiUrl}/meetings/${meetingId}/mom`, {
        method: 'POST'
      });

      const data = await response.json();
      return data.momUrl;
    } catch (error) {
      console.error('MOM generation failed:', error);
      throw error;
    }
  }

  // Helper methods
  private formatDateTime(date: string, time: string, durationMinutes?: number): string {
    const [hours, minutes] = time.split(':');
    const meetingDate = new Date(date);
    meetingDate.setHours(parseInt(hours), parseInt(minutes));
    
    if (durationMinutes) {
      meetingDate.setMinutes(meetingDate.getMinutes() + durationMinutes);
    }
    
    return meetingDate.toISOString();
  }

  private formatISODateTime(date: string, time: string, durationMinutes?: number): string {
    return this.formatDateTime(date, time, durationMinutes);
  }

  private async saveMeetingToDatabase(meeting: Meeting): Promise<Meeting> {
    try {
      const response = await fetch(`${this.apiUrl}/meetings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(meeting)
      });

      return await response.json();
    } catch (error) {
      console.error('Database save failed:', error);
      throw error;
    }
  }

  private async sendMeetingNotifications(meeting: Meeting): Promise<any[]> {
    try {
      const response = await fetch(`${this.apiUrl}/meetings/${meeting.id}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return await response.json();
    } catch (error) {
      console.error('Notification sending failed:', error);
      return [];
    }
  }
}

export const meetingAPI = new MeetingAPIService();
