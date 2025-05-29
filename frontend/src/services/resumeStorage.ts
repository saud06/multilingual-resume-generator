export interface SavedResume {
  id: string;
  title: string;
  content: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    title: string;
    summary: string;
  };
  experiences: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    location: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  skills: string[];
  languages: string[];
  projects: string[];
  language: 'en' | 'de';
  style: 'german' | 'international';
  createdAt: string;
  updatedAt: string;
  isFallback: boolean;
}

class ResumeStorageService {
  private readonly STORAGE_KEY = 'saved_resumes';

  // Get all saved resumes
  getAllResumes(): SavedResume[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading resumes:', error);
      return [];
    }
  }

  // Save a new resume
  saveResume(resumeData: Omit<SavedResume, 'id' | 'createdAt' | 'updatedAt'>): SavedResume {
    const resumes = this.getAllResumes();
    const now = new Date().toISOString();
    
    const newResume: SavedResume = {
      ...resumeData,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
    };

    resumes.unshift(newResume); // Add to beginning
    this.saveToStorage(resumes);
    
    return newResume;
  }

  // Update an existing resume
  updateResume(id: string, updates: Partial<SavedResume>): SavedResume | null {
    const resumes = this.getAllResumes();
    const index = resumes.findIndex(r => r.id === id);
    
    if (index === -1) return null;
    
    const updatedResume = {
      ...resumes[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    resumes[index] = updatedResume;
    this.saveToStorage(resumes);
    
    return updatedResume;
  }

  // Delete a resume
  deleteResume(id: string): boolean {
    const resumes = this.getAllResumes();
    const filteredResumes = resumes.filter(r => r.id !== id);
    
    if (filteredResumes.length === resumes.length) return false;
    
    this.saveToStorage(filteredResumes);
    return true;
  }

  // Get a specific resume
  getResume(id: string): SavedResume | null {
    const resumes = this.getAllResumes();
    return resumes.find(r => r.id === id) || null;
  }

  // Duplicate a resume
  duplicateResume(id: string): SavedResume | null {
    const original = this.getResume(id);
    if (!original) return null;
    
    const duplicate = {
      ...original,
      title: `${original.title} (Copy)`,
    };
    
    // Remove id, createdAt, updatedAt so saveResume creates new ones
    const { id: _, createdAt: __, updatedAt: ___, ...resumeData } = duplicate;
    
    return this.saveResume(resumeData);
  }

  // Generate a unique ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Save to localStorage
  private saveToStorage(resumes: SavedResume[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(resumes));
    } catch (error) {
      console.error('Error saving resumes:', error);
    }
  }

  // Clear all resumes (for testing)
  clearAll(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Export resumes as JSON
  exportResumes(): string {
    return JSON.stringify(this.getAllResumes(), null, 2);
  }

  // Import resumes from JSON
  importResumes(jsonData: string): boolean {
    try {
      const imported = JSON.parse(jsonData);
      if (Array.isArray(imported)) {
        this.saveToStorage(imported);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing resumes:', error);
      return false;
    }
  }
}

export const resumeStorage = new ResumeStorageService();
