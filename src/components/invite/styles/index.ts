import type { Layout } from '@/lib/themes';
import type { StyleView } from './common';
import { rajwada } from './Rajwada';
import { bagh } from './Bagh';
import { patrika } from './Patrika';
import { mehfil } from './Mehfil';
import { filmy } from './Filmy';
import { lifafa } from './Lifafa';
import { kovil } from './Kovil';
import { jaali } from './Jaali';

/** Every styled look; 'classic' is rendered by InviteView/ThemeSwatch themselves. */
export const STYLE_VIEWS: Record<Exclude<Layout, 'classic'>, StyleView> = { rajwada, bagh, patrika, mehfil, filmy, lifafa, kovil, jaali };
