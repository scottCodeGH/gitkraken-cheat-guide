export interface GuideSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  subsections?: GuideSubsection[];
}

export interface GuideSubsection {
  id: string;
  title: string;
  content: string;
  tips?: string[];
  shortcuts?: Shortcut[];
  examples?: Example[];
}

export interface Shortcut {
  keys: string[];
  description: string;
  platform?: 'windows' | 'mac' | 'linux' | 'all';
}

export interface Example {
  title: string;
  description: string;
  steps: string[];
}

export interface UserProgress {
  completedSections: string[];
  bookmarkedSections: string[];
  lastVisited?: string;
}

export interface UserPreferences {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  sidebarCollapsed: boolean;
  operatingSystem: 'windows' | 'mac' | 'linux';
}
