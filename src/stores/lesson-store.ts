import { create } from "zustand";
import type { Exercise, Lesson, UserProgress } from "@prisma/client";

interface LessonWithRelations extends Lesson {
  exercises: Exercise[];
  progress: UserProgress[];
}

interface LessonStore {
  currentLesson: LessonWithRelations | null;
  setCurrentLesson: (lesson: LessonWithRelations | null) => void;
  reset: () => void;
}

export const useLessonStore = create<LessonStore>((set) => ({
  currentLesson: null,
  setCurrentLesson: (lesson) => set({ currentLesson: lesson }),
  reset: () => set({ currentLesson: null }),
})); 