/**
 * Authentication and authorization system with role-based access control
 * Ensures proper separation between parent, child, and admin roles
 */

export type UserRole = 'parent' | 'child' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  childProfiles?: ChildProfile[];
  createdAt: Date;
  lastLogin?: Date;
  consentGiven?: boolean;
  consentDate?: Date;
}

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  avatar: string;
  parentId: string;
  learningLevel: string;
  createdAt: Date;
  lastActivity?: Date;
}

export interface AuthContextType {
  user: User | null;
  child: ChildProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, name: string, consent: boolean) => Promise<boolean>;
  logout: () => void;
  switchToChild: (childId: string) => void;
  switchToParent: () => void;
  hasPermission: (permission: string) => boolean;
}

// Permission definitions for role-based access control
export const PERMISSIONS = {
  // Parent permissions
  PARENT_VIEW_DASHBOARD: 'parent:view_dashboard',
  PARENT_MANAGE_CHILDREN: 'parent:manage_children',
  PARENT_VIEW_PROGRESS: 'parent:view_progress',
  PARENT_MANAGE_SUBSCRIPTION: 'parent:manage_subscription',
  PARENT_DELETE_ACCOUNT: 'parent:delete_account',
  
  // Child permissions
  CHILD_VIEW_LESSONS: 'child:view_lessons',
  CHILD_COMPLETE_LESSONS: 'child:complete_lessons',
  CHILD_VIEW_BADGES: 'child:view_badges',
  
  // Admin permissions
  ADMIN_VIEW_ANALYTICS: 'admin:view_analytics',
  ADMIN_MANAGE_USERS: 'admin:manage_users',
  ADMIN_VIEW_AUDIT_LOGS: 'admin:view_audit_logs',
} as const;

// Role permission mapping
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  parent: [
    PERMISSIONS.PARENT_VIEW_DASHBOARD,
    PERMISSIONS.PARENT_MANAGE_CHILDREN,
    PERMISSIONS.PARENT_VIEW_PROGRESS,
    PERMISSIONS.PARENT_MANAGE_SUBSCRIPTION,
    PERMISSIONS.PARENT_DELETE_ACCOUNT,
  ],
  child: [
    PERMISSIONS.CHILD_VIEW_LESSONS,
    PERMISSIONS.CHILD_COMPLETE_LESSONS,
    PERMISSIONS.CHILD_VIEW_BADGES,
  ],
  admin: [
    PERMISSIONS.ADMIN_VIEW_ANALYTICS,
    PERMISSIONS.ADMIN_MANAGE_USERS,
    PERMISSIONS.ADMIN_VIEW_AUDIT_LOGS,
    ...Object.values(PERMISSIONS), // Admin has all permissions
  ],
};

// Check if user has specific permission
export const hasPermission = (user: User | null, permission: string): boolean => {
  if (!user) return false;
  return ROLE_PERMISSIONS[user.role].includes(permission);
};

// Check if user can access parent-only features
export const isParentAccess = (user: User | null): boolean => {
  return user?.role === 'parent' || user?.role === 'admin';
};

// Check if user can access child-only features
export const isChildAccess = (user: User | null): boolean => {
  return user?.role === 'child';
};

// Check if user can access admin features
export const isAdminAccess = (user: User | null): boolean => {
  return user?.role === 'admin';
};

// Age verification for consent requirements
export const requiresParentalConsent = (age: number): boolean => {
  return age < 13; // COPPA threshold
};

// Data minimization - only collect essential fields
export const ESSENTIAL_DATA_FIELDS = {
  parent: ['email', 'name'],
  child: ['name', 'age', 'avatar', 'learningLevel'],
  progress: ['lessonId', 'completion', 'timestamp', 'score'],
} as const;
