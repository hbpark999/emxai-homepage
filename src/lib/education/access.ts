import { createHmac, timingSafeEqual } from "crypto";
import type { StudentCourse } from "@/data/student-courses";

export function getCoursePassword(course: StudentCourse) {
  return process.env[course.passwordEnv] ?? "";
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
