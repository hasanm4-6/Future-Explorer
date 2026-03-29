/**
 * Audit logging system for major account actions
 * Tracks important events for compliance and security monitoring
 */

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
}

export interface AuditEvent {
  action: string;
  resource: string;
  details?: Record<string, any>;
  severity?: 'low' | 'medium' | 'high';
}

// Major audit events that must be logged
export const AUDIT_EVENTS = {
  // Account management
  ACCOUNT_CREATED: 'account_created',
  ACCOUNT_DELETED: 'account_deleted',
  PASSWORD_CHANGED: 'password_changed',
  EMAIL_UPDATED: 'email_updated',
  
  // Child profile management
  CHILD_PROFILE_CREATED: 'child_profile_created',
  CHILD_PROFILE_UPDATED: 'child_profile_updated',
  CHILD_PROFILE_DELETED: 'child_profile_deleted',
  
  // Subscription management
  SUBSCRIPTION_STARTED: 'subscription_started',
  SUBSCRIPTION_CANCELLED: 'subscription_cancelled',
  SUBSCRIPTION_CHANGED: 'subscription_changed',
  
  // Data management
  DATA_EXPORTED: 'data_exported',
  DATA_DELETED: 'data_deleted',
  CONSENT_GIVEN: 'consent_given',
  CONSENT_WITHDRAWN: 'consent_withdrawn',
  
  // Security events
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILED: 'login_failed',
  LOGOUT: 'logout',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity',
  
  // Learning progress
  LESSON_COMPLETED: 'lesson_completed',
  BADGE_EARNED: 'badge_earned',
} as const;

class AuditLogger {
  private logs: AuditLog[] = [];
  private readonly STORAGE_KEY = 'futurxplore_audit_logs';
  private readonly MAX_LOGS = 1000; // Keep last 1000 logs

  // Log an audit event
  log(event: AuditEvent, userId: string): void {
    const log: AuditLog = {
      id: this.generateId(),
      userId,
      action: event.action,
      resource: event.resource,
      details: event.details || {},
      timestamp: new Date(),
      severity: event.severity || 'medium',
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent,
    };

    this.addLog(log);
    this.persistLogs();
    
    // Log to console in development
    if (import.meta.env.DEV) {
      console.log(`[Audit] ${event.action}:`, log);
    }
  }

  // Add log to memory
  private addLog(log: AuditLog): void {
    this.logs.unshift(log);
    
    // Keep only the most recent logs
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(0, this.MAX_LOGS);
    }
  }

  // Persist logs to localStorage
  private persistLogs(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.logs));
    } catch (error) {
      console.error('[Audit] Failed to persist logs:', error);
    }
  }

  // Load logs from localStorage
  loadLogs(): AuditLog[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.logs = JSON.parse(stored);
        return this.logs;
      }
    } catch (error) {
      console.error('[Audit] Failed to load logs:', error);
    }
    return [];
  }

  // Get logs for a specific user
  getUserLogs(userId: string, limit: number = 100): AuditLog[] {
    return this.logs
      .filter(log => log.userId === userId)
      .slice(0, limit);
  }

  // Get logs by action type
  getLogsByAction(action: string, limit: number = 100): AuditLog[] {
    return this.logs
      .filter(log => log.action === action)
      .slice(0, limit);
  }

  // Get high-severity logs
  getHighSeverityLogs(limit: number = 50): AuditLog[] {
    return this.logs
      .filter(log => log.severity === 'high')
      .slice(0, limit);
  }

  // Clear old logs (older than 1 year)
  clearOldLogs(): void {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    this.logs = this.logs.filter(log => log.timestamp > oneYearAgo);
    this.persistLogs();
  }

  // Export logs for compliance
  exportLogs(userId?: string): string {
    const logsToExport = userId 
      ? this.getUserLogs(userId)
      : this.logs;
    
    return JSON.stringify({
      exportedAt: new Date().toISOString(),
      totalLogs: logsToExport.length,
      logs: logsToExport,
    }, null, 2);
  }

  // Generate unique ID for logs
  private generateId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get client IP (simplified - in production, this would come from server)
  private getClientIP(): string {
    return 'client_ip_not_available';
  }

  // Clear all logs (for testing/data deletion)
  clearAllLogs(): void {
    this.logs = [];
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

// Global audit logger instance
export const auditLogger = new AuditLogger();

// Convenience functions for common audit events
export const auditAccountCreated = (userId: string, email: string) => {
  auditLogger.log({
    action: AUDIT_EVENTS.ACCOUNT_CREATED,
    resource: 'user_account',
    details: { email },
    severity: 'medium'
  }, userId);
};

export const auditChildProfileCreated = (userId: string, childName: string, childAge: number) => {
  auditLogger.log({
    action: AUDIT_EVENTS.CHILD_PROFILE_CREATED,
    resource: 'child_profile',
    details: { childName, childAge },
    severity: 'medium'
  }, userId);
};

export const auditDataExported = (userId: string, dataType: string) => {
  auditLogger.log({
    action: AUDIT_EVENTS.DATA_EXPORTED,
    resource: dataType,
    details: { dataType },
    severity: 'medium'
  }, userId);
};

export const auditDataDeleted = (userId: string, dataType: string) => {
  auditLogger.log({
    action: AUDIT_EVENTS.DATA_DELETED,
    resource: dataType,
    details: { dataType },
    severity: 'high'
  }, userId);
};

export const auditConsentGiven = (userId: string, consentType: string) => {
  auditLogger.log({
    action: AUDIT_EVENTS.CONSENT_GIVEN,
    resource: 'consent',
    details: { consentType },
    severity: 'high'
  }, userId);
};

// Initialize audit logger on load
auditLogger.loadLogs();
