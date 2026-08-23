import { createHmac, timingSafeEqual } from "crypto";
import type { StudentCourse } from "@/data/student-courses";

const defaultCoursePasswords: Record<string, string> = {
  EDU_PASS_RAPA_AI_EM_ANALYSIS_SIM_DAY3: "12345678910",
  EDU_PASS_RAPA_DRC_AI_PCB_DAY3: "2345678910",
  EDU_PASS_RAPA_EMC_GENAI: "345678910",
  EDU_PASS_RAPA_EMI_SI_GENAI_DAY2: "45678910",
  EDU_PASS_RAPA_EM_ANALYSIS_DESIGN_DAY2: "5678910",
  EDU_PASS_TTA_POWER_NOISE_DAY2: "678910",
};

export function getCoursePassword(course: StudentCourse) {
  return process.env[course.passwordEnv] ?? defaultCoursePasswords[course.passwordEnv] ?? "";
}

export function isCoursePasswordConfigured(course: StudentCourse) {
  return getCoursePassword(course).length > 0;
}

export function createAccessToken(course: StudentCourse) {
  const password = getCoursePassword(course);

  if (!password) {
    return "";
  }

  return createHmac("sha256", password).update(course.slug).digest("hex");
}

export function verifyAccessToken(course: StudentCourse, token: string | undefined) {
  const expected = createAccessToken(course);

  if (!expected || !token || expected.length !== token.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}

export function getAccessCookieName(course: StudentCourse) {
  return `edu_access_${course.slug}`;
}
