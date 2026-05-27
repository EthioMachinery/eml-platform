export function containsEnglish(
  text: string
): boolean {
  return /[A-Za-z]/.test(text);
}

export function isMissingTranslation(
  value: string
): boolean {
  if (!value) return true;

  return value.trim().length === 0;
}

export function auditTranslationObject(
  obj: Record<string, any>,
  path = ""
): string[] {
  const issues: string[] = [];

  Object.entries(obj).forEach(
    ([key, value]) => {
      const currentPath = path
        ? `${path}.${key}`
        : key;

      if (
        typeof value === "string"
      ) {
        if (
          isMissingTranslation(
            value
          )
        ) {
          issues.push(
            `Missing translation: ${currentPath}`
          );
        }
      }

      if (
        typeof value === "object" &&
        value !== null
      ) {
        issues.push(
          ...auditTranslationObject(
            value,
            currentPath
          )
        );
      }
    }
  );

  return issues;
}