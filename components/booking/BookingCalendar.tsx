"use client";

import { useEffect, useMemo, useState } from "react";
import { MESES, DIAS_CORTO, DIAS_LARGO, fmtDate, getSlots } from "@/lib/dates";
import { SALON } from "@/lib/constants";
import { getAllBooked, getDayBooked } from "@/lib/booking";
import { useBookedRealtime } from "@/hooks/useBookedRealtime";
import { Reveal } from "@/components/ui/Reveal";

interface BookingCalendarProps {
  onSelectSlot: (dateStr: string, timeStr: string) => void;
  refreshSignal?: number;
}

export function BookingCalendar({ onSelectSlot, refreshSignal = 0 }: BookingCalendarProps) {
  const now = useMemo(() => new Date(), []);
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [fullDays, setFullDays] = useState<Set<string>>(new Set());
  const [daySlots, setDaySlots] = useState<{ time: string; taken: boolean }[]>([]);
  const bookedRealtimeVersion = useBookedRealtime();
  const bookedVersion = bookedRealtimeVersion + refreshSignal;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const allBooked = await getAllBooked();
      if (cancelled) return;
      const full = new Set<string>();
      const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const ds = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const bookedCount = allBooked[ds] ? Object.keys(allBooked[ds]).length : 0;
        if (bookedCount >= getSlots(ds).length) full.add(ds);
      }
      setFullDays(full);
    })();
    return () => {
      cancelled = true;
    };
  }, [calYear, calMonth, bookedVersion]);

  useEffect(() => {
    if (!selectedDate) return;
    let cancelled = false;
    (async () => {
      const booked = await getDayBooked(selectedDate);
      if (cancelled) return;
      const bookedKeys = Object.keys(booked);
      setDaySlots(
        getSlots(selectedDate).map((t) => ({
          time: t,
          taken: bookedKeys.includes(t.replace(":", "-")),
        })),
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedDate, bookedVersion]);

  function goPrev() {
    let m = calMonth - 1;
    let y = calYear;
    if (m < 0) {
      m = 11;
      y--;
    }
    setCalMonth(m);
    setCalYear(y);
  }

  function goNext() {
    let m = calMonth + 1;
    let y = calYear;
    if (m > 11) {
      m = 0;
      y++;
    }
    setCalMonth(m);
    setCalYear(y);
  }

  const cells = useMemo(() => {
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayDs = fmtDate(today);

    const out: { day: number | null; ds: string; status: "past" | "closed" | "full" | "avail" }[] = [];
    for (let i = 0; i < offset; i++) out.push({ day: null, ds: "", status: "closed" });
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(calYear, calMonth, day);
      const ds = fmtDate(d);
      let status: "past" | "closed" | "full" | "avail";
      if (d < today) status = "past";
      else if (!SALON.diasAbiertos.includes(d.getDay())) status = "closed";
      else if (fullDays.has(ds)) status = "full";
      else status = "avail";
      out.push({ day, ds, status });
    }
    return { cells: out, todayDs };
  }, [calYear, calMonth, fullDays]);

  const selectedLabel = selectedDate
    ? (() => {
        const d = new Date(selectedDate + "T12:00:00");
        return `${DIAS_LARGO[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()].toLowerCase()}`;
      })()
    : "";

  return (
    <div className="cal-layout">
      <Reveal className="cal-box reveal-left">
        <div className="cal-head">
          <button className="cal-nav-btn" onClick={goPrev}>
            &#8592;
          </button>
          <div className="cal-month-label">
            {MESES[calMonth]} {calYear}
          </div>
          <button className="cal-nav-btn" onClick={goNext}>
            &#8594;
          </button>
        </div>
        <div className="cal-grid">
          {DIAS_CORTO.map((d) => (
            <div className="cal-dh" key={d}>
              {d}
            </div>
          ))}
          {cells.cells.map((c, i) => {
            if (c.day === null) return <div className="cal-day" key={"empty-" + i} />;
            const classes = ["cal-day"];
            if (c.status === "past") classes.push("past");
            else if (c.status === "closed") classes.push("closed");
            else if (c.status === "full") classes.push("full");
            else {
              classes.push("avail");
              if (c.ds === selectedDate) classes.push("selected");
              if (c.ds === cells.todayDs) classes.push("today-ring");
            }
            return (
              <div
                key={c.ds}
                className={classes.join(" ")}
                style={c.status === "full" ? { cursor: "default" } : undefined}
                onClick={c.status === "avail" ? () => setSelectedDate(c.ds) : undefined}
              >
                {c.day}
              </div>
            );
          })}
        </div>
      </Reveal>

      <Reveal className="slots-box reveal-right">
        {!selectedDate ? (
          <div className="slots-empty">
            <svg viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            <span>
              Selecciona un día
              <br />
              para ver los horarios
            </span>
          </div>
        ) : (
          <div>
            <div className="slots-day-label">{selectedLabel}</div>
            <div className="slots-grid">
              {daySlots.map((s) => (
                <button
                  key={s.time}
                  className={`slot-btn${s.taken ? " taken" : ""}`}
                  disabled={s.taken}
                  onClick={() => onSelectSlot(selectedDate, s.time)}
                >
                  {s.time}
                </button>
              ))}
            </div>
          </div>
        )}
      </Reveal>
    </div>
  );
}
