"use client";

import { useLanguage } from '../context/LanguageContext';
import { translations } from '../lib/i18n/translations';
import { TranslationSchema } from '../translations/keys';

// Nested Key extraction helper types for strict path typing
type PathsToStringProps<T> = T extends string
 