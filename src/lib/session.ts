/**
 * Session management and autosave utilities
 * Prevents data loss during session timeouts and provides persistent progress
 */

import React from 'react';

export interface SessionData {
  userId: string;
  parentName: string;
  childProfiles: any[];
  lessonProgress: Record<string, LessonCheckpoint>;
  lastActivity: Date;
  expiresAt: Date;
}

export interface LessonCheckpoint {
  lessonId: string;
  currentCard: number;
  showQuiz: boolean;
  selectedAnswer: number | null;
  attempts: number;
  masteryScore: number;
  isComplete: boolean;
  timestamp: Date;
  weeklyMinutes: number;
}

export interface AutosaveConfig {
  interval: number; // milliseconds
  maxRetries: number;
  storageKey: string;
}

class SessionManager {
  private readonly SESSION_KEY = 'futurxplore_session';
  private readonly AUTOSAVE_KEY = 'futurxplore_autosave';
  private readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  private autosaveIntervals: Map<string, NodeJS.Timeout> = new Map();

  // Initialize session
  initializeSession(userData: Omit<SessionData, 'lastActivity' | 'expiresAt'>): void {
    const sessionData: SessionData = {
      ...userData,
      lastActivity: new Date(),
      expiresAt: new Date(Date.now() + this.SESSION_DURATION)
    };

    this.saveSession(sessionData);
    console.log('[Session] Session initialized for user:', userData.userId);
  }

  // Save session to localStorage
  private saveSession(sessionData: SessionData): void {
    try {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
    } catch (error) {
      console.error('[Session] Failed to save session:', error);
    }
  }

  // Load session from localStorage
  loadSession(): SessionData | null {
    try {
      const stored = localStorage.getItem(this.SESSION_KEY);
      if (stored) {
        const sessionData = JSON.parse(stored);
        
        // Check if session is expired
        if (new Date() > new Date(sessionData.expiresAt)) {
          console.log('[Session] Session expired');
          this.handleSessionExpired(sessionData);
          return null;
        }

        // Update last activity
        sessionData.lastActivity = new Date();
        this.saveSession(sessionData);
        
        return sessionData;
      }
    } catch (error) {
      console.error('[Session] Failed to load session:', error);
    }
    return null;
  }

  // Handle session expiration gracefully
  private handleSessionExpired(expiredSession: SessionData): void {
    // Save lesson progress before clearing session
    const autosaveData = this.loadAutosaveData();
    if (autosaveData && Object.keys(autosaveData).length > 0) {
      console.log('[Session] Preserving lesson progress from expired session');
      
      // Merge autosave data into expired session for recovery
      expiredSession.lessonProgress = {
        ...expiredSession.lessonProgress,
        ...autosaveData
      };
    }

    // Clear expired session
    localStorage.removeItem(this.SESSION_KEY);
    
    // Store recovery data temporarily
    localStorage.setItem('futurxplore_session_recovery', JSON.stringify({
      expiredSession,
      recoveredAt: new Date()
    }));

    // Trigger session expired event
    window.dispatchEvent(new CustomEvent('sessionExpired', {
      detail: { expiredSession }
    }));
  }

  // Extend session
  extendSession(): void {
    const session = this.loadSession();
    if (session) {
      session.expiresAt = new Date(Date.now() + this.SESSION_DURATION);
      this.saveSession(session);
      console.log('[Session] Session extended');
    }
  }

  // Clear session
  clearSession(): void {
    localStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem('futurxplore_session_recovery');
    console.log('[Session] Session cleared');
  }

  // Autosave lesson progress
  startAutosave(lessonId: string, config: Partial<AutosaveConfig> = {}): void {
    const autosaveConfig: AutosaveConfig = {
      interval: 5000, // 5 seconds
      maxRetries: 3,
      storageKey: `${this.AUTOSAVE_KEY}_${lessonId}`,
      ...config
    };

    // Clear existing interval for this lesson
    this.stopAutosave(lessonId);

    const interval = setInterval(() => {
      this.performAutosave(lessonId, autosaveConfig);
    }, autosaveConfig.interval);

    this.autosaveIntervals.set(lessonId, interval);
    console.log(`[Autosave] Started for lesson ${lessonId}`);
  }

  // Stop autosave for specific lesson
  stopAutosave(lessonId: string): void {
    const interval = this.autosaveIntervals.get(lessonId);
    if (interval) {
      clearInterval(interval);
      this.autosaveIntervals.delete(lessonId);
      console.log(`[Autosave] Stopped for lesson ${lessonId}`);
    }
  }

  // Perform autosave operation
  private performAutosave(lessonId: string, config: AutosaveConfig): void {
    try {
      // Get current lesson state from DOM or global state
      const checkpoint = this.captureLessonCheckpoint(lessonId);
      
      if (checkpoint) {
        const autosaveData = this.loadAutosaveData();
        autosaveData[lessonId] = checkpoint;
        
        localStorage.setItem(config.storageKey, JSON.stringify(autosaveData));
        console.log(`[Autosave] Saved checkpoint for lesson ${lessonId}`);
      }
    } catch (error) {
      console.error(`[Autosave] Failed to save lesson ${lessonId}:`, error);
    }
  }

