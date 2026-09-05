export enum Permission {
  // Personnel
  PERSONNEL_VIEW = 'personnel:view',
  PERSONNEL_CREATE = 'personnel:create',
  PERSONNEL_EDIT = 'personnel:edit',
  PERSONNEL_DELETE = 'personnel:delete',

  // Wellness & Risk
  WELLNESS_VIEW = 'wellness:view',
  RISK_ANALYTICS_VIEW = 'risk:analytics:view',
  RISK_EXPLAINABILITY_VIEW = 'risk:explainability:view',

  // Interventions
  INTERVENTIONS_VIEW = 'interventions:view',
  INTERVENTIONS_CREATE = 'interventions:create',
  INTERVENTIONS_ASSIGN = 'interventions:assign',
  INTERVENTIONS_CLOSE = 'interventions:close',

  // System Administration
  USERS_MANAGE = 'users:manage',
  ROLES_MANAGE = 'roles:manage',
  SYSTEM_CONFIG = 'system:config',
  AUDIT_VIEW = 'audit:view',
}
