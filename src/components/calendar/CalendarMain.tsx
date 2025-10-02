/* eslint-disable @typescript-eslint/no-explicit-any */
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import resourceDayGridPlugin from "@fullcalendar/resource-daygrid";
import { useRef, useState, useEffect } from "react";
import { Button, Col, Row, Space, DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";

import {
  CalendarOutlined,
  LeftOutlined,
  RightOutlined,
  PlusOutlined,
} from "@ant-design/icons";

// Calendar constants
const CALENDAR_CONFIG = {
  MIN_HEIGHT: 400,
  FOOTER_PADDING: 80,
  FIRST_DAY: 1,
  SLOT_MIN_TIME: "06:00:00",
  SLOT_MAX_TIME: "22:00:00",
  SLOT_DURATION: "00:15:00",
  RESOURCE_AREA_WIDTH: "15%",
} as const;

const CALENDAR_VIEWS = {
  RESOURCE_DAY: "resourceTimeGridDay",
  RESOURCE_WEEK: "resourceTimeGridWeek",
  MONTH: "dayGridMonth",
  WEEK: "timeGridWeek",
  DAY: "timeGridDay",
  LIST: "listWeek",
} as const;

const SCHEDULER_LICENSE_KEY = "CC-Attribution-NonCommercial-NoDerivatives";

// Type definitions - using FullCalendar's built-in types
type CalendarEvent = any; // FullCalendar's EventInput type
type CalendarResource = any; // FullCalendar's ResourceInput type
type DateClickArg = any; // FullCalendar's DateClickArg type
type EventClickArg = any; // FullCalendar's EventClickArg type

interface CalendarMainProps {
  events: CalendarEvent[];
  resources?: CalendarResource[];
  onDateClick: (arg: DateClickArg) => void;
  onEventClick: (arg: EventClickArg) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  setCurrentDate: (date: Dayjs) => void;
  currentDate: Dayjs;
  setEndDate: (date: Dayjs) => void;
  endDate?: Dayjs;
  onCreate: () => void;
}

// Custom hook for calendar height calculation
const useCalendarHeight = (
  wrapperRef: React.RefObject<HTMLDivElement | null>
) => {
  const [calendarHeight, setCalendarHeight] = useState<string>("auto");

  useEffect(() => {
    const calculateHeight = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const rect = wrapper.getBoundingClientRect();
      const availableHeight =
        window.innerHeight - rect.top - CALENDAR_CONFIG.FOOTER_PADDING;

      if (availableHeight > CALENDAR_CONFIG.MIN_HEIGHT) {
        setCalendarHeight(`${availableHeight}px`);
      } else {
        setCalendarHeight(`${CALENDAR_CONFIG.MIN_HEIGHT}px`);
      }
    };

    calculateHeight();
    window.addEventListener("resize", calculateHeight);
    return () => window.removeEventListener("resize", calculateHeight);
  }, [wrapperRef]);

  return calendarHeight;
};