  // Capture current lesson state
  private captureLessonCheckpoint(lessonId: string): LessonCheckpoint | null {
    try {
      // Get lesson state from DOM elements
      const currentChunkElement = document.querySelector('[data-current-chunk]');
      const quizElement = document.querySelector('[data-quiz-active]');
      const attemptsElement = document.querySelector('[data-attempts]');

      if (!currentChunkElement) return null;

      const checkpoint: LessonCheckpoint = {
        lessonId,
        currentCard: parseInt(currentChunkElement.getAttribute('data-current-chunk') || '0'),
        showQuiz: quizElement?.getAttribute('data-quiz-active') === 'true',
        selectedAnswer: null, // Would need to get from component state
        attempts: attemptsElement ? parseInt(attemptsElement.getAttribute('data-attempts') || '0') : 0,
        masteryScore: 0, // Calculated on completion
        isComplete: false, // Updated on completion
        timestamp: new Date(),
        weeklyMinutes: 0 // Would need to track time spent
      };

      return checkpoint;
    } catch (error) {
      console.error('[Autosave] Failed to capture checkpoint:', error);
      return null;
    }
  }

  // Load autosave data
  loadAutosaveData(): Record<string, LessonCheckpoint> {
    try {
      const stored = localStorage.getItem(this.AUTOSAVE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('[Autosave] Failed to load autosave data:', error);
      return {};
    }
  }

  // Recover lesson progress
  recoverLessonProgress(lessonId: string): LessonCheckpoint | null {
    const autosaveData = this.loadAutosaveData();
    return autosaveData[lessonId] || null;
  }

  // Clear autosave data for completed lesson
  clearAutosave(lessonId: string): void {
    const autosaveData = this.loadAutosaveData();
    delete autosaveData[lessonId];
    localStorage.setItem(this.AUTOSAVE_KEY, JSON.stringify(autosaveData));
    console.log(`[Autosave] Cleared for completed lesson ${lessonId}`);
  }

  // Get session recovery data
  getRecoveryData(): { expiredSession: SessionData | null; recoveredAt: Date | null } {
    try {
      const stored = localStorage.getItem('futurxplore_session_recovery');
      if (stored) {
        const recoveryData = JSON.parse(stored);
        // Clear recovery data after retrieval
        localStorage.removeItem('futurxplore_session_recovery');
        return recoveryData;
      }
    } catch (error) {
      console.error('[Session] Failed to load recovery data:', error);
    }
    return { expiredSession: null, recoveredAt: null };
  }

  // Check session validity
  isSessionValid(): boolean {
    const session = this.loadSession();
    return session !== null;
  }

  // Get session info
  getSessionInfo(): { userId: string | null; timeRemaining: number } {
    const session = this.loadSession();
    if (!session) {
      return { userId: null, timeRemaining: 0 };
    }

    const timeRemaining = Math.max(0, session.expiresAt.getTime() - Date.now());
    return {
      userId: session.userId,
      timeRemaining: Math.floor(timeRemaining / 1000 / 60) // minutes
    };
  }

  // Cleanup all autosave intervals
  cleanup(): void {
    for (const [lessonId, interval] of this.autosaveIntervals) {
      clearInterval(interval);
    }
    this.autosaveIntervals.clear();
    console.log('[Session] Cleanup completed');
  }
}

// Global session manager instance
export const sessionManager = new SessionManager();

// React hook for session management
export const useSessionManager = () => {
  const [sessionValid, setSessionValid] = React.useState(false);
  const [timeRemaining, setTimeRemaining] = React.useState(0);

  React.useEffect(() => {
    const checkSession = () => {
      const valid = sessionManager.isSessionValid();
      const info = sessionManager.getSessionInfo();
      
      setSessionValid(valid);
      setTimeRemaining(info.timeRemaining);

      if (!valid && info.userId) {
        // Session expired, trigger recovery flow
        window.dispatchEvent(new CustomEvent('sessionExpired'));
      }
    };

    // Check immediately
    checkSession();

    // Set up periodic checks
    const interval = setInterval(checkSession, 60000); // Check every minute

    return () => {
      clearInterval(interval);
    };
  }, []);

  const extendSession = () => {
    sessionManager.extendSession();
    const info = sessionManager.getSessionInfo();
    setTimeRemaining(info.timeRemaining);
  };

  return {
    sessionValid,
    timeRemaining,
    extendSession,
    initializeSession: sessionManager.initializeSession.bind(sessionManager),
    clearSession: sessionManager.clearSession.bind(sessionManager),
    startAutosave: sessionManager.startAutosave.bind(sessionManager),
    stopAutosave: sessionManager.stopAutosave.bind(sessionManager),
    recoverProgress: sessionManager.recoverLessonProgress.bind(sessionManager)
  };
};

// Export types for global usage
