/**
 * Deterministic simulation of the sample workspace: 800 days of trading for Harbor & Pine Supply Co.,
 * a fictional outdoor-goods retailer. Every tile, chart, table and AI answer in the demo reads from
 * these rows, so the numbers reconcile everywhere they appear.
 */
import { addDays } from "date-fns";

import { isSameDate, weekdayIndex } from "@/lib/dates";
import { createRng } from "@/lib/random";
import type { DayRow } from "@/types/dashboard";

import { CHANNEL, CHANNEL_CVR, CHANNEL_SHARE, REGION_SHARE } from "./dimensions";

export const END_DATE = new Date(2026, 8, 24);
export const DAY_COUNT = 800;

/** Paid social was paused on these days while the fall creative was in review. */
export const PAUSED_SOCIAL_DAYS = [new Date(2026, 8, 16), new Date(2026, 8, 17), new Date(2026, 8, 18)];

/** Day-of-week multipliers, Monday first. */
const WEEKDAY = [0.94, 0.95, 0.97, 0.99, 1.04, 1.08, 1.05];

const MONTH_SEASONALITY: Record<number, number> = {
  0: 0.82,
  1: 0.86,
  2: 0.95,
  3: 0.97,
  4: 1.02,
  5: 1.04,
  6: 0.98,
  7: 0.97,
  8: 1.0,
  9: 1.05,
};

function seasonality(d: Date): number {
  const m = d.getMonth();
  const day = d.getDate();
  if (m === 10 && day >= 27 && day <= 30) return 1.95; // Black Friday → Cyber Monday
  if (m === 10 && day >= 20) return 1.35;
  if (m === 10) return 1.12;
  if (m === 11) return day <= 20 ? 1.42 : 1.08;
  return MONTH_SEASONALITY[m];
}

/** The paused campaign was West-heavy: move most of that day's lost revenue onto the West region. */
function shiftLossToWest(regions: number[], lostRevenue: number): number[] {
  if (!lostRevenue) return regions;
  const extra = lostRevenue * (0.72 - REGION_SHARE[0]);
  const rest = regions.slice(1).reduce((a, b) => a + b, 0);
  return [regions[0] - extra, ...regions.slice(1).map((r) => r + (extra * r) / rest)];
}

function simulate(): DayRow[] {
  const rng = createRng(20260924);
  const rows: DayRow[] = [];

  for (let i = 0; i < DAY_COUNT; i++) {
    const date = addDays(END_DATE, -(DAY_COUNT - 1 - i));
    const wd = weekdayIndex(date);
    const month = date.getMonth();
    const q4 = month === 10 || month === 11;
    const bfcm = month === 10 && date.getDate() >= 24;
    const growth = 1 + 0.27 * (i / 365);
    const base = 7400 * growth * seasonality(date) * WEEKDAY[wd] * rng.uniform(0.95, 1.05);

    let pausedLoss = 0;
    const channelSessions = CHANNEL_SHARE.map((share, k) => {
      let v = base * share * rng.uniform(0.93, 1.07);
      if (k === CHANNEL.email && wd === 1) v *= 1.55; // Tuesday newsletter
      if (k === CHANNEL.paidSocial && PAUSED_SOCIAL_DAYS.some((p) => isSameDate(p, date))) {
        pausedLoss = v * 0.66;
        v -= pausedLoss;
      }
      return v;
    });
    const sessions = channelSessions.reduce((a, b) => a + b, 0);

    const channelOrders = channelSessions.map(
      (s, k) => s * CHANNEL_CVR[k] * rng.uniform(0.92, 1.08) * (q4 ? 1.12 : 1),
    );
    const orders = channelOrders.reduce((a, b) => a + b, 0);
    const aov = (86.5 + (q4 ? 7.5 : 0) + 3 * (i / 365)) * rng.uniform(0.97, 1.03);

    const discountRate = bfcm ? 0.172 : rng.uniform(0.074, 0.092);
    const returnRate = rng.uniform(0.058, 0.07) + (month === 0 ? 0.012 : 0);
    const net = orders * aov;
    const gross = net / (1 - discountRate - returnRate);
    const marginRate = (bfcm ? 0.492 : 0.566) + rng.uniform(-0.012, 0.012);

    const mix = [
      0.38 + (q4 ? 0.05 : 0),
      0.24,
      0.22 - (q4 || month < 2 ? 0.04 : 0) + (month === 5 || month === 6 ? 0.04 : 0),
      0.16,
    ];
    const mixTotal = mix.reduce((a, b) => a + b, 0);

    const spendSearch = channelSessions[CHANNEL.paidSearch] * 0.96 * rng.uniform(0.95, 1.05);
    const spendSocial = channelSessions[CHANNEL.paidSocial] * 0.82 * rng.uniform(0.95, 1.05);
    const newCustomers = orders * rng.uniform(0.55, 0.6);
    const regions = shiftLossToWest(
      REGION_SHARE.map((r) => net * r * rng.uniform(0.94, 1.06)),
      pausedLoss * CHANNEL_CVR[CHANNEL.paidSocial] * aov,
    );

    rows.push({
      date,
      sessions,
      channelSessions,
      channelOrders,
      channelRevenue: channelOrders.map((o) => o * aov),
      orders,
      net,
      gross,
      discounts: gross * discountRate,
      returns: gross * returnRate,
      margin: net * marginRate,
      newCustomers,
      categories: mix.map((c) => (net * c) / mixTotal),
      regions,
      spend: [spendSearch, spendSocial],
      productViews: sessions * rng.uniform(0.61, 0.65),
      addToCart: sessions * rng.uniform(0.098, 0.108),
      checkouts: sessions * rng.uniform(0.051, 0.056),
    });
  }
  return rows;
}

export const DAYS: readonly DayRow[] = simulate();

export function dayIndex(date: Date): number {
  return DAYS.findIndex((r) => isSameDate(r.date, date));
}
