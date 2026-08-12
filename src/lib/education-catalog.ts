import fs from "node:fs";
import path from "node:path";

export type EducationSlide = {
  title: string;
  src: string;
};

export type EducationSection = {
  id: string;
  title: string;
  folder: string;
  slides: EducationSlide[];
};

const eduRoot = path.join(process.cwd(), "public", "edu");

const sectionLabels: Record<string, string> = {
  "0. 개요": "0. 개요",
  "1. AI코딩": "1. AI코딩",
  "2. Z0계산": "2. Z0계산",
  "3. S-parameter": "3. S-parameter",
  "4. De-cap": "4. De-cap",
  "5. Simulation자동화": "5. Simulation자동화",
  "6. 마무리": "6. 마무리",
};

function byNumericPrefix(a: string, b: string) {
  const aNumber = Number(a.match(/^\d+/)?.[0] ?? Number.MAX_SAFE_INTEGER);
  const bNumber = Number(b.match(/^\d+/)?.[0] ?? Number.MAX_SAFE_INTEGER);

  if (aNumber !== bNumber) {
    return aNumber - bNumber;
  }

  return a.localeCompare(b, "ko");
}

function toSectionId(folder: string) {
  return `education-${folder
    .replace(/^\d+\.\s*/, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9가-힣-]/g, "")
    .toLowerCase()}`;
}

function toSlideTitle(fileName: string) {
  return fileName.replace(/\.(png|jpg|jpeg|webp)$/i, "");
}

function toPublicPath(folder: string, fileName: string) {
  return `/edu/${folder}/${fileName}`;
}

export function getEducationCatalog(): EducationSection[] {
  if (!fs.existsSync(eduRoot)) {
    return [];
  }

  return fs
    .readdirSync(eduRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort(byNumericPrefix)
    .map((folder) => {
      const folderPath = path.join(eduRoot, folder);
      const slides = fs
        .readdirSync(folderPath, { withFileTypes: true })
        .filter((entry) => entry.isFile() && /\.(png|jpg|jpeg|webp)$/i.test(entry.name))
        .map((entry) => entry.name)
        .sort(byNumericPrefix)
        .map((fileName) => ({
          title: toSlideTitle(fileName),
          src: toPublicPath(folder, fileName),
        }));

      return {
        id: toSectionId(folder),
        title: sectionLabels[folder] ?? folder,
        folder,
        slides,
      };
    });
}