export default function CalendarMain({
  events,
  resources = [],
  onDateClick,
  onEventClick,
  currentView,
  setCurrentView,
  setCurrentDate,
  currentDate,
  setEndDate,
  onCreate,
}: CalendarMainProps) {
  const { i18n, t } = useTranslation();

  const calendarRef = useRef<FullCalendar | null>(null);
  const calendarWrapperRef = useRef<HTMLDivElement>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const calendarHeight = useCalendarHeight(calendarWrapperRef);

  // Calendar navigation handlers
  const handleToday = () => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.today();
  };

  const handlePrev = () => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.prev();
  };

  const handleNext = () => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.next();
  };

  const handleDateSelect = (date: Dayjs | null) => {
    if (date) {
      const calendarApi = calendarRef.current?.getApi();
      calendarApi?.gotoDate(date.toDate());
      setCurrentDate(date);
    }
  };

  const changeView = (viewName: string) => {
    setCurrentView(viewName);
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.changeView(viewName);
  };

  // Helper functions
  const hasResources = resources && resources.length > 0;

  const getInitialView = () => {
    return hasResources ? CALENDAR_VIEWS.RESOURCE_DAY : currentView;
  };

  const formatCurrentDate = () => {
    return hasResources
      ? currentDate.format("ddd, MMM DD, YYYY")
      : currentDate.add(1, "month").format("MMMM YYYY");
  };
  return (
    <>
      <Row justify="space-between" align="middle" gutter={[8, 8]}>
        {/* Left - View mode buttons + New button */}
        <Col flex="auto">
          <Space size="small">
            <Space.Compact>
              {hasResources ? (
                <>
                  <Button
                    type={
                      currentView === CALENDAR_VIEWS.RESOURCE_DAY
                        ? "primary"
                        : undefined
                    }
                    onClick={() => changeView(CALENDAR_VIEWS.RESOURCE_DAY)}>
                    {t("View by day")}
                  </Button>
                  <Button
                    type={
                      currentView === CALENDAR_VIEWS.RESOURCE_WEEK
                        ? "primary"
                        : undefined
                    }
                    onClick={() => changeView(CALENDAR_VIEWS.RESOURCE_WEEK)}>
                    {t("View by week")}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type={
                      currentView === CALENDAR_VIEWS.MONTH
                        ? "primary"
                        : undefined
                    }
                    onClick={() => changeView(CALENDAR_VIEWS.MONTH)}>
                    {t("Month")}
                  </Button>
                  <Button
                    type={
                      currentView === CALENDAR_VIEWS.WEEK
                        ? "primary"
                        : undefined
                    }
                    onClick={() => changeView(CALENDAR_VIEWS.WEEK)}>
                    {t("Week")}
                  </Button>
                  <Button
                    type={
                      currentView === CALENDAR_VIEWS.DAY ? "primary" : undefined
                    }
                    onClick={() => changeView(CALENDAR_VIEWS.DAY)}>
                    {t("Day")}
                  </Button>
                  <Button
                    type={
                      currentView === CALENDAR_VIEWS.LIST
                        ? "primary"
                        : undefined
                    }
                    onClick={() => changeView(CALENDAR_VIEWS.LIST)}>
                    {t("Next to")}
                  </Button>
                </>
              )}
            </Space.Compact>
            <Button type="primary" onClick={onCreate} icon={<PlusOutlined />}>
              {t("New")}
            </Button>
          </Space>
        </Col>

        {/* Center - Navigation controls + Current date */}
        <Col flex="auto">
          <div style={{ textAlign: "center" }}>
            <Space
              size="small"
              style={{ display: "inline-flex", alignItems: "center" }}>
              <Button icon={<LeftOutlined />} onClick={handlePrev} />
              <Button onClick={handleToday}>{t("Today")}</Button>
              <Button
                icon={<CalendarOutlined />}
                onClick={() => setDatePickerOpen(true)}
              />
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  padding: "0 12px",
                }}>
                {formatCurrentDate()}
              </div>
              <Button icon={<RightOutlined />} onClick={handleNext} />
            </Space>
          </div>
          <DatePicker
            open={datePickerOpen}
            onOpenChange={setDatePickerOpen}
            onChange={handleDateSelect}
            value={currentDate}
            format="DD/MM/YYYY"
            style={{
              position: "absolute",
              visibility: "hidden",
              width: 0,
              height: 0,
              zIndex: 2,
            }}
          />
        </Col>

        {/* Right - Empty for balance */}
        <Col flex="auto"></Col>
        <Col span={24} ref={calendarWrapperRef}>
          <FullCalendar
            ref={calendarRef}
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              listPlugin,
              interactionPlugin,
              resourceTimeGridPlugin,
              resourceDayGridPlugin,
            ]}
            initialView={getInitialView()}
            schedulerLicenseKey={SCHEDULER_LICENSE_KEY}
            headerToolbar={false}
            events={events}
            resources={hasResources ? resources : undefined}
            dateClick={onDateClick}
            eventClick={onEventClick}
            height={calendarHeight}
            firstDay={CALENDAR_CONFIG.FIRST_DAY}
            locale={i18n.language}
            allDaySlot={false}
            slotMinTime={CALENDAR_CONFIG.SLOT_MIN_TIME}
            slotMaxTime={CALENDAR_CONFIG.SLOT_MAX_TIME}
            slotDuration={CALENDAR_CONFIG.SLOT_DURATION}
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }}
            titleFormat={{ year: "numeric", month: "numeric" }}
            datesSet={(arg) => {
              setCurrentDate(dayjs(arg.start));
              setEndDate(dayjs(arg.end));
            }}
            resourceAreaHeaderContent={
              hasResources ? t("Staff (All)") : undefined
            }
            resourceAreaWidth={
              hasResources ? CALENDAR_CONFIG.RESOURCE_AREA_WIDTH : undefined
            }
            dayHeaderClassNames={() => "custom-header-cell"}
            dayHeaderDidMount={(info) => {
              Object.assign(info.el.style, {
                backgroundColor: "#e4eeef",
                color: "#333",
                fontWeight: "600",
                padding: "10px 0",
                textAlign: "center",
                borderBottom: "1px solid #eee",
                fontSize: "14px",
              });
            }}
            resourceLabelContent={(arg) => {
              const resource = arg.resource;
              const bookingCount = events.filter(
                (e) => e.resourceId === resource.id
              ).length;
              return (
                <div style={{ padding: "8px" }}>
                  <div style={{ fontWeight: "600" }}>{resource.title}</div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    ({bookingCount})
                  </div>
                </div>
              );
            }}
            eventContent={(arg) => {
              const { event } = arg;
              const startTime = event.extendedProps?.startTime || "00:00";
              const phone = event.extendedProps?.phone || "";
              const serviceName = event.extendedProps?.productName || "";
              return (
                <div
                  style={{
                    padding: "4px 6px",
                    overflow: "hidden",
                    fontSize: "12px",
                    lineHeight: "1.3",
                  }}>
                  <div style={{ fontWeight: "600" }}>{event.title}</div>
                  <div>{phone}</div>
                  <div style={{ fontSize: "11px" }}>{serviceName}</div>
                  <div style={{ fontSize: "11px", marginTop: "2px" }}>
                    {startTime}
                  </div>
                </div>
              );
            }}
          />
        </Col>
      </Row>
    </>
  );
}
