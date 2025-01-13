import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';
import { Pathnames, LocalePrefix } from "next-intl/routing";
 
export const defaultLocale = "en" as const;
export const locales = ["en", "zh"];

export const pathnames: Pathnames<typeof locales> = {
  "/": "/",
};

export const localePrefix: LocalePrefix<typeof locales> = "always";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: locales,
 
  // Used when no locale matches
  defaultLocale: defaultLocale,
  localePrefix,
  pathnames
});
 
// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);